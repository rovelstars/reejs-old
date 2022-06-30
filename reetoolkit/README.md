ReeToolkit Idea:

- User should be able to directly install reejs to their codebase via one script line. That's it. No npm like or any other language's package managers, please!
- One command to update them all!
- One command to generate project structures for reejs.
- Support for adding third party libraries?

Examples: (hopefully?)

```sh
curl -s -L https://ree.js.org/download/reetoolkit | bash
```
^ Downloads ReeToolkit to `./reejs`

```sh
./reejs install
```
^ Installs required files for reejs to the current folder

```sh
./reejs get
```
^ Updates/Installs libraries used in the codebase

```sh
./reejs init
```
^ Generates project structure for reejs


## Usage (For illustration purposes:)

index.js

```js
import ree from 'reejs';
import react from "reender/react"; //vue, svelte available soon too!
import pages from 'reejs/pages';
import tw from 'libs/tw';

//allows you to link reejs to call globally
ree.applyToGlobal(window);

//link react to reejs
ree.initRender(react);

//now you can start customizing reejs on your website!
ree.registerPages(pages);
ree.cssProvider(tw); //or twind
```

## Example of using genScripts (for illustration purposes:)

```js
genScripts({
  "reejs": "https://ree.js.org/download/reetoolkit",
  "react": "https://unpkg.com/reender/react",
  "tw": "https://unpkg.com/twind",
  "pages": "https://unpkg.com/reejs/pages"
});
```

Full example:

```html
<html>
  <head>
    <title>Reejs</title>
    <script src="/dist/shell.js"></script>
    <script>
      genScripts({
        "reejs": "https://ree.js.org/download/reetoolkit",
        "react": "https://unpkg.com/reender/react",
        "tw": "https://unpkg.com/twind",
        "pages": "https://unpkg.com/reejs/pages"
      });
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```