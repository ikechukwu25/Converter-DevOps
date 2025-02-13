# Converter-DevOps

This project is a DevOps implementation for deploying a converter application using Terraform, Docker, Jenkins, and Azure. The infrastructure is automated with Terraform, and CI/CD is managed via Jenkins.

## Project Overview
This project sets up an automated DevOps pipeline for deploying a converter application. It includes:

- Terraform for provisioning Azure infrastructure
- Docker for containerizing the application
- Azure Container Registry (ACR) for storing Docker images
- Azure Virtual Machine (VM) for hosting the application
- Jenkins for CI/CD pipeline automation
- Nginx for reverse proxy and load balancing


## Infrastructure Setup with Terraform
Prerequisites </br>
Ensure you have the following installed:

- Terraform 
- Azure CLI 
- Git 
- Jenkins 
- Docker 

## Steps to Deploy Infrastructure

1. Clone the Repository </br>
`git clone https://github.com/ikechukwu25/QRC-DevOps.git` </br>
`cd QRC-DevOps`

2. Configure Terraform
Update terraform.tfvars with your Azure details:
`subscription_id = "your-subscription-id"`
`admin_username  = "admin_username"`
`admin_password  = "admin_password"`

3. Login to Azure </br>
`az login`

4. `az account set --subscription "add8b9f3-5990-4ad6-9384-fdc5b7d5ded7"` </br>
   `az account show --output table`

5. Initialize and Apply Terraform </br>
`terraform init`

6. Plan the Deployment </br>
`terraform plan -var-file="terraform.tfvars" -out=tfplan`

7. Apply Terraform Configuration </br>
`terraform apply -var-file="terraform.tfvars" -auto-approve`

Terraform will provision the following:
- Azure Resource Group
- Virtual Network & Subnet 
- Public IP & Network Interface 
- Virtual Machine (VM) 
- Azure Container Registry (ACR)
  

## Configure Jenkins CI/CD Pipeline
- Set up a Jenkins pipeline using Jenkinsfile.
- Ensure Jenkins has access to the repository and Azure.
- Run the pipeline to build, test, and deploy the application.

### CI/CD Workflow

1. Push Code to GitHub → Triggers Jenkins build. </br>

2. Clone the repository → Jenkins clones the latest code. 

3. Jenkins Builds & Tests → Builds Docker image and runs tests. </br>

4. Pushes to ACR → Jenkins pushes the image to Azure Container Registry. </br>

5. Deploys to VM → Pulls the latest image and restarts the service.


## Troubleshooting in Terraform

1. Terraform authentication error when using Azure? </br> 
- Run `az login` and
- Set the correct subscription: `az account list --output table && az account set --subscription "<SUBSCRIPTION_ID>"`

2. If you've already attempted to create the VM, you might need to destroy and reapply your Terraform changes: 
- `terraform destroy -auto-approve`
- `terraform apply -auto-approve`

3. You're trying to push a file that exceeds GitHub's file size limit of 100MB. The issue is that Terraform's provider binaries (inside .terraform/providers/) are getting pushed to the repository. These files should not be included in your Git repository. </br> </br> **How to Fix It**
- Remove `.terraform/` from Git Tracking </br>
  Run the following commands to remove `.terraform/` from your repository:
- Remove the `.terraform/` directory from Git tracking </br>
  `git rm -r --cached .terraform/`
- Add `.terraform/` to `.gitignore` </br>
  To prevent this issue in the future, add `.terraform/` to your `.gitignore` file:
  `echo ".terraform/" >> .gitignore`
- Check the Large File Before Deleting Run: </br>
  `git rev-list --objects --all | grep terraform-provider-azurerm`


4. Your `terraform.tfvars` file likely got committed before being ignored. Just adding it to `.gitignore` won't remove it from Git history. Follow these steps to remove it properly:
- Remove `terraform.tfvars` from Git History. </br>
Run this command to remove it from Git tracking: </br>
`git rm --cached terraform.tfvars`</br>
This removes the file from Git but keeps it locally.
- Add `terraform.tfvars` to `.gitignore` </br>
If not already there, add it: </br>
`echo "terraform.tfvars" >> .gitignore`
- Commit the Changes: </br>
`git add .gitignore`</br>
`git commit -m "Ignore terraform.tfvars and remove from tracking"`
- Force Push to GitHub (If Already Pushed)</br>
If the file was already pushed, you need to remove it from Git history:</br>
`git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch terraform.tfvars' --prune-empty --tag-name-filter cat -- --all`</br>
`git push origin --force`

OR (Recommended alternative):

`git filter-repo --path terraform.tfvars --invert-paths` </br>
`git push origin --force`

- Force Garbage Collection: </br>
  `rm -rf .git/refs/original/ && git reflog expire --expire=now --all && git gc --prune=now` </br>
   This cleans up unnecessary files and optimizes the repository.











Jenkins

- Docker Push Fails? Ensure you're logged in: `az acr login --name youracr`.

- Jenkins Pipeline Fails? Check logs and ensure Azure credentials are configured correctly.
  




### Contributing

Feel free to open issues or submit pull requests if you find areas for improvement.

