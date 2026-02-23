#include "MOBEventActor.h"
#include "CraneActor.h"
#include "FREQSimulation.h"

AMOBEventActor::AMOBEventActor()
{
	PrimaryActorTick.bCanEverTick = true;

	HumanFigureMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("HumanFigureMesh"));
	RootComponent = HumanFigureMesh;
	HumanFigureMesh->SetVisibility(false);
	HumanFigureMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);
}

void AMOBEventActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (!bMOBActive)
	{
		return;
	}

	MOBTimer += DeltaTime;

	if (MOBTimer >= MOBDuration)
	{
		ClearMOB();
	}
}

void AMOBEventActor::TriggerMOB()
{
	if (bMOBActive)
	{
		return;
	}

	bMOBActive = true;
	MOBTimer = 0.0f;

	// Show human figure on barge deck
	if (HumanFigureMesh)
	{
		HumanFigureMesh->SetVisibility(true);
		SetActorRelativeLocation(SpawnOffset);
	}

	// Halt crane operations
	if (LinkedCrane)
	{
		LinkedCrane->EmergencyStop();
	}

	OnMOBStateChanged.Broadcast(true);

	UE_LOG(LogFREQSim, Warning, TEXT("MOB EVENT TRIGGERED — Crane halted, human detected on deck"));
}

void AMOBEventActor::ClearMOB()
{
	if (!bMOBActive)
	{
		return;
	}

	bMOBActive = false;
	MOBTimer = 0.0f;

	// Hide human figure
	if (HumanFigureMesh)
	{
		HumanFigureMesh->SetVisibility(false);
	}

	// Resume crane operations
	if (LinkedCrane)
	{
		LinkedCrane->ResumeOperations();
	}

	OnMOBStateChanged.Broadcast(false);

	UE_LOG(LogFREQSim, Log, TEXT("MOB event cleared — Operations resumed"));
}
