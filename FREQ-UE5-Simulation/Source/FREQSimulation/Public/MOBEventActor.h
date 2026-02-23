#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MOBEventActor.generated.h"

class ACraneActor;

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnMOBStateChanged, bool, bIsActive);

/**
 * Man-Overboard (MOB) safety event system.
 * Spawns a human figure on the barge deck during Phase 4, triggers crane halt,
 * displays warning indicators, and resumes operations after clearance.
 */
UCLASS(Blueprintable)
class FREQSIMULATION_API AMOBEventActor : public AActor
{
	GENERATED_BODY()

public:
	AMOBEventActor();

	virtual void Tick(float DeltaTime) override;

	/** Trigger MOB event — spawn human figure, halt crane */
	UFUNCTION(BlueprintCallable, Category = "FREQ|MOB")
	void TriggerMOB();

	/** Clear MOB event — remove human figure, resume crane */
	UFUNCTION(BlueprintCallable, Category = "FREQ|MOB")
	void ClearMOB();

	UFUNCTION(BlueprintPure, Category = "FREQ|MOB")
	bool IsMOBActive() const { return bMOBActive; }

	UPROPERTY(BlueprintAssignable, Category = "FREQ|Events")
	FOnMOBStateChanged OnMOBStateChanged;

protected:
	UPROPERTY(EditInstanceOnly, BlueprintReadWrite, Category = "FREQ|References")
	ACraneActor* LinkedCrane;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "FREQ|Components")
	UStaticMeshComponent* HumanFigureMesh;

	/** Duration in seconds the MOB event lasts before auto-clearance */
	UPROPERTY(EditDefaultsOnly, BlueprintReadWrite, Category = "FREQ|Config")
	float MOBDuration = 10.0f;

	/** Location on the barge deck where the human figure spawns (relative to barge) */
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "FREQ|Config")
	FVector SpawnOffset = FVector(0.0f, 0.0f, 200.0f);

private:
	bool bMOBActive = false;
	float MOBTimer = 0.0f;
};
