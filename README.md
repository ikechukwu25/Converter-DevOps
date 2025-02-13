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
      `git rm --cached terraform.tfvars`</br>
      This removes the file from Git but keeps it locally.

   - Add `terraform.tfvars` to `.gitignore` </br>
      If not already there, add it: </br>
      `echo "terraform.tfvars" >> .gitignore`

   - Commit the Changes: </br>
      `git add .gitignore`</br>
      `git commit -m "Ignore terraform.tfvars and remove from tracking"`

   - Force Push to GitHub (If Already Pushed) </br>
      If the file was already pushed, you need to remove it from Git history:</br>
      `git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch terraform.tfvars' --prune-empty --tag-name-filter cat -- --all`</br>
      `git push origin --force`
   
      OR (Recommended alternative):

      `git filter-repo --path terraform.tfvars --invert-paths` </br>
      `git push origin --force`

   - Force Garbage Collection: </br>
      `rm -rf .git/refs/original/ && git reflog expire --expire=now --all && git gc --prune=now` </br>
      This cleans up unnecessary files and optimizes the repository.


## Troubleshooting in Jenkins

1. Ensure you have installed Azure CLI and login to ACR before pushing an image
   - Install Azure CLI on the VM </br>
     `curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`
   - Verify Installation </br>
      After installation, check if az is available: </br>
      `az --version` </br>
   - If it works, login: </br>
      `az login` </br>
   - If the VM has no browser, use: </br>
      `az login --use-device-code` </br>
      This will give you a code to enter at https://aka.ms/devicelogin.
   - Once logged into Azure, you should proceed with ACR Login </br>
      `az acr login --name youracr` </br>
   - Then, try pushing your Docker image again: </br>
      `docker push youracr.azurecr.io/converterapp:v.01`

2. Docker Push Fails? Ensure you're logged in to the Azure and Azure Container Registry:</br>
   Here's how to fix the ACR authentication issue
   - Verify ACR Login Server </br>
      Check that your ACR name is correct: </br>
      `az acr show --name converteracr --query "loginServer" --output table` </br>
      It should return: </br>
      `converteracr.azurecr.io` </br>
      If it's incorrect, update your docker login command.
   - Use `az acr login` Instead </br>
      Instead of manually logging in, try this from your local machine: </br>
      `az acr login --name converteracr` </br>
      Then retry: </br>
      `docker login converteracr.azurecr.io`
   - Use Admin Credentials (If Necessary) </br>
      By default, ACR admin access is disabled. Enable it temporarily: </br>
      `az acr update --name converteracr --admin-enabled true` </br>
      Now, get your ACR username and password: </br>
      `az acr credential show --name converteracr --query "username" --output tsv` </br>
      `az acr credential show --name converteracr --query "passwords[0].value" --output tsv`
   - Then, use these credentials to log in: </br>
      `docker login converteracr.azurecr.io -u <username> -p <password>` </br>

**N/B**: Both commands accomplish the same purpose—authenticating with Azure Container Registry (ACR)—but they do so in different ways:

** What They Do**
- Both commands allow you to push and pull container images from ACR.
- Both store authentication credentials for Docker to use.

**How They Differ?**

| Command                         | Authentication Method     | Security                          | Use Case     |
|---------------------------------|--------------------------|----------------------------------|----------------|
| `az acr login --name youracr`   | Azure CLI (OAuth token)  | ✅ More Secure (Token-based)   | Recommended for interactive login |
| `docker login -u -p`            | Username & Password      | ❌ Less Secure (Static credentials) | Used in scripts, CI/CD pipelines  |


**Why Run Both Login Commands?** 

`az acr login --name converteracr` alone is usually enough. It authenticates you using Azure CLI and automatically logs Docker in behind the scenes. </br>
Running `docker login` manually is not required in most cases.

**When is `docker login` needed separately?** 

If `az acr login` fails for some reason, running `docker login` directly can be a backup method. </br>
If you're in a CI/CD pipeline, you might not have az installed and need to use `docker login` with service principal credentials.


3. Jenkins Pipeline Fails? Check logs and ensure Azure credentials are configured correctly.

