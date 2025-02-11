# Architecture Overview

## Introduction
This document outlines the architecture of the Converter DevOps Project and details how the application is deployed, managed, and automated using Terraform, Jenkins, Docker, Azure, and Nginx.

## High-Level Architecture
The project follows an Infrastructure as Code (IaC) & CI/CD approach, ensuring automated provisioning, deployment, and management. Below is the workflow:

### Infrastructure Setup (Terraform)
1. Terraform provisions: </br>
Azure Virtual Machine (VM) </br>
Azure Container Registry (ACR) </br>
Networking components (VNet, NSG, Public IP) </br>
Storage (if needed)

### CI/CD Deployment Flow (Jenkins)
1. Developer pushes code to GitHub
2. Jenkins triggers the pipeline </br>
Builds a Docker image </br>
Pushes the image to Azure Container Registry (ACR) </br>
SSHs into an Azure Virtual Machine (VM) </br>
Pulls the latest Docker image from ACR </br>
Restarts the application container
4. Application runs on the VM, exposed via Nginx reverse proxy

### Components & Technologies

```mermaid
graph TD;
    A[GitHub Repo] -->|Push Code| B[Terraform (IaC)];
    B -->|Provision Resources| C[Azure Virtual Machine];
    C -->|Runs App| D[Docker & Nginx];
    A -->|Triggers Pipeline| E[Jenkins CI/CD];
    E -->|Builds & Deploys| F[Azure Container Registry];
    F -->|Stores Docker Images| C;
    C -->|Serves App| G[End Users];
