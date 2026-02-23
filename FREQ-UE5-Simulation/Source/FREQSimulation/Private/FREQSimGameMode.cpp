#include "FREQSimGameMode.h"
#include "SimulationController.h"
#include "FREQSimulation.h"
#include "Kismet/GameplayStatics.h"

AFREQSimGameMode::AFREQSimGameMode()
{
	DefaultPawnClass = nullptr;
}

void AFREQSimGameMode::BeginPlay()
{
	Super::BeginPlay();

	UE_LOG(LogFREQSim, Log, TEXT("FREQ Simulation GameMode initialized"));

	StartSimulation();
}

void AFREQSimGameMode::StartSimulation()
{
	// Find existing SimulationController in the level
	TArray<AActor*> Controllers;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), ASimulationController::StaticClass(), Controllers);

	if (Controllers.Num() > 0)
	{
		ASimulationController* Controller = Cast<ASimulationController>(Controllers[0]);
		if (Controller)
		{
			Controller->ResetSimulation();
			Controller->SetPhase(ESimulationPhase::InitialSurvey);
			UE_LOG(LogFREQSim, Log, TEXT("Simulation started via existing controller"));
		}
	}
	else
	{
		UE_LOG(LogFREQSim, Warning, TEXT("No SimulationController found in level"));
	}
}

void AFREQSimGameMode::ResetSimulation()
{
	TArray<AActor*> Controllers;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), ASimulationController::StaticClass(), Controllers);

	for (AActor* Actor : Controllers)
	{
		ASimulationController* Controller = Cast<ASimulationController>(Actor);
		if (Controller)
		{
			Controller->ResetSimulation();
		}
	}
}
