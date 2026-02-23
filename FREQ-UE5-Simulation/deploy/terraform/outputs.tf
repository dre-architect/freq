# =============================================================================
# FREQ AI — Terraform Outputs
# =============================================================================

output "storage_bucket" {
  description = "Cloud Storage bucket for UE5 build artifacts"
  value       = google_storage_bucket.simulation_builds.name
}

output "artifact_registry_url" {
  description = "Artifact Registry URL for container images"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.simulation.repository_id}"
}

output "service_account_email" {
  description = "Service account email for Immersive Stream"
  value       = google_service_account.immersive_stream.email
}

output "deployment_instructions" {
  description = "Next steps after terraform apply"
  value       = <<-EOT

    ═══════════════════════════════════════════════════════════
    FREQ AI — Infrastructure Ready
    ═══════════════════════════════════════════════════════════

    1. Package UE5 for Linux:
       ./deploy/scripts/package-linux.sh

    2. Upload build to Cloud Storage:
       gsutil -m rsync -r ./Saved/StagedBuilds/Linux gs://${google_storage_bucket.simulation_builds.name}/builds/${var.content_version}/

    3. Create Immersive Stream content + instance:
       gcloud immersive-stream xr contents create freq-barge-simulation \
         --project=${var.project_id} \
         --bucket=${google_storage_bucket.simulation_builds.name} \
         --object=builds/${var.content_version}

    4. Share the streaming URL with investors and partners.

    ═══════════════════════════════════════════════════════════
  EOT
}
