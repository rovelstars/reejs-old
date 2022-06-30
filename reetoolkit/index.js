function logger(msg, lvl = "DEBUG") {
  lvl = lvl.toUpperCase();
  console.log(`[${lvl}] ${msg}`);
}
let args = process.argv.slice(2);
let cmd = args[0];
args = args.slice(1);
import fs from "node:fs";
import { spawn } from "node:child_process";
import { homedir } from "node:os";
import server from "node:http";
import path from "node:path";

let metadata = JSON.parse(
  fs.readFileSync(`${homedir()}/.reejs/toolkit/package.json`, "utf8")
);
let routes = [];

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
} else if (cmd == "serve") {
  //check if .reecfg file exists
  if (fs.existsSync(`./.reecfg`)) {
    routes = JSON.parse(fs.readFileSync("./routes.json", "utf-8"));
    let isCsr =
      findLine(
        fs
          .readFileSync("./.reecfg", "utf-8")
          .split("\n")
          .filter((l) => !l.startsWith("#")),
        "render"
      ) == "csr";
    let shouldCache = findLine(
      fs
        .readFileSync("./.reecfg", "utf-8")
        .split("\n")
        .filter((l) => !l.startsWith("#")),
      "cache"
    )=="true"?true:false;
    let Cache = [];
    //{url,html}
    logger(`listening on port ${args[0] || 8080}`, "INFO");
    logger(`Rendering mode: ${isCsr ? "CSR" : "SSR"}`, "INFO");
    server
      .createServer({}, function (req, res) {
        if (req.url.split("?")[0] == "/") req.url = "/index.html";
        console.log(`[${req.method}]`, req.url);
        //read file
        const file = "." + req.url.split("?")[0];
        fs.readFile(file, function (err, data) {
          if (err) {
            if (req.url.split("?")[0] == "./src/routes.json") {
              res.writeHead(200, {
                "Content-Type": "application/json",
              });
              res.end(JSON.stringify(routes));
            } else if (matchUrl(req.url.replace("index.html", ""))) {
              let data = fs.readFileSync("./dist/index.html", "utf8");
              res.writeHead(200, {
                "Content-Type": "text/html",
              });
              res.end(data);
            } else {
              res.writeHead(404);
              res.end("404");
            }
          } else {
            let mimeTypes = {
              ".html": "text/html",
              ".js": "text/javascript",
              ".css": "text/css",
              ".json": "application/json",
              ".png": "image/png",
              ".jpg": "image/jpg",
              ".gif": "image/gif",
              ".svg": "image/svg+xml",
              ".wav": "audio/wav",
              ".mp4": "video/mp4",
              ".woff": "application/font-woff",
              ".ttf": "application/font-ttf",
              ".eot": "application/vnd.ms-fontobject",
              ".otf": "application/font-otf",
              ".wasm": "application/wasm",
              ".webp": "image/webp",
              ".webm": "video/webm",
              ".pdf": "application/pdf",
              ".ico": "image/x-icon",
            };
            if (isCsr) {
              let extname = String(path.extname(file)).toLowerCase();
              let contentType =
                mimeTypes[extname] || "application/octet-stream";
              res.writeHead(200, {
                "Content-Type": contentType,
              });
              res.end(data);
            } else {
              // Should be rendered as SSR
              //get the page regarding the url
              let cachedPage = matchCache(req.url,Cache);
              
              let page = matchUrl(req.url.replace("index.html", ""));
              if (page) {
                if(!cachedPage){
                  if(shouldCache){
                  console.log("[CACHE]","ADDING",req.url);
                  }
                res.writeHead(200, {
                  "Content-Type": "text/html",
                });
                let data = fs
                  .readFileSync(`./pages/${page.page}.js`, "utf8")
                  .split("html`")[1]
                  .replaceAll("<Head>", "<head>")
                  .replaceAll("</Head>", "</head>")
                  .replaceAll("className=", "class=")
                  .replace("`\n  }\n}", "");
                //split head from data
                let head = data.split("<head>")[1];
                head = head.split("</head>")[0];
                //eval the head
                head = eval(`\`${head}\``);
                let body = data.replace(`<head>${head}</head>`, "");
                //eval the body
                body = eval(`\`${body}\``);
                let resp = `<!DOCTYPE html><head>${head}<script src="./shell.js"></script></head><body><div id="app">${body}</div><script type="module">ree.init({app:"app",env:"dev",render:"react"});</script></body></html>`;
                res.end(resp);
                if(shouldCache){
                Cache.push({url:req.url.split("?")[0],html:resp});
                }
              }
              else{
                console.log("[CACHE]","FOUND",req.url);
                res.writeHead(200, {
                  "Content-Type": "text/html",
                });
                res.end(cachedPage.html);
              }
              } else {
                let extname = String(path.extname(file)).toLowerCase();
                let contentType =
                  mimeTypes[extname] || "application/octet-stream";
                res.writeHead(200, {
                  "Content-Type": contentType,
                });
                res.end(data);
              }
            }
          }
        });
      })
      .listen(args[0] || 8080);
  } else {
    logger("This command only runs in reejs generated folder.", "ERROR");
  }
} else if (cmd == "init") {
  if (!args[0]) {
    logger("No library name specified", "error");
    process.exit(1);
  }
  let project = args[0];
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
    fs.mkdirSync(`${project}/dist/libs`);
    fs.mkdirSync(`${project}/dist/assets`);
    fs.writeFileSync(
      `${project}/.reecfg`,
      `system:react\n# Can be react / vue.\nserver:less\n# Can be less / static.\nrender:csr\n# Can be csr / ssr.\ncache:true\n# Can be true / false.\nversion:${metadata.version}\n# Do not edit this!`,
      "utf8"
    );
    fs.writeFileSync(`${project}/src/index.js`, `// Start here!`, "utf8");
    fs.writeFileSync(
      `${project}/src/pages/index.js`,
      `import { render, html, Component } from "ree.react.js";`,
      "utf-8"
    );
    fs.writeFileSync(
      `${project}/src/routes.json`,
      `[{"url":"/", "jsx":"/src/pages/index.js"}]`,
      "utf8"
    );
    fs.writeFileSync(
      `${project}/libs/dragabilly.js.src`,
      `url:https://unpkg.com/draggabilly@{{ver}}/dist/draggabilly.pkgd.min.js\nversion:latest`,
      "utf8"
    );
    fs.writeFileSync(
      `${project}/libs/pathToRegexp.js.src`,
      `url:https://unpkg.com/path-to-regexp@{{ver}}/dist.es2015/index.js\nversion:6.2.1\ndelmap://# sourceMappingURL=index.js.map`,
      "utf-8"
    );
    fs.writeFileSync(
      `${project}/libs/router.js.src`,
      `url:https://ree.js.org/download/router.js\nversion:0.0.1`,
      "utf-8"
    );
    let shell = await fetch("https://ree.js.org/download/shell.js").then(
      (res) => res.text()
    );
    fs.writeFileSync(`${project}/dist/shell.js`, shell, "utf-8");
    fs.writeFileSync(
      `${project}/dist/sw.js`,
      await fetch("https://ree.js.org/download/sw.js").then((r) => r.text()),
      "utf-8"
    );
    let html = await fetch("https://ree.js.org/download/index.html").then(
      (res) => res.text()
    );
    fs.writeFileSync(`${project}/dist/index.html`, html, "utf-8");

    logger(
      `Project ${project} created!\nEdit ".reecfg" file and run "reejs updatecfg && reejs get"`,
      "info"
    );
  }
} else if (cmd == "updatecfg") {
  let cfg = fs
    .readFileSync(`./.reecfg`, "utf8")
    .split("\n")
    .filter((l) => !l.startsWith("#"));
  let version = findLine(cfg, "version").split(".");
  let metaVersion = metadata.version.split(".");
  if (version[0] != metaVersion[0]) {
    logger(
      `This app's version is ${version[0]}.${version[1]}.${version[2]} but the toolkit's version is ${metaVersion[0]}.${metaVersion[1]}.${metaVersion[2]}\nUpdate to the same version!`,
      "error"
    );
    process.exit(1);
  }
  if (version[0] == metaVersion[0] && version[1] < metaVersion[1]) {
    logger(
      `This app's version is ${version[0]}.${version[1]}.${version[2]} but the toolkit's version is ${metaVersion[0]}.${metaVersion[1]}.${metaVersion[2]}\nUpdate Toolkit as soon as possible for minor version!`,
      "warn"
    );
  }
  let system = findLine(cfg, "system");
  if (system == "react") {
    if (fs.existsSync("./libs/ree.vue.js.src")) {
      fs.unlinkSync("./libs/ree.vue.js.src");
    }
    if (fs.existsSync("./libs/ree.react.js.src")) {
      logger(`${system} is already installed!`, "warn");
    } else {
      fs.writeFileSync(
        "./libs/ree.react.js.src",
        `url:https://unpkg.com/htm@{{ver}}/preact/standalone.module.js\nversion:3.1.1`,
        "utf8"
      );
      logger(`${system} is now installed!`, "info");
    }
  } else if (system == "vue") {
    if (fs.existsSync("./libs/ree.react.js.src")) {
      fs.unlinkSync("./libs/ree.react.js.src");
    }
    if (fs.existsSync("./libs/ree.vue.js.src")) {
      logger(`${system} is already installed!`, "warn");
    } else {
      fs.writeFileSync(
        "./libs/ree.vue.js.src",
        `url:https://unpkg.com/vue@{{ver}}/dist/vue.esm-browser.prod.js\nversion:3.2.36`,
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
      if (delmap) {
        let l = code.findIndex((l) => l.includes(delmap));
        code = code.slice(0, l);
      }
      code = code.join("\n");
      code =
        `// Generated by ReeToolKit; You should not edit this file, atleast not lines 1 & 2.\n// url:${url}; version:${ver}\n\n` +
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

function matchUrl(realUrl) {
  realUrl = realUrl.split("?")[0];
  let foundRoute = routes.find((templateUrl) => {
    let urlRegex = pathToRegexp(templateUrl.url);
    return urlRegex.test(realUrl);
  });
  return foundRoute;
}
function matchCache(realUrl,cache) {
  realUrl = realUrl.split("?")[0];
  let foundRoute = cache.find((templateUrl) => {
    let urlRegex = pathToRegexp(templateUrl.url);
    return urlRegex.test(realUrl);
  });
  return foundRoute;
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          (code >= 48 && code <= 57) ||
          // `A-Z`
          (code >= 65 && code <= 90) ||
          // `a-z`
          (code >= 97 && code <= 122) ||
          // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name) throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError(
              "Capturing groups are not allowed at ".concat(j)
            );
          }
        }
        pattern += str[j++];
      }
      if (count) throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern) throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes,
    prefixes = _a === void 0 ? "./" : _a;
  var defaultPattern = "[^".concat(
    escapeString(options.delimiter || "/#?"),
    "]+?"
  );
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = function (type) {
    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
  };
  var mustConsume = function (type) {
    var value = tryConsume(type);
    if (value !== undefined) return value;
    var _a = tokens[i],
      nextType = _a.type,
      index = _a.index;
    throw new TypeError(
      "Unexpected "
        .concat(nextType, " at ")
        .concat(index, ", expected ")
        .concat(type)
    );
  };
  var consumeText = function () {
    var result = "";
    var value;
    while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
      result += value;
    }
    return result;
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix: prefix,
        suffix: "",
        pattern: pattern || defaultPattern,
        modifier: tryConsume("MODIFIER") || "",
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
        prefix: prefix,
        suffix: suffix,
        modifier: tryConsume("MODIFIER") || "",
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict,
    strict = _a === void 0 ? false : _a,
    _b = options.start,
    start = _b === void 0 ? true : _b,
    _c = options.end,
    end = _c === void 0 ? true : _c,
    _d = options.encode,
    encode =
      _d === void 0
        ? function (x) {
            return x;
          }
        : _d,
    _e = options.delimiter,
    delimiter = _e === void 0 ? "/#?" : _e,
    _f = options.endsWith,
    endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  // Iterate over the tokens and create our regexp string.
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys) keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:"
              .concat(prefix, "((?:")
              .concat(token.pattern, ")(?:")
              .concat(suffix)
              .concat(prefix, "(?:")
              .concat(token.pattern, "))*)")
              .concat(suffix, ")")
              .concat(mod);
          } else {
            route += "(?:"
              .concat(prefix, "(")
              .concat(token.pattern, ")")
              .concat(suffix, ")")
              .concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            route += "((?:"
              .concat(token.pattern, ")")
              .concat(token.modifier, ")");
          } else {
            route += "(".concat(token.pattern, ")").concat(token.modifier);
          }
        }
      } else {
        route += "(?:"
          .concat(prefix)
          .concat(suffix, ")")
          .concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict) route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited =
      typeof endToken === "string"
        ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1
        : endToken === undefined;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
function pathToRegexp(path, keys, options) {
  return stringToRegexp(path, keys, options);
}
