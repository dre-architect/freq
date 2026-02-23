#include "DraftHUDWidget.h"
#include "Components/TextBlock.h"

void UDraftHUDWidget::UpdateHUD(
	ESimulationPhase Phase,
	const FDraftReadings& Draft,
	float CargoPercent,
	FVector CranePosition,
	const FStabilityMetrics& Stability,
	float ElapsedTime,
	bool bMOBActive)
{
	// Phase indicator
	if (PhaseText)
	{
		const UEnum* PhaseEnum = StaticEnum<ESimulationPhase>();
		FString PhaseName = PhaseEnum->GetDisplayNameTextByValue(static_cast<int64>(Phase)).ToString();
		PhaseText->SetText(FText::FromString(FString::Printf(TEXT("Phase: %s"), *PhaseName)));
	}

	// Draft readings (feet)
	if (DraftForeText)
		DraftForeText->SetText(FText::FromString(FString::Printf(TEXT("Fore: %.2f ft"), Draft.Fore)));
	if (DraftAftText)
		DraftAftText->SetText(FText::FromString(FString::Printf(TEXT("Aft: %.2f ft"), Draft.Aft)));
	if (DraftPortText)
		DraftPortText->SetText(FText::FromString(FString::Printf(TEXT("Port: %.2f ft"), Draft.Port)));
	if (DraftStarboardText)
		DraftStarboardText->SetText(FText::FromString(FString::Printf(TEXT("Stbd: %.2f ft"), Draft.Starboard)));

	// Cargo percentage
	if (CargoPercentText)
		CargoPercentText->SetText(FText::FromString(FString::Printf(TEXT("Cargo: %.1f%%"), CargoPercent)));

	// Crane position (G-Code coordinates)
	if (CranePositionText)
		CranePositionText->SetText(FText::FromString(
			FString::Printf(TEXT("Crane: X%.0f Y%.0f Z%.0f"), CranePosition.X, CranePosition.Y, CranePosition.Z)));

	// Timer
	if (TimerText)
	{
		int32 Minutes = static_cast<int32>(ElapsedTime) / 60;
		int32 Seconds = static_cast<int32>(ElapsedTime) % 60;
		TimerText->SetText(FText::FromString(FString::Printf(TEXT("%02d:%02d"), Minutes, Seconds)));
	}

	// Stability metrics
	if (GMText)
		GMText->SetText(FText::FromString(FString::Printf(TEXT("GM: %.2f m"), Stability.GM)));
	if (TrimText)
		TrimText->SetText(FText::FromString(FString::Printf(TEXT("Trim: %.2f°"), Stability.TrimAngle)));
	if (HeelText)
		HeelText->SetText(FText::FromString(FString::Printf(TEXT("Heel: %.2f°"), Stability.HeelAngle)));

	// MOB warning
	SetMOBWarningVisible(bMOBActive);
}

void UDraftHUDWidget::SetMOBWarningVisible(bool bVisible)
{
	if (MOBWarningPanel)
	{
		MOBWarningPanel->SetVisibility(bVisible ? ESlateVisibility::Visible : ESlateVisibility::Collapsed);
	}
}
