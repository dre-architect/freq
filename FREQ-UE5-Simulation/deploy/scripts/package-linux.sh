#!/usr/bin/env bash
# =============================================================================
# FREQ AI — UE5 Linux Packaging Script
# Packages the UE5 project for Pixel Streaming on Linux (required for GCP)
# =============================================================================
set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${CYAN}[FREQ]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ── Configuration ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/../.."
UPROJECT="${PROJECT_DIR}/FREQSimulation.uproject"
OUTPUT_DIR="${PROJECT_DIR}/Saved/StagedBuilds/Linux"

# UE5 engine path — update this to your installation
UE5_ROOT="${UE5_ROOT:-/opt/UnrealEngine}"
UAT="${UE5_ROOT}/Engine/Build/BatchFiles/RunUAT.sh"

# Pixel Streaming launch args
LAUNCH_ARGS="-AudioMixer -PixelStreamingIP=0.0.0.0 -PixelStreamingPort=8888 -RenderOffScreen -Unattended -GraphicsAdapter=0 -ForceRes -ResX=1920 -ResY=1080 -AllowPixelStreamingCommands"

# ── Validate ─────────────────────────────────────────────────────────────────
[[ -f "$UPROJECT" ]] || err "UProject not found at: $UPROJECT"
[[ -f "$UAT" ]]      || err "UE5 RunUAT not found at: $UAT. Set UE5_ROOT to your UE5 install path."

# ── Package for Linux ────────────────────────────────────────────────────────
log "Packaging FREQ Simulation for Linux (Pixel Streaming)..."

"$UAT" BuildCookRun \
    -project="$UPROJECT" \
    -noP4 \
    -platform=Linux \
    -clientconfig=Shipping \
    -serverconfig=Shipping \
    -cook \
    -build \
    -stage \
    -pak \
    -archive \
    -archivedirectory="$OUTPUT_DIR" \
    -compressed \
    -prereqs \
    -nodebuginfo \
    -utf8output

ok "Build complete: $OUTPUT_DIR"

# ── Write launch script into the build ──────────────────────────────────────
LAUNCH_SCRIPT="${OUTPUT_DIR}/launch-pixel-streaming.sh"
cat > "$LAUNCH_SCRIPT" << 'LAUNCH_EOF'
#!/usr/bin/env bash
# Launch FREQ Simulation with Pixel Streaming enabled
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$SCRIPT_DIR/FREQSimulation/Binaries/Linux/FREQSimulation" \
    -AudioMixer \
    -PixelStreamingIP=0.0.0.0 \
    -PixelStreamingPort=8888 \
    -RenderOffScreen \
    -Unattended \
    -GraphicsAdapter=0 \
    -ForceRes \
    -ResX=1920 \
    -ResY=1080 \
    -AllowPixelStreamingCommands \
    "$@"
LAUNCH_EOF
chmod +x "$LAUNCH_SCRIPT"

# ── Write Pixel Streaming signaling server config ────────────────────────────
SIGNAL_CONFIG="${OUTPUT_DIR}/signaling-server-config.json"
cat > "$SIGNAL_CONFIG" << 'CONFIG_EOF'
{
    "HttpPort": 80,
    "StreamerPort": 8888,
    "SFUPort": 8889,
    "MaxPlayerCount": 100,
    "peerConnectionOptions": "{\"iceServers\":[{\"urls\":[\"stun:stun.l.google.com:19302\"]}]}"
}
CONFIG_EOF

ok "Launch script written: $LAUNCH_SCRIPT"
ok "Signaling config written: $SIGNAL_CONFIG"
log "Ready for deployment. Run deploy-immersive-stream.sh to push to GCP."
