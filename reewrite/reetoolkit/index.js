function logger(msg, lvl = "DEBUG") {
  lvl = lvl.toUpperCase();
  console.log(`[${lvl}] ${msg}`);
}
let args = process.argv.slice(2);
let cmd = args[0];
import fs from "node:fs";
import { spawn } from "node:child_process";
let metadata = JSON.parse(fs.readFileSync("~/.reejs/toolkit/package.json", "utf8"));

function findLine(arr, word) {
  let e = arr.filter((l) => {
    return l.split(":")[0] == word;
  });
  if (e?.length) return e[0].replace(`${word}:`, "");
  else return undefined;
}

if (cmd == "reinstall") {
  logger(
    "[1/3] Removing ReeToolkit, Do NOT exit or else you need to install toolkit yourself!",
    "INFO"
  );
  //delete the folder .reejs located at $HOME
  spawn("rm", ["-rf ~/.reejs"]);
  logger("[2/3] Installing ReeToolkit", "INFO");

  logger("[3/3] Installing Linux version", "INFO");
  let output = spawn("curl", [
    "-s",
    "-L",
    "https://ree.js.org/download/toolkit.sh",
    "|",
    "bash",
  ]);
  logger("Done", "INFO");
} else if (cmd == "init") {
  if (!args[1]) {
    logger("No library name specified", "error");
    process.exit(1);
  }
  let project = args[1];
  //check if project exists
  if (fs.existsSync(`./${project}`)) {
    logger(`Project ${project} already exists`, "error");
    process.exit(1);
  } else {
    logger(
      `Creating project ${project} at ${process.cwd()}/${project}`,
      "info"
    );
    fs.mkdirSync(project);
    fs.mkdirSync(`${project}/libs`);
    fs.mkdirSync(`${project}/src`);
    fs.mkdirSync(`${project}/src/pages`);
    fs.mkdirSync(`${project}/dist`);
    fs.mkdirSync(`${project}/dist/assets`);
    fs.writeFileSync(
      `${project}/.reecfg`,
      `system:react\n# Can be react / vue.\nserver:less\n# Can be less / static.\ncss:tw\n# Can be tw / twind.`,
      "utf8"
    );
    fs.writeFileSync(`${project}/src/index.js`, `// Start here!`, "utf8");
    let code = await fetch("https://raw.githubusercontent.com/rovelstars/reejs/master/pages/coolpage.js");
    fs.writeFileSync(`${project}/src/pages/index.js`, code,"utf-8");
    fs.writeFileSync(`${project}/src/routes.json`,`[{"url":"/", "jsx":"src/pages/index.js"}]`, "utf8");
    fs.writeFileSync(
      `${project}/libs/dragabilly.js.src`,
      `url:https://unpkg.com/draggabilly@{{ver}}/dist/draggabilly.pkgd.min.js\nver:latest`,
      "utf8"
    );
    fs.writeFileSync(
      `${project}/libs/pathToRegexp.js.src`,
      `url:https://unpkg.com/path-to-regexp@{{ver}}/dist.es2015/index.js\nver:6.2.1\ndelmap://# sourceMappingURL=index.js.map`,
      "utf-8"
    );

    logger(
      `Project ${project} created!\nEdit ".reecfg" file and run "reejs updatecfg && reejs get"`,
      "info"
    );
  }
} else if (cmd == "updatecfg") {
  let cfg = fs
    .readFileSync(`${process.cwd()}/.reecfg`, "utf8")
    .split("\n")
    .filter((l) => !l.startsWith("#"));
  let version = findLine(cfg, "version").split(".");
  let metaVersion = metadata.version.split(".");
  if(version[0] != metaVersion[0]){
    logger(`This app's version is ${version[0]}.${version[1]}.${version[2]} but the toolkit's version is ${metaVersion[0]}.${metaVersion[1]}.${metaVersion[2]}\nUpdate to the same version!`, "error");
    process.exit(1);
  }
  if((version[0] == metaVersion[0]) && (version[1] < metaVersion[1])){
    logger(`This app's version is ${version[0]}.${version[1]}.${version[2]} but the toolkit's version is ${metaVersion[0]}.${metaVersion[1]}.${metaVersion[2]}\nUpdate Toolkit as soon as possible for minor version!`, "warn");
  }
  let system = findLine(cfg, "system");
  if(system == "react"){
    fs.unlinkSync("./libs/ree.vue.js.src");
    if(fs.existsSync("./libs/ree.react.js.src")){
      logger(`${system} is already installed!`, "warn");
    }
    else{
      fs.writeFileSync(
        "./libs/ree.react.js.src",
        `url:https://unpkg.com/htm@{{ver}}/preact/standalone.module.js\nver:3.1.1`,
        "utf8"
      );
      logger(`${system} is now installed!`, "info");
    }
  }
  else if(system=="vue"){
    fs.unlinkSync("./libs/ree.react.js.src");
    if(fs.existsSync("./libs/ree.vue.js.src")){
      logger(`${system} is already installed!`, "warn");
    }
    else{
      fs.writeFileSync(
        "./libs/ree.vue.js.src",
        `url:https://unpkg.com/vue@{{ver}}/dist/vue.esm-browser.prod.js\nver:3.2.36`,
        "utf8"
      );
      logger(`${system} is now installed!`, "info");
    }
  }
} else if (cmd == "get") {
  let libsrcs = fs.readdirSync("./libs").filter((f) => f.endsWith(".src"));
  libsrcs.forEach(async (lib) => {
    let data = fs.readFileSync(`./libs/${lib}`, "utf-8");
    lib = lib.replace(".js.src", ".js");
    //check if file exists
    let oldcode;
    if (fs.existsSync(`./dist/libs/${lib}`)) {
      oldcode = fs.readFileSync(`./dist/libs/${lib}`, "utf-8");
    }
    data = data.split("\n").filter((l) => !l.startsWith("#"));
    let url = findLine(data, "url");
    let ver = findLine(data, "version");
    if (ver == "latest")
      logger(
        'Do not use the version named as "latest", instead provide a version number. The libraries will be re-downloaded everytime due to this.',
        "WARN"
      );
    url = url.replaceAll("{{ver}}", ver);
    let delmap = findLine(data, "delmap");
    let oldurl;
    let oldver;
    let shouldUpdate = true;
    if (oldcode) {
      shouldUpdate = false;
      oldcode = oldcode.split("\n")[1];
      oldcode = oldcode.replace("// ", "");
      oldcode = oldcode.split("; ");
      oldurl = findLine(oldcode, "url");
      oldver = findLine(oldcode, "version");
      if (oldurl != url) {
        shouldUpdate = true;
      } else if (oldver != ver) {
        shouldUpdate = true;
      } else if (ver == "latest") {
        shouldUpdate = true;
      }
    }
    if (shouldUpdate) {
      let code = await fetch(url).then((r) => r.text());
      code = code.split("\n");
      let l = code.findIndex((l) => l.includes(delmap));
      code = code.slice(0, l);
      code = code.join("\n");
      code =
        `// Generated by ReeToolKit; You should not edit this file, atleast not lines 1 & 2.\n// url:${url}; ver:${ver}\n\n` +
        code;
      if (ver == "latest") ver = " latest";
      if (oldver == "latest") oldver = " latest";
      logger(
        `${oldcode ? "Updating" : "Downloading"} ${lib} [v${ver}] ${
          oldcode ? `from [v${oldver}]` : ""
        }`,
        "DL"
      );
      fs.writeFileSync(`./dist/libs/${lib}`, code);
    }
    if (!shouldUpdate) {
      logger(`${lib.replace(".js", "")} is up to date!`, "DL");
    }
  });
} else {
  logger("Not a valid argument!");
}
