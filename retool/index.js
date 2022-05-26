//read process argv can make a switch case
let fs = require("node:fs");
let path = require("node:path");
let routes = JSON.parse(fs.readFileSync("./routes.json", "utf8"))
let args = process.argv.slice(2);
let command = args[0];
args = args.slice(1);
let commands = [
  ["serve", "s"],
  ["help", "h"],
];
//find a command
let commandIndex = commands.findIndex(function (element) {
  return (
    element[0] === command.replace("--", "") ||
    element[1] === command.replace("-", "")
  );
});
console.log("command received:", commands[commandIndex][0]);


switch (commands[commandIndex][0]) {
  case "serve":
    const module = args[3] == "secure" ? "https" : "http";
    console.log("Using:", module);
    const dir = args[0];
    let server = require(module);
    let port = args.length > 1 ? args[1] : 8080;
    let host = args.length > 1 ? args[2] : "127.0.0.1";
    let opts;
    if (module == "https") {
      opts = {
        key: fs.readFileSync(args[4]),
        cert: fs.readFileSync(args[5]),
      };
    }
    else{
        //add empty strings to args at 4 and 5
        args.splice(4,0,"");
        args.splice(5,0,"");
    }
    server
      .createServer(opts, function (req, res) {
        if (req.url == "/") req.url = "/index.html";
        console.log(`[${req.method}]`, req.url);
        //read file
        const file = dir + req.url.split("?")[0];
        fs.readFile(file, function (err, data) {
          if (err) {
              if(req.url.split("?")[0] == "/routes.json"){
                  res.writeHead(200, {
                      "Content-Type": "application/json",
                  });
                  res.end(JSON.stringify(routes));
              }
            else if (matchUrl(req.url.replace("index.html", ""))) {
              let data = fs.readFileSync("../index.html", "utf8");
              res.writeHead(200, {
                "Content-Type": "text/html",
                "Cache-Control":
                  parseInt(args[6]) == "NaN"
                    ? "no-cache"
                    : `max-age=${args[6]}`,
              });
                res.end(data);
            } else {
              res.writeHead(404);
              res.end("404");
            }
          } else {
            let extname = String(path.extname(file)).toLowerCase();
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

            let contentType = mimeTypes[extname] || "application/octet-stream";
            res.writeHead(200, {
              "Content-Type": contentType,
              "Cache-Control":
                parseInt(args[6]) == "NaN" ? "no-cache" : `max-age=${args[6]}`,
            });
            res.end(data);
          }
        });
      })
      .listen(port, host);
    break;
  case "help":
    console.log("Help!");
    break;
  default:
    console.log("Unknown command!");
}

function matchUrl(realUrl) {
    realUrl = realUrl.split("?")[0];
    let foundRoute = routes.find((templateUrl) => {
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
  