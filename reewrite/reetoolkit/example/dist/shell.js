window.ree = {};
import twgen from "https://ree.js.org/twgen.js";
let router = await import("https://ree.js.org/router.js");
//import "/device.js";

let ReeLoaded = false;
window.ree.router = router;
window.ree.debug = async function () {
  window.ree.debugger = await import("/Debugger.js");
};
window.ree.routerData = {
  currentPageUrl: undefined,
  currentPageJsx: undefined,
  currentPageData: undefined,
};
window.sus = false;
window.twgen = twgen;

twgen.addClasses([
  {
    className: "mask-squircle",
    value:
      "mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCiAgPHBhdGggZD0iTSAxMDAgMCBDIDIwIDAgMCAyMCAwIDEwMCBDIDAgMTgwIDIwIDIwMCAxMDAgMjAwIEMgMTgwIDIwMCAyMDAgMTgwIDIwMCAxMDAgQyAyMDAgMjAgMTgwIDAgMTAwIDAgWiIvPgoKPC9zdmc+);",
  },
  {
    className: "btn-blurple",
    value: "rounded-md bg-indigo-600 text-white p-2",
  },
  { className: "btn-green", value: "rounded-md bg-green-600 text-white p-2" },
  { className: "btn-red", value: "rounded-md bg-red-500 text-white p-2" },
]);

//router.registerPreloader("/src/pages/components/Loader.js");
router.registerPostRender(() => {
  twgen.liveSetup();
});
let routes = await fetch(window.location.host.startsWith("127.0.0.1")?"/src/routes.json":"https://cdn.jsdelivr.net/gh/rovelstars/reejs/retool/routes.json").then((res) => res.json());

router.registerRoutes(routes);

let shouldSW = localStorage.getItem("shouldSW") || "true";

window.ree.enableSW = function () {
  localStorage.setItem("shouldSW", "true");
  shouldSW = "true";
  console.log("Enabled SW!");
  setTimeout(() => {
    //reload the site
    location.reload();
  }, 3000);
};

window.ree.disableSW = function () {
  localStorage.setItem("shouldSW", "false");
  shouldSW = "false";
  caches
    .keys()
    .then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))));
  console.log("Disabled SW!");
  setTimeout(() => {
    //reload the site
    location.reload();
  }, 3000);
};

window.ree.clearCache = async function () {
  caches.keys().then((keylist) => { Promise.all(keylist.map((key) => caches.delete(key))); });
  console.log("Cleared Cache!");
  setTimeout(()=>{
    location.reload();
  }, 3000);
}

window.ree.Reeload

async function initLoad() {
  if (!ReeLoaded) {
    ReeLoaded = true;
    document.getElementById("app-not-loaded-msg").innerText = "Starting App!";
    await import("/dist/libs/tw.js?plugins=forms,typography,aspect-ratio,line-clamp");
    await import("/dist/libs/twcfg.js");
    document.getElementById("app").innerHTML = "";
    await router.load(location.pathname + location.search);
    if (shouldSW === "true") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/dist/sw.js")
          .then(function (reg) {
            console.log("Registration successful, scope is:", reg.scope);
          })
          .catch(function (error) {
            console.log("Service worker registration failed, error:", error);
          });
        //wait for service worker to be ready
        navigator.serviceWorker.ready.then(function (reg) {
          console.log("I feel like sw is ready!", reg);
          reg.active.postMessage({ type: "ROUTES_REGISTER", routes });
        });
        navigator.serviceWorker.addEventListener("message", (e) => {
          if (e.data.type === "WTFM") {
            console.log("[WTFM] Routes registered!");
          }
          if (e.data.type === "LOAD_ROUTE") {
            router.load(e.data.url,undefined,undefined,true);
          }
        });
      }
    } else {
      console.log("Skipped SW installation!");
    }
  }
}
initLoad();