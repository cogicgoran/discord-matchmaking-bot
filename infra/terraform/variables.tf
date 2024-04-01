variable "host_os" {
  description = "Name of the host operating system"
  type        = string
}

variable "your_trusted_machine_ip" {
  description = "Ip address of the machine allowed to connect to the instance"
  type        = string
}

locals {
  ansible_public_key  = file(var.path_to_ansible_public_key)
  ansible_private_key = file(var.path_to_ansible_private_key)
  root_public_key     = file(var.path_to_root_public_key)
}

variable "path_to_root_private_key" {
  description = "Path to the private key used by root user"
  type        = string
}

variable "path_to_ansible_working_dir" {
  description = "Path to the ansible working directory"
  type        = string
}

variable "path_to_root_public_key" {
  description = "Path to the public key used by root user"
  type        = string
}

variable "path_to_ansible_public_key" {
  description = "Path to the public key used by ansible"
  type        = string
}

variable "path_to_ansible_private_key" {
  description = "Path to the private key used by ansible"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "aws_availability_zone" {
  description = "AWS availability zone"
  type        = string
  default     = "eu-central-1a"
}

variable "aws_profile" {
  description = "AWS profile"
  type        = string
}