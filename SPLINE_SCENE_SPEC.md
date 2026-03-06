# SPLINE_SCENE_SPEC.md — Track A: Spline 3D Scene Specification
## FREQ AI Digital Twin — Autonomous Barge Drafting

**Document Version:** 1.0
**For:** Chief Dre — Spline Editor Build
**Companion:** `digital-twin.html` + `spline-controller.js` (Track B, already deployed)

---

## Overview

Build a real-time 3D digital twin of an inland waterway aggregate terminal at night. The scene shows an autonomous drone-crane system loading a barge in a river. The camera is cinematic: slightly elevated, looking down at the vessel from the dock side. Everything is industrial, dark, and precise — steel, water, light.

When the scene is exported and the URL is pasted into `spline-controller.js` at line 1 (`SPLINE_SCENE_URL = 'YOUR_URL_HERE'`), it replaces the SVG placeholder automatically.

---

## Scene Dimensions & Environment

| Property | Value |
|---|---|
| Canvas aspect | 16:9 |
| Ambient light | Very dark — `#080C18` sky, near-black |
| Fog | Subtle, blue-gray, 30–60 unit depth |
| Water | River surface, flat plane, animated gentle ripple |
| Time of day | Night — 23:14 (visible on HUD, not scene) |

**Lighting:**
- 2 dock spotlights: warm amber `#F59E0B`, point light, positioned on dock structure, cast on barge deck
- 1 crane work light: cold white `#E0F2FE`, positioned at crane tip, points downward into hold
- Subtle fill: very dim blue ambient `#1E3A5F`, wraps entire scene

---

## Object Catalog

Name every object exactly as listed. `spline-controller.js` will call `splineApp.setVariable()` on these names to animate the scene.

### 1. WATER_SURFACE
- Flat plane, full scene width
- Material: semi-transparent dark teal `#0F3D4A`, 60% opacity
- Animated: gentle vertex displacement — low amplitude (0.05 units), slow frequency (0.3 Hz)
- Reflection: captures dock lights as soft blobs on surface

### 2. DOCK_STRUCTURE
- Static — does not animate
- Industrial concrete dock/wharf: matte `#1C2535` with subtle surface variation
- Width: spans full left/back of scene
- 2 vertical dock light poles with cone spotlights (see lighting above)
- Dock edge detail: rusted steel lip at water line

### 3. CRANE_TOWER
- Static base — does not animate
- Industrial lattice crane tower, steel gray `#2C3E50`
- Cross-bracing: thinner lines, `#374151`
- Height: taller than barge by 3×

### 4. CRANE_BOOM
- Rotates on Y axis — state-controlled (see States section)
- Default position: pointing straight ahead (over barge hold)
- Material: steel gray, same family as tower

### 5. CRANE_TIP
- Child of `CRANE_BOOM`, moves with boom
- Point where the material stream originates
- No visual glyph — just an anchor point object
- Has a small work light (cold white, 0.6 intensity)

### 6. BARGE_HULL
- Static — does not animate
- Industrial steel barge hull, flat bottom river barge profile
- Material: dark steel `#1A2332`, slight specular
- Position: center of scene, parallel to dock
- Length: ~70% of scene width

### 7. BARGE_DECK
- Static top surface
- Matte dark steel `#202C3E`
- Contains: hold opening in center

### 8. CARGO_HOLD
- Static — the open rectangular hold on barge deck
- Material: very dark interior `#0D1520`
- Position: centered on deck

### 9. CARGO_FILL
- **Key animated object** — state-controlled
- Starts: empty (scale Y = 0, origin at bottom of hold)
- Ends: full (scale Y = 1.0, hold is full of aggregate material)
- Material: aggregate/gravel texture — warm gray `#8B7355`, rough surface, no specularity
- Scale animates via `CARGO_FILL_LEVEL` variable (0.0 → 1.0)

### 10. WATERLINE_INDICATOR
- Horizontal ring/plane at water surface level on barge hull
- Thin, bright teal `#0D9488`, emissive, 1.0 intensity
- Animates Y position downward as cargo loads (barge sinks)
- Controlled via `DRAFT_LEVEL` variable (0.0 = empty, 1.0 = fully loaded)
- Draft travel distance: 0.8 units in Y (barge sinks 0.8 units from empty to full)

### 11. STATION_MARKERS (×6)
- `STATION_FP`, `STATION_FS`, `STATION_MP`, `STATION_MS`, `STATION_AP`, `STATION_AS`
- Small glowing crosshair markers on barge hull at waterline
- Default: invisible (`opacity = 0`)
- Active state: visible, pulsing teal `#0D9488`, `opacity = 1`
- Activated during PRE-SURVEY and POST-SURVEY phases
- Each marker: simple cross shape, 0.2 units wide, emissive

### 12. SCAN_BEAM
- The autonomous sensor sweep beam
- Thin flat plane / volumetric beam, starts at `CRANE_TIP`, sweeps fore-to-aft across the barge
- Material: bright teal `#2DD4BF`, emissive, 0.7 opacity
- Default: invisible (`opacity = 0`)
- Animates: position sweeps along barge length (controlled via `SCAN_POSITION` variable 0.0→1.0)
- Active during INITIAL-SURVEY, PRE-LOAD-ASSESSMENT, POST-LOAD-ASSESSMENT phases

### 13. MATERIAL_STREAM
- Falling particle stream from `CRANE_TIP` into `CARGO_HOLD`
- Particles: small irregular chunks, aggregate/gravel color `#A0916A`
- Particle gravity: falls straight down, velocity ~2 units/s
- Default: hidden (`opacity = 0`)
- Active only during CARGO-LOAD phase
- Particle emission rate: controlled via `MATERIAL_FLOW` variable (0.0 → 1.0)

