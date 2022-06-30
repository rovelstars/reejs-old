if [ -d ~/.reejs ]; then
  echo "[INSTALL] reetoolkit already installed"
  exit 0
fi

echo "[INSTALL] Initializing reetoolkit on $HOME"
mkdir -p ~/.reejs/toolkit
echo "[INSTALL] Downloading reetoolkit"
# curl -s https://raw.githubusercontent.com/rovelstars/reejs/master/reewrite/reetoolkit/index.js > ~/.reejs/toolkit/index.js
cp ./index.js ~/.reejs/toolkit/index.js

# curl -s https://raw.githubusercontent.com/rovelstars/reejs/master/reewrite/reetoolkit/package.json > ~/.reejs/toolkit/package.json
cp ./package.json ~/.reejs/toolkit/package.json

echo "[INSTALL] Installing reetoolkit"
echo "[INSTALL] Adding alias to your shell configuration file and also the current shell"

# add alias to .bashrc and .zshrc if exists and not already added
if [ -f ~/.bashrc ]; then
  if ! grep -q "reejs" ~/.bashrc; then
    echo "alias reejs='node ~/.reejs/toolkit/index.js'" >> ~/.bashrc
  fi
fi

if [ -f ~/.zshrc ]; then
  if ! grep -q "reejs" ~/.zshrc; then
    echo "alias reejs='node ~/.reejs/toolkit/index.js'" >> ~/.zshrc
  fi
fi

echo "[INSTALL] Successfully added alias to your available shell configuration files. If you don't use bash or zsh, you can add the below line manually to your shell configuration file:"
echo -e "\nalias reejs='node ~/.reejs/toolkit/index.js'\n"

alias reejs='node ~/.reejs/toolkit/index.js'

echo "[INSTALL] Reetoolkit installed! Run 'reejs init reejs-app' to start using it!\nLearn more about it here: <link coming soon!>"