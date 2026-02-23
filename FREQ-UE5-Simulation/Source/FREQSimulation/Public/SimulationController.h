#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "SimulationPhase.h"
#include "SimulationController.generated.h"

class ABargeActor;
class ACraneActor;
class AMOBEventActor;
class UDraftHUDWidget;

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnPhaseChanged, ESimulationPhase, NewPhase);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnCargoLoadUpdated, float, LoadPercent);

/**
 * Central orchestrator for the 6-phase barge drafting simulation.
 * Drives timeline-based sequences and coordinates Barge, Crane, and HUD actors.
 */
UCLASS(Blueprintable)
class FREQSIMULATION_API ASimulationController : public AActor
{
	GENERATED_BODY()

public:
	ASimulationController();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;

	// --- Phase Control ---

	UFUNCTION(BlueprintCallable, Category = "FREQ|Phase")
	void AdvanceToNextPhase();

	UFUNCTION(BlueprintCallable, Category = "FREQ|Phase")
	void SetPhase(ESimulationPhase NewPhase);

	UFUNCTION(BlueprintPure, Category = "FREQ|Phase")
	ESimulationPhase GetCurrentPhase() const { return CurrentPhase; }

	UFUNCTION(BlueprintCallable, Category = "FREQ|Simulation")
	void ResetSimulation();

	// --- Cargo ---

	UFUNCTION(BlueprintPure, Category = "FREQ|Cargo")
	float GetCargoLoadPercent() const { return CargoLoadPercent; }

	// --- Delegates ---

	UPROPERTY(BlueprintAssignable, Category = "FREQ|Events")
	FOnPhaseChanged OnPhaseChanged;

	UPROPERTY(BlueprintAssignable, Category = "FREQ|Events")
	FOnCargoLoadUpdated OnCargoLoadUpdated;

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|State")
	ESimulationPhase CurrentPhase;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|State")
	float CargoLoadPercent;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|State")
	float PhaseElapsedTime;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|State")
	float SimulationElapsedTime;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|State")
	FDraftReadings CurrentDraft;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|State")
	FStabilityMetrics CurrentStability;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|State")
	bool bMOBActive;

	// --- Phase durations (seconds) ---
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Config")
	float Phase1Duration = 20.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Config")
	float Phase2Duration = 15.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Config")
	float Phase3Duration = 45.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Config")
	float Phase4Duration = 45.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Config")
	float Phase5Duration = 15.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Config")
	float Phase6Duration = 20.0f;

	// --- Actor references (set in Blueprint or found at BeginPlay) ---
	UPROPERTY(EditInstanceOnly, BlueprintReadWrite, Category = "FREQ|References")
	ABargeActor* Barge;

	UPROPERTY(EditInstanceOnly, BlueprintReadWrite, Category = "FREQ|References")
	ACraneActor* Crane;

	UPROPERTY(EditInstanceOnly, BlueprintReadWrite, Category = "FREQ|References")
	AMOBEventActor* MOBEvent;

private:
	void UpdatePhase(float DeltaTime);
	void BeginPhase(ESimulationPhase Phase);
	void EndPhase(ESimulationPhase Phase);
	float GetCurrentPhaseDuration() const;
	void UpdateDraftReadings();
	void UpdateStabilityMetrics();
};