4. Steps to Generate and Add SSH Key for Jenkins
   - Generate a New SSH Key (On Jenkins Server) </br>
      Run the following commands on the Jenkins server to create an SSH key: </br>
      `sudo -u jenkins ssh-keygen -t rsa -b 4096 -C "jenkins@convertervm"` </br>
      When prompted for a file location, use: `/var/lib/jenkins/.ssh/id_rsa` </br>
      Leave the passphrase empty (just press Enter).
   - Copy the Public Key to the Azure VM </br>
      Now, copy the SSH public key to your Azure VM: </br>
      `sudo -u jenkins ssh-copy-id -i /var/lib/jenkins/.ssh/id_rsa.pub ikechukwuVM@<Azure-VM-IP>`
   - Manually Test SSH Connection </br>
      Try SSH from Jenkins to your Azure VM without a password: </br>
      `sudo -u jenkins ssh -i /var/lib/jenkins/.ssh/id_rsa ikechukwuVM@<Azure-VM-IP>` </br>
      * If it logs in without asking for a password, SSH is working. 
      * If it asks for a password, check if `~/.ssh/authorized_keys` on the Azure VM contains the correct key.
        
   - Add Jenkins Credentials
      - Go to Jenkins Dashboard
      - Manage Jenkins
      - Manage Credentials
      - Under Stores scoped to Jenkins, click (global) → Add Credentials
      - Choose Kind: SSH Username with private key
      - Enter username (e.g., Jenkins)
      - Private Key Options:
         - Select Enter directly and paste the contents of id_rsa
         - Or choose From a file on Jenkins master if stored securely
      - Click OK to save

   - Update Jenkins Credentials
     - Go to Jenkins 
     - Manage Jenkins 
     - Manage Credentials 2️⃣
     - Locate the credential "VM_NAME" 3️⃣
     - Replace the private key with: `sudo cat /var/lib/jenkins/.ssh/id_rsa`
     - Save it and restart Jenkins: `sudo systemctl restart jenkins`
     - Now retry your "Deploy to Azure VM" pipeline stage. It should authenticate successfully using SSH.

5. If you get "Error in libcrypto"
   - Check If the Key Exists in Jenkins Workspace. Run this command on your Jenkins server. </br>
      `sudo ls -l /var/lib/jenkins/.ssh/ </br>`
      If `id_rsa` is missing, you need to generate and add it. </br>

   - Manually Add the SSH Key
      Try adding the SSH key manually: </br>
      `sudo -u jenkins ssh-agent bash -c 'ssh-add /var/lib/jenkins/.ssh/id_rsa'` </br>
      If you get "Error in libcrypto", your private key might be in the wrong format. Proceed to Step 3.

   - Convert the SSH Key to the Correct Format
      If your SSH key was copied incorrectly or is in an unsupported format, convert it: </br>
      `sudo -u jenkins ssh-keygen -p -f /var/lib/jenkins/.ssh/id_rsa -m PEM` </br>
      This forces OpenSSH to reformat the private key.

   - Set Correct Permissions
      Jenkins needs the correct file permissions: </br>
      `sudo chmod 600 /var/lib/jenkins/.ssh/id_rsa` </br>
      `sudo chown jenkins:jenkins /var/lib/jenkins/.ssh/id_rsa` </br>
      Then, restart Jenkins: </br>
      `sudo systemctl restart jenkins`

   - Update Your Jenkins Pipeline
      Modify your Jenkins pipeline to not use ssh-agent, since that is causing the failure. Instead, use the private key directly: </br>

`stage('Deploy to Azure VM') {` </br>
`    steps {` </br>
`        script {` </br>
`            sh """` </br>
`            ssh -i /var/lib/jenkins/.ssh/id_rsa -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} '` </br>
`            docker pull ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE} &&` </br>
`            docker stop converter-app || true &&` </br>
`            docker rm converter-app || true &&` </br>
`            docker run -d --name converter-app -p 5000:80 ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE}` </br>
`            '`</br>
`            """`</br>
`        }`</br>
`    }`</br>
`}`

   - Test SSH Manually
      Before running the pipeline again, test SSH manually: </br>
      `sudo -u jenkins ssh -i /var/lib/jenkins/.ssh/id_rsa ${VM_USER}@${VM_HOST}` </br>
      - If it asks for a password, SSH keys were not copied correctly.
      - If it logs in successfully, retry your Jenkins pipeline.


### Contributing

Feel free to open issues or submit pull requests if you find areas for improvement.

