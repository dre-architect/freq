# FREQ AI — UE5 Barge Drafting Simulation

Photorealistic maritime cargo drafting simulation in Unreal Engine 5, deployed via Google Immersive Stream for XR.

## Pipeline

```
UE5 Scene → Pixel Streaming Package → Google Immersive Stream for XR → Browser URL
```

## Prerequisites

- Unreal Engine 5.4+
- Visual Studio 2022 or Rider (C++ development)
- GPU: NVIDIA RTX 3080+ recommended

## Setup

1. Clone this repo
2. Right-click `FREQSimulation.uproject` → Generate Visual Studio project files
3. Open in UE5 Editor or build from IDE
4. Pixel Streaming plugin is pre-enabled in the .uproject

## Project Structure

```
Source/FREQSimulation/
  Public/                    Headers
    SimulationPhase.h        Phase enum + Draft/Stability structs
    SimulationController.h   6-phase orchestrator
    BargeActor.h             195ft jumbo hopper barge
    CraneActor.h             Shore crane with boom/bucket
    MOBEventActor.h          Man-overboard safety system
    DraftHUDWidget.h         UMG HUD overlay
    FREQSimGameMode.h        Game mode entry point
  Private/                   Implementations
Config/
  DefaultEngine.ini          Pixel Streaming + Lumen + rendering config
  DefaultGame.ini            Project metadata
  DefaultInput.ini           Simulation controls (Space, M, H, R, C)
Content/
  Maps/        → BargeSimulation.umap (created in editor)
  Blueprints/  → BP_SimulationController, BP_Barge, BP_Crane, BP_MOBEvent
  Materials/   → Quixel Megascans PBR materials
  Meshes/      → SM_Barge, SM_Crane, SM_Dock
  UI/          → WBP_HUD (UMG widget blueprint)
  Sequences/   → Level Sequences for each of the 6 phases
```

## 6-Phase Simulation Sequence

| Phase | Name | Duration | Action |
|-------|------|----------|--------|
| 1 | INITIAL-SURV | 20s | Drone flyover, initial draft readings |
| 2 | PRE-LOAD | 15s | Crane positions, baseline measurements |
| 3 | ACTIVE-LOAD | 45s | Cargo fill 0→50%, waterline rises |
| 4 | CARGO-LOAD | 45s | Cargo fill 50→100%, crane sweeps |
| 5 | POST-LOAD | 15s | Crane retracts, final measurements |
| 6 | FINAL-SURV | 20s | Final drone pass, completion summary |

## Controls

| Key | Action |
|-----|--------|
| Space | Advance phase |
| M | Toggle MOB event |
| H | Toggle HUD |
| R | Reset simulation |
| C | Cycle camera |

## Pixel Streaming Deployment

The project is configured for Pixel Streaming out of the box:
- WebRTC at 60 FPS, H.264 encoding
- Bitrate range: 10-100 Mbps (auto-adjusted)
- Signalling server on port 80, streamer on port 8888

For Google Immersive Stream for XR deployment, package the project for Linux and upload to your GCP Immersive Stream instance.

## Rendering

- Lumen Global Illumination + Reflections
- Virtual Shadow Maps
- Ray Tracing enabled
- Volumetric Clouds + Sky Atmosphere
- UE5 Water plugin for waterway
