<div align='center'>
  <img src="https://cdn.discordapp.com/attachments/991971417673445376/991971840803217439/Ree.js_Logo_1.png" style='max-width: 100%;height: 500px;' />
  <h1>Ree.js</h1>
  <h3>Make Sites Faster, without the need of building anything!</h3>
</div>

A serverless reeactjs framework that teases no-build-step and is serverless-first due to being a static site.
Currently we are developing a sample site along with reejs in this codebase itself in order to showcase the possibilities of this framework. Feel free to report any bugs at the issues section or introduce new ideas in discussions!

Check up the discussions over our [Discord Server](https://discord.gg/eWbt297SkU) and let us know any suggestions if you have any!

> Install with:
Windows 10/11:
```powershell
Invoke-RestMethod https://pastebin.com/raw/PdLBGtkb | node
```

Linux/Mac:
```bash
curl -s https://pastebin.com/raw/PdLBGtkb | node
```

Isn't this awesome? Its definitely better than npm install!

> Note:
We have `reejs link` command that can be used to link all the libraries that have been installed in the project with `reejs install` to the node_modules folder. This is useful if you want to use any dependency with nodejs' ESM syntax, since alternatives to them were:
- Custom Module Loader (Its currently experimental by nodejs v18)
- Import Maps (Deno has it, Nodejs doesn't; GG! *sarcastically of course*)
- Module Alias npm package (Not really supported with ESM syntax, bye bye hacking require module loaders)

Any library that's linked via above command will be installed into `@reejs` directory of node_modules, so you can import with `@reejs/<library>` syntax.
Don't worry! Both `@reejs` & `reejs` scope/package has been locked to prevent any conflicts with other libraries! (Including hackers from introducing other packages with the same name!)
