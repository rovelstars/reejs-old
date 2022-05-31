function logger(msg, lvl = "DEBUG") {
  lvl = lvl.toUpperCase();
  console.log(`[${lvl}] ${msg}`);
};
let args = process.argv.slice(2);
let cmd = args[0];
import fs from "node:fs";
import {spawn} from "node:child_process";

function findLine(arr, word) {
  let e = arr.filter((l) => {
    return l.split(":")[0] == word;
  });
  if (e?.length) return e[0].replace(`${word}:`, "");
  else return undefined;
}

if(cmd=="reinstall"){
  logger("[1/3] Removing ReeToolkit, Do NOT exit or else you need to install toolkit yourself!","INFO");
  //delete the folder .reejs located at $HOME
  spawn("rm", ["-rf ~/.reejs"]);
  logger("[2/3] Installing ReeToolkit","INFO");

    logger("[3/3] Installing Linux version","INFO");
    let output = spawn("curl",["-s","-L","https://ree.js.org/download/toolkit.sh","|","bash"]);
    logger("Done","INFO");
}
else if(cmd=="init"){
  if(!args[1]){
    logger("No library name specified", "error");
    process.exit(1);
  }
  let project = args[1];
  //check if project exists
  if(fs.existsSync(`./${project}`)){
    logger(`Project ${project} already exists`, "error");
    process.exit(1);
  }
  else{
  logger(`Creating project ${project} at ${process.cwd()}/${project}`, "info");
  fs.mkdirSync(project);
  fs.mkdirSync(`${project}/libs`);
  fs.mkdirSync(`${project}/src`);
  fs.mkdirSync(`${project}/src/assets`);
  fs.mkdirSync(`${project}/dist`);
  fs.writeFileSync(`${project}/.reecfg`, `system:react\n# Can be react / vue.\nserver:less\n# Can be less / static.\n`, "utf8");
  fs.writeFileSync(`${project}/src/index.js`, `// Start here!`, "utf8");
  logger(`Project ${project} created!\nEdit ".reecfg" file and run "reejs install"`, "info");
  }
}
else if(cmd=="get"){
  let libsrcs = fs.readdirSync("./libs").filter((f) => f.endsWith(".src"));
libsrcs.forEach(async (lib) => {
  let data = fs.readFileSync(`./libs/${lib}`, "utf-8");
  lib = lib.replace(".src", ".js");
  //check if file exists
  let oldcode;
  if (fs.existsSync(`./dist/libs/${lib}`)) {
    oldcode = fs.readFileSync(`./dist/libs/${lib}`, "utf-8");
  }
  data = data.split("\n");
  let url = findLine(data, "url");
  let ver = findLine(data, "ver");
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
    oldver = findLine(oldcode, "ver");
    if (oldurl != url) {
      shouldUpdate = true
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
      if(ver=="latest") ver = " latest";
      if(oldver=="latest") oldver = " latest";
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
}
else {
  logger("Not a valid argument!");
}