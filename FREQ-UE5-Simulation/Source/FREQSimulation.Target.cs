using UnrealBuildTool;

public class FREQSimulationTarget : TargetRules
{
	public FREQSimulationTarget(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Game;
		DefaultBuildSettings = BuildSettingsVersion.V4;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_4;
		ExtraModuleNames.Add("FREQSimulation");
	}
}
