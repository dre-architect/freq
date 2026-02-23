#include "SimulationController.h"
#include "BargeActor.h"
#include "CraneActor.h"
#include "MOBEventActor.h"
#include "FREQSimulation.h"
#include "Kismet/GameplayStatics.h"

ASimulationController::ASimulationController()
{
	PrimaryActorTick.bCanEverTick = true;

	CurrentPhase = ESimulationPhase::None;
	CargoLoadPercent = 0.0f;
	PhaseElapsedTime = 0.0f;
	SimulationElapsedTime = 0.0f;
	bMOBActive = false;
}

void ASimulationController::BeginPlay()
{
	Super::BeginPlay();

	// Auto-find actors if not set in editor
	if (!Barge)
	{
		Barge = Cast<ABargeActor>(UGameplayStatics::GetActorOfClass(GetWorld(), ABargeActor::StaticClass()));
	}
	if (!Crane)
	{
		Crane = Cast<ACraneActor>(UGameplayStatics::GetActorOfClass(GetWorld(), ACraneActor::StaticClass()));
	}
	if (!MOBEvent)
	{
		MOBEvent = Cast<AMOBEventActor>(UGameplayStatics::GetActorOfClass(GetWorld(), AMOBEventActor::StaticClass()));
	}

	UE_LOG(LogFREQSim, Log, TEXT("SimulationController ready. Barge=%s Crane=%s MOB=%s"),
		Barge ? TEXT("OK") : TEXT("MISSING"),
		Crane ? TEXT("OK") : TEXT("MISSING"),
		MOBEvent ? TEXT("OK") : TEXT("MISSING"));
}

void ASimulationController::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (CurrentPhase == ESimulationPhase::None)
	{
		return;
	}

	SimulationElapsedTime += DeltaTime;
	UpdatePhase(DeltaTime);
}

void ASimulationController::SetPhase(ESimulationPhase NewPhase)
{
	if (CurrentPhase != ESimulationPhase::None)
	{
		EndPhase(CurrentPhase);
	}

	CurrentPhase = NewPhase;
	PhaseElapsedTime = 0.0f;
	BeginPhase(NewPhase);
	OnPhaseChanged.Broadcast(NewPhase);

	UE_LOG(LogFREQSim, Log, TEXT("Phase changed to: %d"), static_cast<int32>(NewPhase));
}

void ASimulationController::AdvanceToNextPhase()
{
	switch (CurrentPhase)
	{
	case ESimulationPhase::InitialSurvey:
		SetPhase(ESimulationPhase::PreLoad);
		break;
	case ESimulationPhase::PreLoad:
		SetPhase(ESimulationPhase::ActiveLoad);
		break;
	case ESimulationPhase::ActiveLoad:
		SetPhase(ESimulationPhase::CargoLoad);
		break;
	case ESimulationPhase::CargoLoad:
		SetPhase(ESimulationPhase::PostLoad);
		break;
	case ESimulationPhase::PostLoad:
		SetPhase(ESimulationPhase::FinalSurvey);
		break;
	case ESimulationPhase::FinalSurvey:
		SetPhase(ESimulationPhase::None);
		UE_LOG(LogFREQSim, Log, TEXT("Simulation complete"));
		break;
	default:
		break;
	}
}

void ASimulationController::ResetSimulation()
{
	CurrentPhase = ESimulationPhase::None;
	CargoLoadPercent = 0.0f;
	PhaseElapsedTime = 0.0f;
	SimulationElapsedTime = 0.0f;
	bMOBActive = false;
	CurrentDraft = FDraftReadings();
	CurrentStability = FStabilityMetrics();

	if (Barge)
	{
		Barge->SetCargoFillLevel(0.0f);
	}
	if (Crane)
	{
		Crane->ResumeOperations();
		Crane->SetBucketActive(false);
		Crane->SetSweepPosition(0.0f);
	}
	if (MOBEvent && MOBEvent->IsMOBActive())
	{
		MOBEvent->ClearMOB();
	}

	UE_LOG(LogFREQSim, Log, TEXT("Simulation reset"));
}

