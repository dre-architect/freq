#include "BargeActor.h"
#include "FREQSimulation.h"

ABargeActor::ABargeActor()
{
	PrimaryActorTick.bCanEverTick = true;

	SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("SceneRoot"));
	RootComponent = SceneRoot;

	HullMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("HullMesh"));
	HullMesh->SetupAttachment(SceneRoot);

	CargoHoldMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("CargoHoldMesh"));
	CargoHoldMesh->SetupAttachment(SceneRoot);

	CargoFillMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("CargoFillMesh"));
	CargoFillMesh->SetupAttachment(CargoHoldMesh);
	CargoFillMesh->SetRelativeScale3D(FVector(1.0f, 1.0f, 0.0f));
}

void ABargeActor::BeginPlay()
{
	Super::BeginPlay();

	UE_LOG(LogFREQSim, Log, TEXT("Barge initialized: %.1f ft x %.1f ft (%.0f cm x %.0f cm)"),
		BargeLength / 30.48f, BargeBeam / 30.48f, BargeLength, BargeBeam);
}

void ABargeActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	UpdateWaterlinePosition();
}

void ABargeActor::SetCargoFillLevel(float FillPercent)
{
	CargoFillLevel = FMath::Clamp(FillPercent, 0.0f, 1.0f);

	// Scale cargo fill mesh vertically based on fill level
	if (CargoFillMesh)
	{
		FVector NewScale = FVector(1.0f, 1.0f, CargoFillLevel);
		CargoFillMesh->SetRelativeScale3D(NewScale);
	}
}

FDraftReadings ABargeActor::GetDraftReadings() const
{
	float BaseDraft = ComputeDraftAtFill(CargoFillLevel);

	FDraftReadings Readings;
	// Simulate slight natural variation across hull positions
	Readings.Fore = BaseDraft - 0.1f;
	Readings.Aft = BaseDraft + 0.1f;
	Readings.Port = BaseDraft;
	Readings.Starboard = BaseDraft;

	return Readings;
}

FStabilityMetrics ABargeActor::GetStabilityMetrics() const
{
	FStabilityMetrics Metrics;

	// GM decreases as load increases (simplified model)
	Metrics.GM = FMath::Lerp(3.5f, 1.8f, CargoFillLevel);

	// Trim: slight stern-heavy trim increases with load
	Metrics.TrimAngle = CargoFillLevel * 0.3f;

	// Heel: minimal in ideal loading conditions
	Metrics.HeelAngle = FMath::Sin(CargoFillLevel * PI) * 0.1f;

	return Metrics;
}

void ABargeActor::UpdateWaterlinePosition()
{
	float DraftFt = ComputeDraftAtFill(CargoFillLevel);
	// Convert draft in feet to Z-offset in cm (1 ft = 30.48 cm)
	// As draft increases, the barge sinks — negative Z displacement
	float DraftDelta = (DraftFt - LightDraftFt) * 30.48f;
	FVector CurrentLoc = GetActorLocation();
	CurrentLoc.Z = -DraftDelta;
	SetActorLocation(CurrentLoc);

	// Apply slight trim rotation (pitch)
	FRotator CurrentRot = GetActorRotation();
	FStabilityMetrics Stability = GetStabilityMetrics();
	CurrentRot.Pitch = Stability.TrimAngle;
	CurrentRot.Roll = Stability.HeelAngle;
	SetActorRotation(CurrentRot);
}

float ABargeActor::ComputeDraftAtFill(float Fill) const
{
	return FMath::Lerp(LightDraftFt, LoadedDraftFt, Fill);
}
