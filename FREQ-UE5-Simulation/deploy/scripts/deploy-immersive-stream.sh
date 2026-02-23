#!/usr/bin/env bash
# =============================================================================
# FREQ AI — Google Immersive Stream for XR Deployment
# One-command deployment from authenticated gcloud environment
# =============================================================================
set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
PROJECT_ID="${GCP_PROJECT_ID:-}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="freq-barge-simulation"
DISPLAY_NAME="FREQ AI Barge Drafting Simulation"
BUCKET_NAME="${PROJECT_ID}-freq-simulation"
CONTENT_VERSION="v1"
ARTIFACT_REGISTRY="freq-simulation"
IMAGE_NAME="freq-pixel-streaming"
IMAGE_TAG="latest"

# Immersive Stream for XR settings
GPU_TYPE="nvidia-tesla-t4"
MIN_INSTANCES=1
MAX_INSTANCES=5
STREAM_RESOLUTION="1920x1080"
TARGET_FPS=60

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[FREQ]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ── Pre-flight Checks ───────────────────────────────────────────────────────
preflight() {
    log "Running pre-flight checks..."

    command -v gcloud >/dev/null 2>&1 || err "gcloud CLI not found. Install: https://cloud.google.com/sdk/docs/install"
    command -v docker >/dev/null 2>&1 || err "Docker not found. Install Docker Desktop or Docker Engine."

    # Check gcloud auth
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
    [[ -z "$ACCOUNT" ]] && err "No active gcloud account. Run: gcloud auth login"
    ok "Authenticated as: $ACCOUNT"

    # Resolve project
    if [[ -z "$PROJECT_ID" ]]; then
        PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
        [[ -z "$PROJECT_ID" ]] && err "No GCP project set. Run: export GCP_PROJECT_ID=your-project-id"
    fi
    ok "Project: $PROJECT_ID"
    ok "Region: $REGION"
}

# ── Enable Required APIs ────────────────────────────────────────────────────
enable_apis() {
    log "Enabling required GCP APIs..."

    APIS=(
        "stream.googleapis.com"                    # Immersive Stream for XR
        "compute.googleapis.com"                   # Compute Engine (GPU instances)
        "artifactregistry.googleapis.com"          # Artifact Registry (container images)
        "storage.googleapis.com"                   # Cloud Storage (build artifacts)
        "cloudresourcemanager.googleapis.com"      # Resource Manager
        "iam.googleapis.com"                       # IAM
        "logging.googleapis.com"                   # Cloud Logging
        "monitoring.googleapis.com"                # Cloud Monitoring
    )

    for api in "${APIS[@]}"; do
        gcloud services enable "$api" --project="$PROJECT_ID" --quiet 2>/dev/null && \
            ok "Enabled: $api" || warn "Already enabled or failed: $api"
    done
}

# ── Create Storage Bucket ───────────────────────────────────────────────────
setup_storage() {
    log "Setting up Cloud Storage bucket..."

    if gsutil ls -b "gs://$BUCKET_NAME" 2>/dev/null; then
        ok "Bucket already exists: $BUCKET_NAME"
    else
        gsutil mb -p "$PROJECT_ID" -l "$REGION" -c STANDARD "gs://$BUCKET_NAME"
        ok "Created bucket: $BUCKET_NAME"
    fi
}

# ── Create Artifact Registry ────────────────────────────────────────────────
setup_artifact_registry() {
    log "Setting up Artifact Registry..."

    gcloud artifacts repositories describe "$ARTIFACT_REGISTRY" \
        --project="$PROJECT_ID" \
        --location="$REGION" 2>/dev/null && \
        ok "Registry already exists: $ARTIFACT_REGISTRY" && return

    gcloud artifacts repositories create "$ARTIFACT_REGISTRY" \
        --project="$PROJECT_ID" \
        --location="$REGION" \
        --repository-format=docker \
        --description="FREQ AI Simulation container images"

    ok "Created Artifact Registry: $ARTIFACT_REGISTRY"
}