void ASimulationController::UpdatePhase(float DeltaTime)
{
	PhaseElapsedTime += DeltaTime;

	float PhaseDuration = GetCurrentPhaseDuration();
	float PhaseAlpha = FMath::Clamp(PhaseElapsedTime / PhaseDuration, 0.0f, 1.0f);

	// Phase-specific logic
	switch (CurrentPhase)
	{
	case ESimulationPhase::ActiveLoad:
	{
		// Ramp cargo from 0% to 50% during Phase 3
		CargoLoadPercent = PhaseAlpha * 50.0f;
		if (Barge) Barge->SetCargoFillLevel(CargoLoadPercent / 100.0f);
		if (Crane)
		{
			Crane->SetBucketActive(true);
			Crane->SetSweepPosition(FMath::Sin(PhaseAlpha * PI) * 0.5f);
		}
		break;
	}
	case ESimulationPhase::CargoLoad:
	{
		// Ramp cargo from 50% to 100% during Phase 4
		CargoLoadPercent = 50.0f + PhaseAlpha * 50.0f;
		if (Barge) Barge->SetCargoFillLevel(CargoLoadPercent / 100.0f);
		if (Crane)
		{
			Crane->SetBucketActive(true);
			Crane->SetSweepPosition(0.5f + FMath::Sin(PhaseAlpha * PI) * 0.5f);
		}
		break;
	}
	case ESimulationPhase::PostLoad:
	{
		if (Crane)
		{
			Crane->SetBucketActive(false);
			Crane->SetBoomTarget(0.0f, 0.0f);
		}
		break;
	}
	default:
		break;
	}

	// Update readings
	UpdateDraftReadings();
	UpdateStabilityMetrics();
	OnCargoLoadUpdated.Broadcast(CargoLoadPercent);

	// Check MOB state
	if (MOBEvent)
	{
		bMOBActive = MOBEvent->IsMOBActive();
	}

	// Auto-advance when phase duration expires
	if (PhaseElapsedTime >= PhaseDuration && !bMOBActive)
	{
		AdvanceToNextPhase();
	}
}

void ASimulationController::BeginPhase(ESimulationPhase Phase)
{
	switch (Phase)
	{
	case ESimulationPhase::InitialSurvey:
		if (Barge) Barge->SetCargoFillLevel(0.0f);
		break;
	case ESimulationPhase::PreLoad:
		if (Crane) Crane->SetBoomTarget(45.0f, 0.5f);
		break;
	case ESimulationPhase::ActiveLoad:
		if (Crane) Crane->SetBucketActive(true);
		break;
	case ESimulationPhase::CargoLoad:
		break;
	case ESimulationPhase::PostLoad:
		if (Crane)
		{
			Crane->SetBucketActive(false);
			Crane->SetBoomTarget(0.0f, 0.0f);
		}
		break;
	case ESimulationPhase::FinalSurvey:
		break;
	default:
		break;
	}
}

void ASimulationController::EndPhase(ESimulationPhase Phase)
{
	// Cleanup per-phase state if needed
}

float ASimulationController::GetCurrentPhaseDuration() const
{
	switch (CurrentPhase)
	{
	case ESimulationPhase::InitialSurvey: return Phase1Duration;
	case ESimulationPhase::PreLoad:       return Phase2Duration;
	case ESimulationPhase::ActiveLoad:    return Phase3Duration;
	case ESimulationPhase::CargoLoad:     return Phase4Duration;
	case ESimulationPhase::PostLoad:      return Phase5Duration;
	case ESimulationPhase::FinalSurvey:   return Phase6Duration;
	default: return 1.0f;
	}
}

void ASimulationController::UpdateDraftReadings()
{
	if (Barge)
	{
		CurrentDraft = Barge->GetDraftReadings();
	}
}

void ASimulationController::UpdateStabilityMetrics()
{
	if (Barge)
	{
		CurrentStability = Barge->GetStabilityMetrics();
	}
}
