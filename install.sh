#!/usr/bin/bash

printf "npm path [$(which npm)]: "
read npm_path

printf "node path [$(which node)]: "
read node_path

if [ "$npm_path" == "" ]; then
  npm_path="$(which npm)"
fi

if [ "$node_path" == "" ]; then
  node_path="$(which node)"
fi

if ![ -f "$npm_path" ]; then
  >&2 echo "npm at \"$npm_path\" not found!"
  exit 1
fi

if ![ -f "$node_path" ]; then
  >&2 echo "node at \"$node_path\" not found!"
  exit 1
fi

echo "installing dependencies..."
$npm_path i || exit 1

echo "building..."
$npm_path run build || exit 1

if [ -x "$(command -v systemctl)" ]; then
  echo "creating user \"template\"..."
  sudo useradd -m template || exit 1

  echo "installing systemd service..."
  (sed "s/WORKING_DIRECTORY/$(pwd | awk '{gsub("/", "\\\/"); print}')/g" template.service | sed "s/NPM_PATH/$npm_path" | sudo tee /lib/systemd/system/template.service) || exit 1

  echo "starting and enabling service..."
  sudo systemctl enable --now template || exit 1
fi
