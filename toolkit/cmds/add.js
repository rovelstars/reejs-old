cli.command("install","Add a new library/component to the project",{
    alias: ["i","add"],
})
.option("-f --force", "Reinstall everything even if its already installed", "false")
.action((opts)=>{
    //check for all the files that end with .js.src
    //if same files with extension .js exists, skip
    //if not, copy the file with extension .js.src to .js
    
    let files = fs.readdirSync(`${__dirname}/libs`);
    files = files.filter(f => f.endsWith(".js.src"));
    
    files.forEach(file => {
        const name = file.replace(".js.src","");
        const dest = `${__dirname}/libs/${name}.js`;
        if (!fs.existsSync(dest) || opts.force=="true") {
            //download file and edit it
        }
    });

})