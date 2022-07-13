cli.command("init")
    .option("-n --name", "name of the project", "reejs-app")
    .option("-u --url", "url of the project", "https://github.com/rovelstars/create-reejs-app")
    .describe(`Initialize a new project`)
    .action((opts) => {
        //check if git is installed
        exec("git --version", (err, stdout, stderr) => {
            if (err) {
                console.log(color("Git is not installed", "red"));
                return process.exit(1);
            }
            //clone the repo
            console.log(`Cloning the ${opts.url == "https://github.com/rovelstars/create-reejs-app" ? "default" : "specified"} repo to ${color(opts.name, "", "greenBg")}`);
            exec(`git clone ${opts.url} ${opts.name}`, (err) => {
                if (err) {
                    console.log(color("Error cloning the repo, maybe check whether the folder with name " + color(opts.name, "", "redBg"), "red"), color("exists", "red"));
                    return process.exit(1);
                }
                //change to the new folder
                process.chdir(opts.name);
                //delete the .git folder
                exec("rm -rf .git", (err) => {
                    if (err) {
                        console.log(color("Error deleting the .git folder", "red"));
                        return process.exit(1);
                    }
                    console.log(color(`Project ${color(opts.name, "", "greenBg")} created!`, "green", "greenBg"));
                    console.log("To get started, run the following ", "`" + color(`cd ${opts.name} && reejs serve`, "", "blackBrightBg") + "`", " command");
                });
            });
        });
    })