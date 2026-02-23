using UnrealBuildTool;

public class FREQSimulation : ModuleRules
{
	public FREQSimulation(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[]
		{
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
			"UMG",
			"Slate",
			"SlateCore",
			"Water"
		});

		PrivateDependencyModuleNames.AddRange(new string[]
		{
			"PixelStreaming"
		});
	}
}
