variable "admin_password" {
  description = "The admin password for the virtual machine"
  type        = string
  sensitive   = true
}

variable "location" {
  description = "The Azure region where resources will be deployed"
  type        = string
  default     = "East US"
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "myDevOpsRG"
}

variable "admin_username" {
  description = "The admin username for the virtual machine"
  type        = string
  default     = "azureuser"
}

variable "acr_name" {
  description = "The name of the Azure Container Registry"
  type        = string
  default     = "converter_acr"
}

variable "my_vm" {
  description = "The name of the virtual machine"
  type        = string
  default     = "converter_vm"
}

variable "VMhostname" {
  description = "The hostname of the virtual machine"
  type        = string
  default     = "convertervm"
}

variable "subscription_id" {
  description = "The Azure Subscription ID"
  type        = string
}