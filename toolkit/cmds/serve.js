cli.command("serve")
    .describe(`Server for ree.js app`)
    .option("-p, --port <port>", "Port to listen on", "3000")
    .action(async(opts) => {
        const app = createApp();

        let route = await import("./cmds/server/index.js");
        route.router(app);

        createServer(app).listen(parseInt(opts.port),() => {
            console.log(`Listening on port ${color(opts.port, "green")}`)
        });
    });