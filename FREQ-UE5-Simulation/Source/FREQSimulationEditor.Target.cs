using UnrealBuildTool;

public class FREQSimulationEditorTarget : TargetRules
{
	public FREQSimulationEditorTarget(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Editor;
		DefaultBuildSettings = BuildSettingsVersion.V4;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_4;
		ExtraModuleNames.Add("FREQSimulation");
	}
}
