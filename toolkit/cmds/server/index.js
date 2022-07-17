import { createServer } from 'http';
import { createApp, send } from 'h3'
import color from '@reejs/colors'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createApp();
let import_maps = fs.readFileSync(`${process.cwd()}/import-maps.json`, "utf8");
let mimes = fs.readFileSync(`${__dirname}/mime.json`, "utf8");
mimes = JSON.parse(mimes);

//serve the static files
app.use((req,res,next)=>{console.log(`[GET] ${req.url}`);next()});
app.use(RenderHTML);
app.use(ServeStatic);
app.use((req,res)=>{send(res, "404")});

function RenderHTML(req,res,next){
    if(req.url=="/" || req.url=="/index.html"){
    return send(res, `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="importmap">
            ${import_maps}
        </script>
    </head>
    <body class="min-h-screen bg-purple-800">
    <div id="app"></div>
    <script src="https://cdn.skypack.dev/-/twind@v0.16.17-je93RqjPGfVdZEy8P06H/dist=es2019,mode=imports/optimized/twind/shim.js" type="module"></script>
    <script type="module">import("shell").then(()=>{ree.init({ app: "app", env: "dev", render: "react" })});</script>
    </body>
    </html>`);
    }
    else next();
}

function ServeStatic(req, res,next){
    const file = process.cwd() + req.url.split("?")[0];
    if(fs.existsSync(file)){
        //generate mime type without using any modules
        const mime = file.split(".").pop();
        const mime_type = mimes[mime] || `text/text`;
        res.setHeader("Content-Type", mime_type);
        return send(res, fs.readFileSync(file));
    }
    else next();
}

createServer(app).listen(parseInt("3000"), () => {
    console.log(`[INFO] Listening on port ${color("3000", "green")}`)
});
