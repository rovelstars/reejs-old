#!/usr/bin/env node

//This installs reejs toolkit to the home directory

import path from 'path';
import fs from 'fs';
import { homedir, platform } from 'os';
import { exec } from 'child_process';

let home = homedir();
let os = platform();

if (os == "win32") {
    home = home.replace(/\\/g, "/");
}

//make a folder in the home directory
let dir = `${home}/.reejs`;
if (!fs.existsSync(dir)) {
    console.log("[INFO] Creating directory for installation: " + dir);
    fs.mkdirSync(dir);
    console.log("[INFO] Checking for git...");
    exec("git --version", (err, stdout, stderr) => {
        if (err) {
            if (os == "win32") {
                console.log("[ERROR] Git not found. Please install git from https://git-scm.com/downloads");
            }
            else if (os == "linux") {
                console.log("[ERROR] Git not found. Please install git with `sudo apt-get install git`");
            }
            else if (os == "darwin") {
                console.log("[ERROR] Git not found. Please install git with `brew install git`");
            }
            else {
                console.log("[ERROR] Git not found. Please install git cli");
            }
            process.exit(1);
        }
        console.log("[INFO] Git found. Cloning...");
        exec("git clone https://github.com/rovelstars/reejs.git " + dir, (err, stdout, stderr) => {
            if (err) {
                console.log("[ERROR] Git clone failed. Please try again");
                process.exit(1);
            }
            console.log("[INFO] Git clone successful. Installing libraries...");
            exec("npm link .", { cwd: dir+"/toolkit/" }, (err, stdout, stderr) => {
                if (err) {
                    console.log("[ERROR] Installing libraries failed. Please try again");
                    process.exit(1);
                }
                console.log("[INFO] Installing libraries successful! Cleaning up files...");
                exec("rm -rf .git", { cwd: dir }, (err, stdout, stderr) => {
                    if (err) {
                        console.log("[ERROR] Cleaning up files failed. Please try again");
                        process.exit(1);
                    }
                    console.log("[INFO] Cleaning up files successful! Reejs has been installed!\nTry it out by running `reejs init reejs-app`");
                    process.exit(0);
                });
            });
        });
    });
}
else {
    console.log("[WARN] reejs toolkit is already installed. If you want to reinstall, delete the directory at: " + dir);
}

process.on('SIGINT', function () {
    console.log("\n[INFO] Cleaning up files...");
    exec("rm -rf " + dir, (err, stdout, stderr) => {
        if (err) {
            console.log("[ERROR] Cleaning up files failed. Please try again");
            process.exit(1);
        }
        console.log("[INFO] Cleaning up files successful! Bye!");
        process.exit(0);
    });
});

process.on('SIGTERM', function () {
    console.log("\n[INFO] Cleaning up files...");
    exec("rm -rf " + dir, (err, stdout, stderr) => {
        if (err) {
            console.log("[ERROR] Cleaning up files failed. Please try again");
            process.exit(1);
        }
        console.log("[INFO] Cleaning up files successful! Bye!");
        process.exit(0);
    });
});
