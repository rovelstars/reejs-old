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
^ Installs reejs to the current folder

```sh
./reejs get
```
^ Updates/Installs libraries used in the codebase

```sh
./reejs init
```
^ Generates project structure for reejs