provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}

resource "aws_instance" "matchmaking_bot_server" {
  ami                    = "ami-04dfd853d88e818e8"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.mm_bot_vpc_subnet_public.id
  key_name               = aws_key_pair.mm_bot_key_pair.id
  vpc_security_group_ids = [aws_security_group.mm_bot_sec_group.id]
  user_data = base64encode(
    templatefile(
      "userdata.tpl",
      {
        ansible_public_key = local.ansible_public_key,
        ansible_username : "ansible"
      }
  ))

  tags = {
    Name = "AragokMatchmakingBotInstance"
  }

  # Adds the public IP address of the instance to the local ssh config file
  provisioner "local-exec" {
    command = templatefile("${var.host_os}-ssh-config.tpl", {
      hostname : self.public_ip,
      user = "ubuntu",
      identityfile : var.path_to_root_private_key
    })
    interpreter = var.host_os == "windows" ? ["Powershell", "-Command"] : ["bash", "-c"]
  }

  # update ansible inventory file with ip address for new server instance
  provisioner "local-exec" {
    working_dir = var.path_to_ansible_working_dir
    command     = <<-EOT
    #!/bin/bash
    echo ${self.public_ip} > hosts
    EOT
  }

  # wait for ssh connection to become available, otherwise ansible playbooks won't be able to execute correctly
  # local-exec will execute before instance is available, this makes sure it doesn't happen
  provisioner "remote-exec" {
    inline = ["echo 'Wait until SSH is ready'"]

    connection {
      type        = "ssh"
      user        = "ansible"
      private_key = local.ansible_private_key
      host        = self.public_ip
    }
  }

  # run ansible playbook to configure the server
  provisioner "local-exec" {
    working_dir = var.path_to_ansible_working_dir
    command     = "ansible-playbook --vault-password-file vault_pass.txt playbooks/server_config.yaml"
  }
}

resource "aws_subnet" "mm_bot_vpc_subnet_public" {
  vpc_id                  = aws_vpc.mm_bot_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = var.aws_availability_zone
  map_public_ip_on_launch = true
}
resource "aws_internet_gateway" "mm_bot_internet_gateway" {
  vpc_id = aws_vpc.mm_bot_vpc.id
}

resource "aws_vpc" "mm_bot_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_route_table" "mm_bot_route_table" {
  vpc_id = aws_vpc.mm_bot_vpc.id
}

resource "aws_route" "mm_bot_route" {
  route_table_id         = aws_route_table.mm_bot_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.mm_bot_internet_gateway.id
}

resource "aws_route_table_association" "mm_bot_route_association" {
  route_table_id = aws_route_table.mm_bot_route_table.id
  subnet_id      = aws_subnet.mm_bot_vpc_subnet_public.id
}

resource "aws_security_group" "mm_bot_sec_group" {
  name        = "mm_bot_sec_group"
  description = "Security group for matchmaking bot"
  vpc_id      = aws_vpc.mm_bot_vpc.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["${var.your_trusted_machine_ip}/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "mm_bot_key_pair" {
  key_name   = "mm_bot_key"
  public_key = local.root_public_key
}
