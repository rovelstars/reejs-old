let path = await import("/pathToRegexp.js");
import { render } from "/reender.js";
let data;
let initHead;
let currentHead;
export async function load(url = "/", config = {
    scrolling: true,
    popped: false,
    updateHead: true,
    init: false
}) {
  if (config.init) {
    //make a new element with id __reejs_data and append it to the end of body
    if (!data) {
      data = document.createElement("div");
      data.id = "__reejs_data";
      data.style.display = "none";
      document.body.appendChild(data);
      let t = document.createElement("div");
      t.id = "__reejs_temp_render";
      data.appendChild(t);
    }
  }
  if(ree.cfg("render")=="csr"){
  await render(url);
  }
  if(!$(`#${ree.opts.app} .head`)) config.updateHead = false; // if head is not found, don't update it
  if (config.updateHead && config.init && !initHead) {
    initHead = $(".head");
    let temp = document.createElement("div");
    temp.id = "__reejs_head";
    $("#__reejs_data").appendChild(temp);
    temp.innerHTML = initHead.innerHTML;

    temp = document.createElement("div");
    temp.id = "__reejs_dupe_head";
    $("#__reejs_data").appendChild(temp);
    initHead = $("#__reejs_dupe_head");
  }
  if (config.updateHead) {
    $("#__reejs_dupe_head").innerHTML = $("#__reejs_head").innerHTML;
    currentHead = $$(`#${ree.opts.app} .head`);
    let keys = $$(`#${ree.opts.app} .head [key]`);
    keys = Array.prototype.slice.call(keys, 0);
    let values = keys.map((key) => key.getAttribute("key"));
    values = Array.from(new Set(values));
    for (let i = 0; i < values.length; i++) {
      let tempEl = $(`#${ree.opts.app} .head [key=${values[i]}]`);
      tempEl.remove();
    }
    //join all the currentHead elements together
    let totalHead = "";
    for (let i = 0; i < currentHead.length; i++) {
      totalHead = currentHead[i].innerHTML + totalHead;
    }
    if (currentHead) {
      //find all the key paramters in currentHead
      let keys = $$(`#${ree.opts.app} .head [key]`);
      keys.forEach((el) => {
        let key = el.getAttribute("key");
        //delete the element from initHead if it exists
        let initEl = initHead.querySelectorAll(`[key="${key}"]`);
        if (initEl) {
          initEl.forEach((e) => {
            e.remove();
          });
        }
      });
      $("head").innerHTML = totalHead + initHead.innerHTML;
      $$(`#${ree.opts.app} .head`).forEach(e=>{e.remove()});
    } else {
      $("head").innerHTML = initHead;
    }
  }
}
