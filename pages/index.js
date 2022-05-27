import { html, Component } from "/reender.js";
import Navbar from "./components/Navbar.js";
import { load, getData, pushData, removeData } from "/router.js";
export default class Index extends Component {
  add() {
    let { num = getData() || 0 } = this.state;
    this.setState({ num: ++num });
    pushData(num);
  }
  subtract() {
    let { num = getData() || 0 } = this.state;
    this.setState({ num: --num });
    pushData(num);
  }
  log() {
    let { num = getData() || 0 } = this.state;
    this.setState({ num: num });
    console.log(num);
    pushData(num);
  }
  clear() {
    removeData();
    this.setState({ num: 0 });
    console.log("Wiped out!");
  }
  render({ data }, { num = getData() || 0 }) {
    return html`<${Navbar} />
      <h1 className="mx-4 dark:text-white text-7xl">
        Welcome To Ree.js
      </h1>
      <p className="mx-8 dark:text-white text-2xl mb-4">
        Featuring no build step and can be ran as serverless or static site server!
        Batteree Powereed Framework that includes everything that you would expect!
        You will soon be able to use in your websites!</p>
      <p className="mx-8 dark:text-white text-2xl mb-2">Helpful tips: (Run this in devtools or via address bar)</p>
      <p className="mx-8 dark:text-white text-2xl mb-2">Clear Cache: <code className="bg-gray-900 rounded-md p-2">ree.clearCache()</code></p>
      <p className="mx-8 dark:text-white text-2xl mb-2">Disable Service Worker: <code className="bg-gray-900 rounded-md p-2">ree.disableSW()</code></p>
      <p className="mx-8 dark:text-white text-2xl mb-2">Enable Service Worker: <code className="bg-gray-900 rounded-md p-2">ree.enableSW()</code></p>
      <p className="mx-8 dark:text-white text-2xl mb-2">Load a custom URL: <code className="bg-gray-900 rounded-md p-2">ree.router.load(url)</code></p>
      <p className="mx-8 dark:text-white text-2xl mb-2">Load ReeBugger (alpha testing): <code className="bg-gray-900 rounded-md p-2">ree.debug()</code></p>
      <p className="mx-8 dark:text-white text-2xl mb-4">Below are some examples of links and button working as links, and a per-page storage example that can be persisted!</p>
      <div
        className="mx-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:mx-56 gap-4"
      >
        <button
          className="btn-blurple"
          onclick=${() => {
            this.add();
          }}
        >
          Add 1
        </button>
        <button
          className="btn-green"
          onclick=${() => {
            this.subtract();
          }}
        >
          Remove 1
        </button>
        <div
          className="btn-red text-center"
          onclick=${() => {
            this.log();
          }}
        >
          Balance: ${num}
        </div>
        <button
          className="btn-green"
          onclick=${() => {
            this.clear();
          }}
        >
          Clear Data
        </button>
        <button
          className="btn-blurple"
          onclick=${() => {
            load("/");
          }}
        >
          Reload Site
        </button>
        <button
          className="btn-red"
          onclick=${() => {
            load("/failure");
          }}
        >
          Goto Failure Management
        </button>
        <button
          className="btn-green"
          onclick=${() => {
            let sus = prompt("Enter a number to be shown on next page");
            load(`/test/${sus}`);
          }}
        >
          Goto Test Page
        </button>
        <button
          className="btn-red"
          onclick=${() => {
            load(`/crash`);
          }}
        >
          Goto Crashing Page
        </button>
        <button className="bg-sky-600 btn-green"
          onclick=${() => {
            load(`/coolpage`);
          }}
        >
          Goto Cool Page
        </button>
      </div>`;
  }
}

export function postLoad(){
  console.log("Sent (Fake) Analytics: Post Load Function ran!");
}
export function _gracefulExit(){
  console.log("Sent (Fake) Analytics: User left the page :(");
}
export async function gracefulExit(){
  let sus = true;
  setTimeout(()=>{sus=false}, 15000);
}