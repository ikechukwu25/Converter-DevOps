terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.17.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "add8b9f3-5990-4ad6-9384-fdc5b7d5ded7"
}
