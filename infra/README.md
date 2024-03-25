# Aragok's Matchmaking Discord Bot Infrastructure

# Infrastructure built using following technologies
- terraform
- aws-cli
- ansible

Setup:  
Configure aws profile that you want to use.(TODO: explain more about this step)  
Create following files   
`{this}/ansible/vault_pass.txt`   => You can set a password for your vault  
`{this}/ansible/vault.yaml`  => Create key value pairs as shown in {this}/ansible/vault.example.yaml  
Run the following command to encrypt the vault in same directory as vault `ansible-vault encrypt vault.yaml --vault-password-file vault_pass.txt`  
Run `terraform apply` to start the proccess of infrasctructure creation. (To avoid adding all variables via command-line, you can add property `default` for each variable in {this}/terraform/variables.tf and set values that you want.)