# ── Build & Push Container Image ────────────────────────────────────────────
build_and_push() {
    log "Building and pushing Pixel Streaming container..."

    REGISTRY_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

    # Configure Docker for Artifact Registry
    gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

    # Build the container
    docker build \
        -t "$REGISTRY_URL" \
        -f "$(dirname "$0")/../docker/Dockerfile.streaming" \
        "$(dirname "$0")/.."

    # Push to Artifact Registry
    docker push "$REGISTRY_URL"

    ok "Pushed image: $REGISTRY_URL"
}

# ── Upload UE5 Build to Cloud Storage ───────────────────────────────────────
upload_build() {
    log "Uploading UE5 packaged build to Cloud Storage..."

    BUILD_DIR="${UE5_BUILD_DIR:-$(dirname "$0")/../Saved/StagedBuilds/Linux}"

    if [[ ! -d "$BUILD_DIR" ]]; then
        warn "Build directory not found: $BUILD_DIR"
        warn "Package your UE5 project for Linux first, then set UE5_BUILD_DIR"
        warn "Skipping upload — you can run this step later"
        return
    fi

    gsutil -m rsync -r "$BUILD_DIR" "gs://${BUCKET_NAME}/builds/${CONTENT_VERSION}/"
    ok "Uploaded build to gs://${BUCKET_NAME}/builds/${CONTENT_VERSION}/"
}

# ── Create Immersive Stream for XR Content Resource ─────────────────────────
create_stream_content() {
    log "Creating Immersive Stream for XR content resource..."

    # Check if content already exists
    EXISTING=$(gcloud immersive-stream xr contents list \
        --project="$PROJECT_ID" \
        --format="value(name)" 2>/dev/null | grep "$SERVICE_NAME" || true)

    if [[ -n "$EXISTING" ]]; then
        ok "Content resource already exists: $SERVICE_NAME"
        return
    fi

    gcloud immersive-stream xr contents create "$SERVICE_NAME" \
        --project="$PROJECT_ID" \
        --bucket="$BUCKET_NAME" \
        --object="builds/${CONTENT_VERSION}" \
        --display-name="$DISPLAY_NAME"

    ok "Created content resource: $SERVICE_NAME"
}

# ── Create Immersive Stream Service Instance ────────────────────────────────
create_stream_instance() {
    log "Creating Immersive Stream for XR service instance..."

    EXISTING=$(gcloud immersive-stream xr instances list \
        --project="$PROJECT_ID" \
        --format="value(name)" 2>/dev/null | grep "$SERVICE_NAME" || true)

    if [[ -n "$EXISTING" ]]; then
        ok "Instance already exists: $SERVICE_NAME"
    else
        gcloud immersive-stream xr instances create "${SERVICE_NAME}-instance" \
            --project="$PROJECT_ID" \
            --content="$SERVICE_NAME" \
            --location="$REGION" \
            --version="$CONTENT_VERSION" \
            --add-gpu-serving-config="gpu_type=${GPU_TYPE},min_node_count=${MIN_INSTANCES},max_node_count=${MAX_INSTANCES}"

        ok "Created instance: ${SERVICE_NAME}-instance"
    fi

    log "Waiting for instance to be ready (this may take several minutes)..."
    gcloud immersive-stream xr instances describe "${SERVICE_NAME}-instance" \
        --project="$PROJECT_ID" \
        --format="yaml(status,streamingUrl)" 2>/dev/null || true
}

# ── Print Summary ───────────────────────────────────────────────────────────
print_summary() {
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  FREQ AI — Deployment Complete${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Project:    ${CYAN}$PROJECT_ID${NC}"
    echo -e "  Region:     ${CYAN}$REGION${NC}"
    echo -e "  Bucket:     ${CYAN}gs://$BUCKET_NAME${NC}"
    echo -e "  Service:    ${CYAN}$SERVICE_NAME${NC}"
    echo ""
    echo -e "  ${YELLOW}Stream URL will be available once the instance is fully provisioned.${NC}"
    echo -e "  Check status: gcloud immersive-stream xr instances describe ${SERVICE_NAME}-instance --project=$PROJECT_ID"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
}

# ── Main ─────────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  FREQ AI — Immersive Stream for XR Deployment        ║${NC}"
    echo -e "${CYAN}║  Photorealistic Barge Simulation → Browser URL       ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""

    preflight
    enable_apis
    setup_storage
    setup_artifact_registry
    build_and_push
    upload_build
    create_stream_content
    create_stream_instance
    print_summary
}

main "$@"
