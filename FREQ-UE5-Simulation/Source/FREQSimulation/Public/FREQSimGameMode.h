#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "FREQSimGameMode.generated.h"

/**
 * Game mode for the FREQ barge drafting simulation.
 * Manages simulation lifecycle, phase transitions, and actor spawning.
 */
UCLASS()
class FREQSIMULATION_API AFREQSimGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	AFREQSimGameMode();

	virtual void BeginPlay() override;

	/** Start or restart the full 6-phase simulation sequence */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Simulation")
	void StartSimulation();

	/** Reset all actors and state to initial conditions */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Simulation")
	void ResetSimulation();

protected:
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Simulation")
	TSubclassOf<AActor> SimulationControllerClass;
};
