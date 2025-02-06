# Converter-DevOps

A DevOps project automating the deployment of a collection of everyday utility tools using Terraform, Azure, Jenkins, Docker, and Nginx.

## Project Overview
This project sets up an automated DevOps pipeline for deploying a converter application. It includes:

- Terraform for provisioning Azure infrastructure
- Docker for containerizing the application
- Azure Container Registry (ACR) for storing Docker images
- Azure Virtual Machine (VM) for hosting the application
- Jenkins for CI/CD pipeline automation
- Nginx for reverse proxy and load balancing


## Infrastructure Setup with Terraform
Prerequisites
Ensure you have the following installed:

Terraform
Azure CLI
Git
Jenkins
Docker
Steps to Deploy Infrastructure

Clone the Repository </br>
`git clone https://github.com/ikechukwu25/QRC-DevOps.git` </br>
`cd QRC-DevOps`

Login to Azure </br>
`az login`

Initialize Terraform </br>
`terraform init`

Plan the Deployment </br>
`terraform plan -var-file="terraform.tfvars" -out=tfplan`

Apply Terraform Configuration </br>
`terraform apply -var-file="terraform.tfvars" -auto-approve`

Terraform will provision the following:
- Azure Resource Group
- Virtual Network & Subnet 
- Public IP & Network Interface 
- Virtual Machine (VM) 
- Azure Container Registry (ACR)
