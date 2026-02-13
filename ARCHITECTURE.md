# FREQ AI: AGENTIC LATTICE CORE - ARCHITECTURAL BLUEPRINT
**Version:** 4.0 | **Sovereign Intent:** Chief Dre
**Core Objective:** Automate barge drafting (4h -> 15m) via Computer Vision & Agentic Orchestration.

## 1. CRITICAL DIRECTIVES (FOR CLAUDE CODE)
1. **Vision-First:** Use RGB-D / Optical sensors. NO LiDAR.
2. **Digital Shadow:** One-way state mirror (React+CesiumJS). Do not simulate full physics unless necessary.
3. **Non-Terminal:** All user interactions must happen via the Web UI.
4. **Safety:** "Watchdog Agent" must stop crane if humans are detected (Computer Vision).
5. **State-First:** Agents update a JSON state; they do not talk directly to hardware drivers.

## 2. THE PIPELINE (LATENCY < 15 MIN)
1. **Ingestion:** RGB-D Sensor stream -> Point Cloud.
2. **Processing:** Euclidean Clustering (Edge detection).
3. **Agent B (Vector):** Computes Draft/Trim/Heel from point cloud.
4. **Agent C (Translator):** Converts Vector -> G-Code.
5. **Execution:** Crane moves based on G-Code; Watchdog monitors video feed.

## 3. DATA STRUCTURES (AUTHORITATIVE)
**Draft Readings:** { "fore": 10.45, "aft": 10.82, "mean": 10.63, "unit": "ft" }
**Crane Signal:** { "status": "LOADING", "g_code": "G01 X195.7 Y42.3 Z16.2 F500" }