### 14. CAMERA_MAIN
- **Cinematic overview** — primary camera, used for most phases
- Position: elevated to crane level, looking down and across the barge from dock side
- Angle: ~30° below horizontal, slight 3/4 perspective
- FOV: 60°

### 15. CAMERA_HOLD
- **Hold inspection view** — looking straight down into cargo hold
- Position: directly above hold at crane height
- Angle: straight down (-90° pitch)
- FOV: 45°

### 16. CAMERA_WATERLINE
- **Draft measurement view** — hull-level side view
- Position: water surface level, perpendicular to barge hull amidships
- Angle: horizontal, looking directly at hull waterline markers
- FOV: 55°

### 17. CAMERA_CRANE
- **Crane perspective** — looking from crane tip downward
- Position: at `CRANE_TIP` location
- Angle: ~60° below horizontal
- FOV: 75° (wide)

---

## Spline Variables (set from JS)

These are the variables `spline-controller.js` will write via `splineApp.setVariable()`. Name them exactly.

| Variable Name | Type | Range | Purpose |
|---|---|---|---|
| `CARGO_FILL_LEVEL` | Number | 0.0 – 1.0 | Scale Y of `CARGO_FILL` |
| `DRAFT_LEVEL` | Number | 0.0 – 1.0 | Y position of `WATERLINE_INDICATOR` |
| `SCAN_POSITION` | Number | 0.0 – 1.0 | X position of `SCAN_BEAM` across barge |
| `SCAN_ACTIVE` | Boolean | true/false | Visibility of `SCAN_BEAM` |
| `MATERIAL_FLOW` | Number | 0.0 – 1.0 | Emission rate of `MATERIAL_STREAM` |
| `STATION_ACTIVE` | Boolean | true/false | Visibility of all 6 station markers |
| `CRANE_STATE` | String | `"parked"/"ready"/"active"` | CRANE_BOOM rotation state |
| `ACTIVE_CAMERA` | String | `"main"/"hold"/"waterline"/"crane"` | Active camera selection |

---

## Scene States by Phase

The JS controller will set these variables in sequence. For each phase, the table shows what changes.

| Phase | `SCAN_ACTIVE` | `SCAN_POSITION` | `MATERIAL_FLOW` | `STATION_ACTIVE` | `CRANE_STATE` | `ACTIVE_CAMERA` |
|---|---|---|---|---|---|---|
| PRE-SURVEY | true | 0→1 sweep | 0 | false | `"parked"` | `"main"` |
| BALLAST-ADJ | false | — | 0 | true | `"parked"` | `"waterline"` |
| CRANE-POS | false | — | 0 | false | `"ready"` | `"crane"` |
| CARGO-LOAD | false | — | 0→1 | false | `"active"` | `"hold"` |
| TRIM-CORR | true | 0→1 sweep | 0 | true | `"ready"` | `"waterline"` |
| FINAL-SURV | true | 0→1 sweep | 0 | true | `"parked"` | `"main"` |

`DRAFT_LEVEL` and `CARGO_FILL_LEVEL` both animate continuously from 0 (phase 0 start) to 1 (phase 5 end) across all phases.

---

## Crane State Animations

| State | CRANE_BOOM rotation | Description |
|---|---|---|
| `"parked"` | Default rest position | Boom angled back away from barge |
| `"ready"` | Rotated over hold | Boom positioned directly over cargo hold |
| `"active"` | Same as ready, slight oscillation | ±2° sway, 0.5 Hz — simulates load on cable |

Transitions: ease-in-out, 2 second duration.

---

## Materials Reference

| Object | Base Color | Emissive | Roughness | Metallic |
|---|---|---|---|---|
| DOCK_STRUCTURE | `#1C2535` | none | 0.9 | 0.1 |
| CRANE_TOWER | `#2C3E50` | none | 0.7 | 0.6 |
| CRANE_BOOM | `#344054` | none | 0.7 | 0.6 |
| BARGE_HULL | `#1A2332` | none | 0.8 | 0.4 |
| BARGE_DECK | `#202C3E` | none | 0.85 | 0.3 |
| CARGO_FILL | `#8B7355` | none | 1.0 | 0.0 |
| WATERLINE_INDICATOR | `#0D9488` | `#0D9488` at 1.0 | 0.0 | 0.0 |
| SCAN_BEAM | `#2DD4BF` | `#2DD4BF` at 0.8 | 0.0 | 0.0 |
| STATION_MARKERS | `#0D9488` | `#0D9488` at 1.0 | 0.0 | 0.0 |
| WATER_SURFACE | `#0F3D4A` | none | 0.2 | 0.3 |
| MATERIAL_STREAM (particles) | `#A0916A` | none | 1.0 | 0.0 |

---

## Post-Export Checklist

1. Export scene from Spline — copy the "Viewer URL" (not embed code)
2. Open `spline-controller.js`
3. Line 1: replace `const SPLINE_SCENE_URL = '';` with `const SPLINE_SCENE_URL = 'YOUR_VIEWER_URL';`
4. Commit and push
5. The SVG placeholder will automatically hide, Spline canvas will show

---

## Notes for Spline Build

- Keep polygon count low for real-time web performance — target <50K triangles total
- Use Spline's built-in animation system for CRANE_BOOM state transitions only; all other animation is driven by JS variables
- Water ripple animation should loop seamlessly — use Spline timeline loop
- Dock light glow halos look best as Spline "Bloom" post-process effect
- Test the scene URL in an incognito browser before pasting into the code — confirm it loads without login

---

*Track B (website code) is complete and deployed. This spec document is the only remaining deliverable for Track A.*
