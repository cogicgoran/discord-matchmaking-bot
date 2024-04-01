#!/bin/bash
useradd -m -s "/bin/bash" -G sudo ${ansible_username}
mkdir /home/${ansible_username}/.ssh
touch /home/${ansible_username}/.ssh/authorized_keys
echo "${ansible_public_key}" > /home/${ansible_username}/.ssh/authorized_keys
