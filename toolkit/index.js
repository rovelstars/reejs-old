#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import sade from "sade";
import color from "@reejs/colors";
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
  let e = arr
  .filter((l)=>{return !l.startsWith("#")})
  .filter((l) => {
    return l.split(":")[0].trim() == word.trim();
  });
  if (e?.length) {
    let r = e[0];
    r = r.startsWith(`${word}: `)?r.replace(`${word}: `, ""):r.replace(`${word}:`, "");
    if (r.includes("|") ||(r.startsWith("[") && r.endsWith("]"))) {
      r = r.substring(1, r.length - 1);
      r = r.split("|").map((e) => {
        e = e.trim();
        if (e.startsWith("\"") && e.endsWith("\"")) {
          e = e.substring(1, e.length - 1);
        }
        return e;
      });
      return r;
    } else {
      r = r.trim();
      if (r.startsWith("\"") && r.endsWith("\"")) {
        r = r.substring(1, r.length - 1);
      }
      return r;
    }
  } else return undefined;
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
