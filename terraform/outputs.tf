# Output the name of the virtual machine
output "vm_name" {
  description = "The name of the virtual machine"
  value       = azurerm_linux_virtual_machine.my_vm.name
}

# Output the public IP address of the VM (if applicable)
output "vm_public_ip" {
  description = "The public IP address of the virtual machine"
  value       = azurerm_public_ip.my_public_ip.ip_address
}

# Output the resource group name
output "resource_group_name" {
  description = "The resource group name"
  value       = azurerm_resource_group.myDevOpsRG.name
}
