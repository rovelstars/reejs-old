import path from "path";
import { fileURLToPath } from "url";
import { get } from "https";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, "utf8"));
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
    return l.split(":")[0].trim() == word.trim();
  });
  if (e?.length) {
    let r = e[0].replace(`${word}:`, "");
    if (r.includes("|") ||(r.startsWith("[") && r.endsWith("]"))) {
      r = r.substring(1, r.length - 1);
      r = r.split("|").map((e) => {
        return e.trim();
      });
      return r;
    } else {
      r = r.trim();
      return r;
    }
  } else return undefined;
}
function isReejsFolder() {
  return true;
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

function color(str, color, bg) {
  return str;
}
let opts = { force: true };

console.log(`[INFO] Linking ${color("assets/libs","","blueBrightBg")} folder!`);
        let libs = fs.readdirSync(`${process.cwd()}/assets/libs`);
        libs.forEach(lib=>{
            //make soft link to node_modules/@reejs/<lib>
            let libPath = `${process.cwd()}/assets/libs/${lib}`;
            let libLink = `${process.cwd()}/node_modules/@reejs/${lib}`;
            if(!fs.existsSync(`${process.cwd()}/node_modules/@reejs/`)) {
                try{
                fs.mkdirSync(`${process.cwd()}/node_modules/`);
                }catch(e){}
                try{
                fs.mkdirSync(`${process.cwd()}/node_modules/@reejs/`);
                }catch(e){}
                console.log(`[INFO] Creating ${color("@reejs","","blueBrightBg")} folder to link all the libraries!`);
            }
            if(!fs.existsSync(libLink)) {
                fs.symlinkSync(libPath,libLink);
                console.log(`[INFO] Linked ${color(lib,"","blueBrightBg")} -> ${color("@reejs/"+lib,"","blueBrightBg")}`);
            }
            else{
                console.log(`[INFO] ${color(lib,"","blueBrightBg")} is already linked; skipping...`);
            }
        }
        );