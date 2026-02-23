#include "CraneActor.h"
#include "FREQSimulation.h"

ACraneActor::ACraneActor()
{
	PrimaryActorTick.bCanEverTick = true;

	CraneBase = CreateDefaultSubobject<USceneComponent>(TEXT("CraneBase"));
	RootComponent = CraneBase;

	TowerMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("TowerMesh"));
	TowerMesh->SetupAttachment(CraneBase);

	BoomPivot = CreateDefaultSubobject<USceneComponent>(TEXT("BoomPivot"));
	BoomPivot->SetupAttachment(TowerMesh);
	BoomPivot->SetRelativeLocation(FVector(0.0f, 0.0f, 1500.0f));

	BoomMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BoomMesh"));
	BoomMesh->SetupAttachment(BoomPivot);

	BucketMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BucketMesh"));
	BucketMesh->SetupAttachment(BoomMesh);
}

void ACraneActor::BeginPlay()
{
	Super::BeginPlay();
	UE_LOG(LogFREQSim, Log, TEXT("Crane initialized: boom length %.0f cm, max rotation %.0f deg"),
		BoomLength, MaxBoomRotation);
}

void ACraneActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (bEmergencyStopped)
	{
		return;
	}

	// Interpolate boom rotation toward target
	CurrentBoomRotation = FMath::FInterpTo(CurrentBoomRotation, TargetBoomRotation, DeltaTime, RotationSpeed);

	// Interpolate extension toward target
	CurrentExtension = FMath::FInterpTo(CurrentExtension, TargetExtension, DeltaTime, ExtensionSpeed);

	// Apply rotation to boom pivot (yaw)
	if (BoomPivot)
	{
		FRotator BoomRot = BoomPivot->GetRelativeRotation();
		BoomRot.Yaw = CurrentBoomRotation;
		BoomPivot->SetRelativeRotation(BoomRot);
	}

	// Apply extension to boom mesh (scale X for reach)
	if (BoomMesh)
	{
		float ExtendedLength = FMath::Lerp(0.5f, 1.0f, CurrentExtension);
		BoomMesh->SetRelativeScale3D(FVector(ExtendedLength, 1.0f, 1.0f));
	}
}

void ACraneActor::SetBoomTarget(float TargetRotationDeg, float TargetExtensionPercent)
{
	TargetBoomRotation = FMath::Clamp(TargetRotationDeg, -MaxBoomRotation * 0.5f, MaxBoomRotation * 0.5f);
	TargetExtension = FMath::Clamp(TargetExtensionPercent, 0.0f, 1.0f);
}

void ACraneActor::SetSweepPosition(float NormalizedPosition)
{
	CurrentSweepPos = FMath::Clamp(NormalizedPosition, 0.0f, 1.0f);

	// Map normalized position to a boom rotation that sweeps the barge length
	float SweepAngle = FMath::Lerp(-60.0f, 60.0f, CurrentSweepPos);
	TargetBoomRotation = SweepAngle;
}

void ACraneActor::SetBucketActive(bool bActive)
{
	bBucketActive = bActive;

	if (BucketMesh)
	{
		BucketMesh->SetVisibility(bActive);
	}
}

void ACraneActor::EmergencyStop()
{
	bEmergencyStopped = true;
	UE_LOG(LogFREQSim, Warning, TEXT("CRANE EMERGENCY STOP ACTIVATED"));
}

void ACraneActor::ResumeOperations()
{
	bEmergencyStopped = false;
	UE_LOG(LogFREQSim, Log, TEXT("Crane operations resumed"));
}

FVector ACraneActor::GetBucketWorldPosition() const
{
	if (BucketMesh)
	{
		return BucketMesh->GetComponentLocation();
	}
	return GetActorLocation();
}
