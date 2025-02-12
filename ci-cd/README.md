# CI/CD Pipeline for Converter-DevOps

## Overview
This project uses Jenkins to automate the CI/CD pipeline. The pipeline performs the following tasks:
1. **Build** the application inside a Docker container.
2. **Push** the image to Azure Container Registry.
3. **Deploy** the application on an Azure Virtual Machine.

## Pipeline Configuration
- **Jenkinsfile:** Defines the Jenkins pipeline.
- **deploy.sh:** Bash script to deploy the application manually.

## Running the Pipeline
1. Commit changes to the `main` branch.
2. Jenkins automatically builds and deploys.
3. Application is updated on Azure VM.

## Troubleshooting
- If deployment fails, check Jenkins logs.
- Ensure Docker and SSH configurations are correct.
