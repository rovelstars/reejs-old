cli.command("link")
    .describe(`Link ${color("assets/libs","","blueBrightBg")} folder!`)
    .action(()=>{
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
    });