cli
  .command("install", "Add a new library/component to the project", {
    alias: ["i", "add"],
  })
  .option("-f --force", "Reinstall everything even if its already installed")
  .action((opts) => {
    //check for all the files that end with .js.src
    //if same files with extension .js exists, skip
    //if not, copy the file with extension .js.src to .js
    if (isReejsFolder()) {
      if (!fs.existsSync(`${process.cwd()}/assets/libs/`)) {
        console.log("[INFO] Creating assets folder");
        try {
          fs.mkdirSync(`${process.cwd()}/assets`);
        } catch (e) {}
        try {
          fs.mkdirSync(`${process.cwd()}/assets/libs`);
        } catch (e) {}
      }
      if (!fs.existsSync(`${process.cwd()}/libs`)) {
        console.log("[INFO] Creating libs folder");
        fs.mkdirSync(`${process.cwd()}/libs`);
      }
      let files = fs.readdirSync(`${process.cwd()}/libs`);
      let jsfiles = files.filter((f) => f.endsWith(".js.src"));
      jsfiles.forEach((file) => {
        const name = file.replace(".js.src", "");
        let dest = `${process.cwd()}/assets/libs/${name}/`;

        if (opts.force && fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
          console.log(`[INFO] Removed ${name}`);
        }
        if (fs.existsSync(dest + ".js.src")) {
          let data = fs.readFileSync(dest + ".js.src", "utf8");
          let newData = fs.readFileSync(
            `${process.cwd()}/libs/${file}`,
            "utf8"
          );
          newData = newData.split("\n");
          data = data.split("\n");
          let oldVersion = readConfig(data, "version");
          let newVersion = readConfig(newData, "version");
          let oldUrl = readConfig(data, "url");
          let newUrl = readConfig(newData, "url");
          let moduleType = readConfig(data, "type") || "commonjs";
          let _as = readConfig(newData, "as") || "index.js";
          if (_as.includes("/")) {
            //get the part before the last /
            let temp = _as.split("/");
            _as = temp.pop();
            let dir = temp.join("/");
            if (dir) {
              //recursive make the directory
              console.log(`[INFO] Creating directory ${dir} for ${_as}`);
              dest = `${dest}${dir}/`;
              try {
                fs.mkdirSync(dest, { recursive: true });
              } catch (e) {}
            }
            //get the part after the last /
            _as = _as.substring(0, _as.lastIndexOf("/"));
          }
          let more = readConfig(newData, "more");
          let more_as;
          if (more) {
            more_as = readConfig(newData, "more_as");
          }
          if (more && more?.length != more_as?.length) {
            console.log(
              color(
                `[ERROR] \`more\` and \`more_as\` must be the same length for ${name}`,
                "red"
              )
            );
            process.exit(1);
          }
          if (newVersion == "latest")
            console.log(
              "[WARN] Don't use @latest versions! This packages will be always updated even if no new updates happen to them."
            );
          let shouldDownload = false;
          if (oldVersion != newVersion || newVersion == "latest")
            shouldDownload = true;
          if (oldUrl != newUrl) shouldDownload = true;
          if (opts.force) shouldDownload = true;
          if (shouldDownload) {
            console.log(
              `[INFO] Updating Library ${name} ${
                newVersion != oldVersion
                  ? `from v${oldVersion} to v${newVersion} `
                  : ""
              }...`
            );
            _as = readConfig(newData, "as") || "index.js";
            _as = _as.split("/").pop();
            downloadFile(newUrl, dest + _as, () => {
              console.log(
                `[SUCCESS] Updated Library ${color(name, "green")} | [${color(
                  newUrl,
                  "blue"
                )} -> ${color(`/${name}/` + _as, "yellow")}]`
              );
            });
            if (more) {
              more.forEach((m, i) => {
                downloadFile(m, dest + more_as[i], () => {
                  console.log(
                    `[SUCCESS] Updated Library ${color(
                      name,
                      "green"
                    )} | [${color(m, "blue")} -> ${color(
                      `/${name}/` + more_as[i],
                      "yellow"
                    )}]`
                  );
                });
              });
            }

            //copy js.src to assets
            fs.copyFileSync(
              `${process.cwd()}/libs/${file}`,
              `${process.cwd()}/assets/libs/${name}/.js.src`
            );
            let pkg = `{"name":"${name}","version":"${newVersion}","url":"${newUrl}","main":"${dir+"/"+_as}","type":"${moduleType}"}`;
            fs.writeFileSync(
              `${process.cwd()}/assets/libs/${name}/package.json`,
              pkg
            );
          }
          if (!shouldDownload) {
            console.log(`[INFO] Download skipped for library ${name}`);
          }

          // I literally cant see this area!
        } else {
          let newData = fs.readFileSync(
            `${process.cwd()}/libs/${file}`,
            "utf8"
          );
          newData = newData.split("\n");
          let newVersion = readConfig(newData, "version");
          let newUrl = readConfig(newData, "url");
          let _as = readConfig(newData, "as") || "index.js";
          let dir = "";
          //create folder if not already exists
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
          }
          if (_as.includes("/")) {
            //get the part before the last /
            let temp = _as.split("/");
            _as = temp.pop();
            dir = temp.join("/");
            if (dir) {
              //recursive make the directory
              console.log(`[INFO] Creating directory ${dir} for ${_as}`);
              dest = `${dest}${dir}/`;
              try {
                fs.mkdirSync(dest, { recursive: true });
              } catch (e) {}
            }
            //get the part after the last /
            _as = _as.substring(0, _as.lastIndexOf("/"));
          }
          let moduleType = readConfig(newData, "type") || "commonjs";
          let more = readConfig(newData, "more");
          let more_as;
          if (more) {
            more_as = readConfig(newData, "more_as");
          }
          if (more && more?.length != more_as?.length) {
            console.log(
              color(
                `[ERROR] \`more\` and \`more_as\` must be the same length for ${name}`,
                "red"
              )
            );
            process.exit(1);
          }
          console.log(`[INFO] Downloading Library ${name} ...`);
          _as = readConfig(newData, "as") || "index.js";
          _as = _as.split("/").pop();
          downloadFile(newUrl, dest + _as, () => {
            console.log(
              `[SUCCESS] Downloaded Library ${color(name, "green")} | [${color(
                newUrl,
                "blue"
              )} -> ${color(`/${name}/` + _as, "yellow")}]`
            );
          });
          if (more) {
            more.forEach((m, i) => {
              downloadFile(m, dest + more_as[i], () => {
                console.log(
                  `[SUCCESS] Downloaded Library ${color(
                    name,
                    "green"
                  )} | [${color(m, "blue")} -> ${color(
                    `/${name}/` + more_as[i],
                    "yellow"
                  )}]`
                );
              });
            });
          }

          //copy js.src to assets
          fs.copyFileSync(
            `${process.cwd()}/libs/${file}`,
            `${process.cwd()}/assets/libs/${name}/.js.src`
          );
          let pkg = `{"name":"${name}","version":"${newVersion}","url":"${newUrl}","main":"${dir+"/"+_as}","type":"${moduleType}"}`;
          fs.writeFileSync(
            `${process.cwd()}/assets/libs/${name}/package.json`,
            pkg
          );
        }
      });
    } else {
      console.log("[WARN] You are not in a Reejs folder");
    }
  });
