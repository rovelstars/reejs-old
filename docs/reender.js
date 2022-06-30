let renderType = ree.opts.render;
let lib = await import(`/ree.${renderType}.js`);

export async function render(url,config){
    url = url.slice(1);
    if(url==""){
        url="home";
    }

if(renderType=="react"){
    let page = await import(`/pages/${url}.js`);
    function decodeHTMLEntities(text) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
      }
    lib.render(
        lib.html`<${page.default} ${config?.data?`data=${config.data}`:""} />`,
        document.getElementById("__reejs_temp_render")
      );
      let headEl = $$("#__reejs_temp_render head");
      headEl.forEach((el)=>{
        let th = document.createElement("div");
        th.classList.add("head");
        th.innerHTML = el.innerHTML;
        $("#__reejs_temp_render").appendChild(th);
        el.remove();
      });
      let html = $("#__reejs_temp_render").innerHTML;
      html = decodeHTMLEntities(html);
        $(`${config?.loader?"#loader":`#${ree.opts.app}`}`).innerHTML = html;
        $("#__reejs_temp_render").remove();
}
}
