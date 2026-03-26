#!/bin/bash

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root (e.g., using sudo)"
  exit 1
fi

echo "Detecting operating system..."

if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS=$ID
else
  echo "Cannot detect the operating system. Ensure you are running Arch, Ubuntu, or Fedora."
  exit 1
fi

echo "Detected OS: $OS"

case "$OS" in
  ubuntu|debian)
    echo "Installing Docker and Docker Compose on Ubuntu/Debian..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release

    # Add Docker's official GPG key and repo for latest versions (often better than default repos)
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg || true
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ;;
  
  arch|manjaro)
    echo "Installing Docker and Docker Compose on Arch Linux..."
    pacman -Sy --noconfirm docker docker-compose
    ;;
  
  fedora|rhel|centos)
    echo "Installing Docker and Docker Compose on Fedora..."
    dnf -y install dnf-plugins-core
    dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
    dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ;;
    
  *)
    echo "Unsupported OS: $OS. Please install Docker manually."
    exit 1
    ;;
esac

echo "Starting and enabling Docker service..."
systemctl enable --now docker

# Add the user running sudo to the docker group
if [ -n "$SUDO_USER" ]; then
  echo "Adding user '$SUDO_USER' to the docker group..."
  usermod -aG docker "$SUDO_USER"
  echo "IMPORTANT: User '$SUDO_USER' must log out and log back in (or run 'newgrp docker') for the group changes to take effect."
else
  echo "Adding current user to docker group..."
  usermod -aG docker "$USER"
  echo "IMPORTANT: You must log out and log back in (or run 'newgrp docker') for the group changes to take effect."
fi

echo ""
echo "Docker setup complete! You can now run the project containers."
echo "Use: docker compose up -d --build (or docker-compose up -d --build)"
