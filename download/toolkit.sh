if [ -d ~/.reejs ]; then
  printf "[INSTALL] reetoolkit already installed"
  exit 0
fi

printf "[INSTALL] Initializing reetoolkit on $HOME"
mkdir -p ~/.reejs/toolkit
printf "[INSTALL] Downloading reetoolkit"
curl -s https://raw.githubusercontent.com/rovelstars/reejs/master/reewrite/reetoolkit/index.js > ~/.reejs/toolkit/index.js
printf "[INSTALL] Installing reetoolkit"
printf "[INSTALL] Adding alias to your shell configuration file and also the current shell"

# add alias to .bashrc and .zshrc if exists
if [ -f ~/.bashrc ]; then
    printf "alias reejs='node ~/.reejs/toolkit/index.js'" >> ~/.bashrc
fi
if [ -f ~/.zshrc ]; then
    printf "alias reejs='node ~/.reejs/toolkit/index.js'" >> ~/.zshrc
fi

printf "[INSTALL] Successfully added alias to your available shell configuration files. If you don't use bash or zsh, you can add the below line manually to your shell configuration file:"
printf "\\nalias reejs='node ~/.reejs/toolkit/index.js'\\n"

alias reejs='node ~/.reejs/toolkit/index.js'

printf "[INSTALL] Reetoolkit installed! Run 'reejs init reejs-app' to start using it!\nLearn more about it here: <link coming soon!>"