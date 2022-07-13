#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import sade from "./libs/sade/index.js";
import color from "./libs/@reejs/colors/index.js";
import { exec } from "child_process";
import { createServer } from 'http'
import { createApp } from './libs/h3/index.js'
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, "utf8"));

function logger(msg, lvl = "DEBUG") {
    lvl = lvl.toUpperCase();
    console.log(`[${lvl}] ${msg}`);
}
function findLine(arr, word) {
    let e = arr.filter((l) => {
        return l.split(":")[0] == word;
    });
    if (e?.length) return e[0].replace(`${word}:`, "");
    else return undefined;
}
function isReejsFolder(dir) {
    return fs.existsSync(`${dir}/config.reejs`);
}

const cli = sade("reejs");
cli.version(pkg.version);

//read all the files from cmds folder and eval them
const cmds = fs.readdirSync(`${__dirname}/cmds`);
cmds.filter(f => f.endsWith(".js")).forEach(cmd => {
    const file = `${__dirname}/cmds/${cmd}`;
    const code = fs.readFileSync(file, "utf8");
    eval(code);
});

cli.parse(process.argv);