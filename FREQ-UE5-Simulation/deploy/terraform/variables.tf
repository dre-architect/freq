# =============================================================================
# FREQ AI — Terraform Variables
# =============================================================================

variable "project_id" {
  description = "GCP Project ID"
  type        = string

  validation {
    condition     = length(var.project_id) > 0
    error_message = "project_id must not be empty."
  }
}

variable "region" {
  description = "GCP region for deployment"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "environment must be one of: development, staging, production."
  }
}

variable "min_instances" {
  description = "Minimum number of GPU streaming instances"
  type        = number
  default     = 1
}

variable "max_instances" {
  description = "Maximum number of GPU streaming instances"
  type        = number
  default     = 5
}

variable "gpu_type" {
  description = "GPU type for streaming instances"
  type        = string
  default     = "nvidia-tesla-t4"
}

variable "content_version" {
  description = "Version identifier for the UE5 build"
  type        = string
  default     = "v1"
}
