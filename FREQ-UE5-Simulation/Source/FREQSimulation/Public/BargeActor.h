#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "SimulationPhase.h"
#include "BargeActor.generated.h"

/**
 * 195ft x 35ft jumbo hopper barge with draft marks, cargo hold, and deck fittings.
 * Manages waterline interaction, cargo fill visualization, and hull draft state.
 */
UCLASS(Blueprintable)
class FREQSIMULATION_API ABargeActor : public AActor
{
	GENERATED_BODY()

public:
	ABargeActor();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;

	// --- Cargo Operations ---

	/** Set cargo fill level (0.0 = empty, 1.0 = full). Drives hold fill mesh and waterline. */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Barge")
	void SetCargoFillLevel(float FillPercent);

	UFUNCTION(BlueprintPure, Category = "FREQ|Barge")
	float GetCargoFillLevel() const { return CargoFillLevel; }

	/** Get current draft readings based on cargo load and trim/heel */
	UFUNCTION(BlueprintPure, Category = "FREQ|Barge")
	FDraftReadings GetDraftReadings() const;

	/** Get current stability metrics */
	UFUNCTION(BlueprintPure, Category = "FREQ|Barge")
	FStabilityMetrics GetStabilityMetrics() const;

	// --- Visual Updates ---

	/** Adjust barge Z-position and rotation to reflect current draft/trim/heel */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Barge")
	void UpdateWaterlinePosition();

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	USceneComponent* SceneRoot;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	UStaticMeshComponent* HullMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	UStaticMeshComponent* CargoHoldMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	UStaticMeshComponent* CargoFillMesh;

	// --- Barge Dimensions (cm, UE5 units) ---

	/** Barge length: 195ft = 5943.6 cm */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Dimensions")
	float BargeLength = 5943.6f;

	/** Barge beam: 35ft = 1066.8 cm */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Dimensions")
	float BargeBeam = 1066.8f;

	/** Barge depth: 12ft = 365.76 cm */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Dimensions")
	float BargeDepth = 365.76f;

	/** Light draft (empty) in feet */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Draft")
	float LightDraftFt = 1.5f;

	/** Loaded draft (full cargo) in feet */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Draft")
	float LoadedDraftFt = 9.0f;

	/** Maximum allowable cargo tonnage */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Cargo")
	float MaxCargoTons = 1500.0f;

private:
	float CargoFillLevel = 0.0f;

	/** Compute draft in feet at a given fill level */
	float ComputeDraftAtFill(float Fill) const;
};
