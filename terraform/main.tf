# main.tf

resource "azurerm_resource_group" "myDevOpsRG" {
  name     = "myDevOpsRG"
  location = "East US"
}

resource "azurerm_virtual_network" "my_vnet" {
  name                = "converter_vnet"
  location            = azurerm_resource_group.myDevOpsRG.location
  resource_group_name = azurerm_resource_group.myDevOpsRG.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "my_subnet" {
  name                 = "subnet1"
  resource_group_name  = azurerm_resource_group.myDevOpsRG.name
  virtual_network_name = azurerm_virtual_network.my_vnet.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_public_ip" "my_public_ip" {
  name                         = "myVMPublicIP"
  location                     = azurerm_resource_group.myDevOpsRG.location
  resource_group_name          = azurerm_resource_group.myDevOpsRG.name
  allocation_method            = "Dynamic"
  idle_timeout_in_minutes      = 4
}

resource "azurerm_network_interface" "my_nic" {
  name                = "converter_Nic"
  location            = azurerm_resource_group.myDevOpsRG.location
  resource_group_name = azurerm_resource_group.myDevOpsRG.name

  ip_configuration {
    name                          = "internal"
    subnet_id                    = azurerm_subnet.my_subnet.id  # Using the subnet defined above
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id         = azurerm_public_ip.my_public_ip.id  # Associate public IP
  }
}

resource "azurerm_container_registry" "my_acr" {
  name                      = "converteracr"
  resource_group_name       = azurerm_resource_group.myDevOpsRG.name
  location                  = azurerm_resource_group.myDevOpsRG.location
  sku                       = "Basic"
  admin_enabled             = true
}

resource "azurerm_linux_virtual_machine" "my_vm" {
  name                  = var.my_vm
  location              = azurerm_resource_group.myDevOpsRG.location
  resource_group_name   = azurerm_resource_group.myDevOpsRG.name
  network_interface_ids = [azurerm_network_interface.my_nic.id]
  size                  = "Standard_B1ms"

  computer_name                   = var.VMhostname
  admin_username                  = var.admin_username
  admin_password                  = var.admin_password
  disable_password_authentication = false

  # Enable Managed Identity
    identity {
      type = "SystemAssigned"
  }

  os_disk {
    name              = "myOSDisk"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
    source_image_reference {
      publisher = "Canonical"       # Ubuntu's publisher
      offer     = "0001-com-ubuntu-server-jammy"    # The offer name
      sku       = "22_04-lts"       # The version of Ubuntu
      version   = "latest"          # The version to use (latest is usually fine)
    }  

  custom_data = base64encode(<<-EOT
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io
              sudo apt-get install -y nginx
              sudo systemctl enable docker
              sudo systemctl enable nginx
              EOT
  )
}

# Assign ACR Pull role to the VM
resource "azurerm_role_assignment" "acr_pull_role" {
  scope                = azurerm_container_registry.my_acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_virtual_machine.my_vm.identity[0].principal_id
}
