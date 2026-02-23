#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "SimulationPhase.h"
#include "DraftHUDWidget.generated.h"

/**
 * UMG widget for the simulation HUD overlay.
 * Displays draft readings, phase indicator, cargo %, crane position,
 * stability metrics, and simulation timer.
 */
UCLASS(Blueprintable)
class FREQSIMULATION_API UDraftHUDWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	/** Update all HUD elements from simulation state */
	UFUNCTION(BlueprintCallable, Category = "FREQ|HUD")
	void UpdateHUD(
		ESimulationPhase Phase,
		const FDraftReadings& Draft,
		float CargoPercent,
		FVector CranePosition,
		const FStabilityMetrics& Stability,
		float ElapsedTime,
		bool bMOBActive
	);

	/** Show/hide the MOB warning indicators */
	UFUNCTION(BlueprintCallable, Category = "FREQ|HUD")
	void SetMOBWarningVisible(bool bVisible);

protected:
	// These are bound to UMG widgets in the Blueprint designer
	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* PhaseText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* DraftForeText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* DraftAftText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* DraftPortText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* DraftStarboardText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* CargoPercentText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* CranePositionText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* TimerText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* GMText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* TrimText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UTextBlock* HeelText;

	UPROPERTY(meta = (BindWidgetOptional))
	class UWidget* MOBWarningPanel;
};
