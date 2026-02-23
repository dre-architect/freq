#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CraneActor.generated.h"

/**
 * Shore-based crane with articulated boom for cargo loading operations.
 * Supports boom rotation, extension, bucket animation, and position sweep along barge length.
 */
UCLASS(Blueprintable)
class FREQSIMULATION_API ACraneActor : public AActor
{
	GENERATED_BODY()

public:
	ACraneActor();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;

	// --- Crane Operations ---

	/** Move the crane boom to target rotation and extension */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Crane")
	void SetBoomTarget(float TargetRotationDeg, float TargetExtensionPercent);

	/** Sweep the crane along the barge length (0.0 = bow, 1.0 = stern) */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Crane")
	void SetSweepPosition(float NormalizedPosition);

	/** Start/stop bucket drop animation */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Crane")
	void SetBucketActive(bool bActive);

	/** Emergency stop — halt all crane movement */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Crane")
	void EmergencyStop();

	/** Resume operations after emergency stop */
	UFUNCTION(BlueprintCallable, Category = "FREQ|Crane")
	void ResumeOperations();

	UFUNCTION(BlueprintPure, Category = "FREQ|Crane")
	bool IsStopped() const { return bEmergencyStopped; }

	UFUNCTION(BlueprintPure, Category = "FREQ|Crane")
	FVector GetBucketWorldPosition() const;

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	USceneComponent* CraneBase;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	UStaticMeshComponent* TowerMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	USceneComponent* BoomPivot;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	UStaticMeshComponent* BoomMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	UStaticMeshComponent* BucketMesh;

	// --- Crane Configuration ---

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Config")
	float MaxBoomRotation = 270.0f;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Config")
	float BoomLength = 2500.0f;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Config")
	float RotationSpeed = 30.0f;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "FREQ|Config")
	float ExtensionSpeed = 50.0f;

private:
	float CurrentBoomRotation = 0.0f;
	float CurrentExtension = 0.0f;
	float TargetBoomRotation = 0.0f;
	float TargetExtension = 0.0f;
	float CurrentSweepPos = 0.0f;
	bool bBucketActive = false;
	bool bEmergencyStopped = false;
};
