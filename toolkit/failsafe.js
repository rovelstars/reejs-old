#!/usr/bin/env node
//This is the file that installs the dependencies for the toolkit so toolkit can be used. Exactly follows the specification of cmds/install.js

import {spawn} from "child_process";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
spawn("node ./failsafe/install.js && node ./failsafe/link.js", {stdio: "inherit", detached: false,cwd: __dirname});