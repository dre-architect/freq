# =============================================================================
# FREQ AI — Google Immersive Stream for XR Infrastructure
# Terraform configuration for full GCP deployment
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    # Configure via: terraform init -backend-config="bucket=YOUR_TF_STATE_BUCKET"
    prefix = "terraform/freq-simulation"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# ── Enable Required APIs ────────────────────────────────────────────────────
resource "google_project_service" "apis" {
  for_each = toset([
    "stream.googleapis.com",
    "compute.googleapis.com",
    "artifactregistry.googleapis.com",
    "storage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
  ])

  project = var.project_id
  service = each.value

  disable_dependent_services = false
  disable_on_destroy         = false
}

# ── Cloud Storage — Build Artifacts ─────────────────────────────────────────
resource "google_storage_bucket" "simulation_builds" {
  name          = "${var.project_id}-freq-simulation"
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 5
    }
  }

  labels = {
    project     = "freq-ai"
    component   = "simulation"
    environment = var.environment
  }

  depends_on = [google_project_service.apis]
}

# ── Artifact Registry — Container Images ────────────────────────────────────
resource "google_artifact_registry_repository" "simulation" {
  provider = google-beta

  location      = var.region
  repository_id = "freq-simulation"
  format        = "DOCKER"
  description   = "FREQ AI Simulation container images for Pixel Streaming"

  labels = {
    project     = "freq-ai"
    component   = "simulation"
    environment = var.environment
  }

  depends_on = [google_project_service.apis]
}

# ── Service Account for Immersive Stream ────────────────────────────────────
resource "google_service_account" "immersive_stream" {
  account_id   = "freq-immersive-stream"
  display_name = "FREQ AI Immersive Stream Service Account"
  description  = "Service account for Immersive Stream for XR to access build artifacts"
}

resource "google_storage_bucket_iam_member" "stream_reader" {
  bucket = google_storage_bucket.simulation_builds.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.immersive_stream.email}"
}

resource "google_project_iam_member" "stream_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.immersive_stream.email}"
}

resource "google_project_iam_member" "stream_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.immersive_stream.email}"
}

# ── Monitoring — Alert Policies ─────────────────────────────────────────────
resource "google_monitoring_alert_policy" "high_gpu_utilization" {
  display_name = "FREQ Simulation — High GPU Utilization"
  combiner     = "OR"

  conditions {
    display_name = "GPU utilization > 90%"

    condition_threshold {
      filter          = "resource.type = \"gce_instance\" AND metric.type = \"compute.googleapis.com/instance/gpu/utilization\""
      comparison      = "COMPARISON_GT"
      threshold_value = 0.9
      duration        = "300s"

      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }

  notification_channels = []

  alert_strategy {
    auto_close = "1800s"
  }

  depends_on = [google_project_service.apis]
}

# ── Monitoring Dashboard ────────────────────────────────────────────────────
resource "google_monitoring_dashboard" "simulation" {
  dashboard_json = jsonencode({
    displayName = "FREQ AI Barge Simulation"
    mosaicLayout = {
      tiles = [
        {
          width  = 6
          height = 4
          widget = {
            title = "Active Streaming Sessions"
            xyChart = {
              dataSets = [{
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "resource.type = \"stream.googleapis.com/Instance\""
                  }
                }
              }]
            }
          }
        },
        {
          xPos   = 6
          width  = 6
          height = 4
          widget = {
            title = "GPU Utilization"
            xyChart = {
              dataSets = [{
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "resource.type = \"gce_instance\" AND metric.type = \"compute.googleapis.com/instance/gpu/utilization\""
                  }
                }
              }]
            }
          }
        }
      ]
    }
  })

  depends_on = [google_project_service.apis]
}
