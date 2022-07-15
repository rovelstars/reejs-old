#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import sade from "./assets/libs/sade/index.js";
import color from "./assets/libs/@reejs/colors/index.js";
import { exec, spawn } from "child_process";
import { get } from "https";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, "utf8"));
import { homedir, platform } from "os";
let home = homedir();
let os = platform();
let homewin;
if (os == "win32") {
  homewin = home;
  home = home.replace(/\\/g, "/");
}
let dir = `${home}/.reejs`;

function logger(msg, lvl = "DEBUG") {
  lvl = lvl.toUpperCase();
  console.log(`[${lvl}] ${msg}`);
}
function readConfig(arr, word) {
  let e = arr.filter((l) => {
    return l.split(":")[0] == word;
  });
  if (e?.length) return e[0].replace(`${word}:`, "");
  else return undefined;
}
function isReejsFolder() {
  return fs.existsSync(`${process.cwd()}/.reecfg`);
}
function downloadFile(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  get(url, function (response) {
    response.pipe(file);
    file.on("finish", function () {
      file.close(cb);
    });
  });
}

const cli = sade("reejs");
cli.version(pkg.version);

//read all the files from cmds folder and eval them
const cmds = fs.readdirSync(`${__dirname}/cmds`);
cmds
  .filter((f) => f.endsWith(".js"))
  .forEach((cmd) => {
    const file = `${__dirname}/cmds/${cmd}`;
    const code = fs.readFileSync(file, "utf8");
    eval(code);
  });

cli.parse(process.argv);
