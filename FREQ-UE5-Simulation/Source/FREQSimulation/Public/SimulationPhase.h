#pragma once

#include "CoreMinimal.h"
#include "SimulationPhase.generated.h"

/** The 6 operational phases of the barge drafting sequence */
UENUM(BlueprintType)
enum class ESimulationPhase : uint8
{
	InitialSurvey   UMETA(DisplayName = "INITIAL-SURV"),
	PreLoad         UMETA(DisplayName = "PRE-LOAD"),
	ActiveLoad      UMETA(DisplayName = "ACTIVE-LOAD"),
	CargoLoad       UMETA(DisplayName = "CARGO-LOAD"),
	PostLoad        UMETA(DisplayName = "POST-LOAD"),
	FinalSurvey     UMETA(DisplayName = "FINAL-SURV"),
	None            UMETA(DisplayName = "NONE")
};

/** Draft readings at the 4 hull measurement positions */
USTRUCT(BlueprintType)
struct FDraftReadings
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Draft")
	float Fore = 0.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Draft")
	float Aft = 0.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Draft")
	float Port = 0.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Draft")
	float Starboard = 0.0f;
};

/** Stability metrics for the barge */
USTRUCT(BlueprintType)
struct FStabilityMetrics
{
	GENERATED_BODY()

	/** Metacentric height in meters */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Stability")
	float GM = 0.0f;

	/** Trim angle in degrees (positive = stern down) */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Stability")
	float TrimAngle = 0.0f;

	/** Heel angle in degrees (positive = starboard down) */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Stability")
	float HeelAngle = 0.0f;
};
