(function(){
  let __options = {
    php : "link.php"
  };

  function MAIN(){
    this.query2id();
    this.set_project_id();
    this.event();
    this.load_data();
    this.load_id();
  }
  MAIN.prototype.query2id = function(){
    let urlinfo = new $$lib("urlinfo");
    if(!urlinfo.query.id){return}
    let elm = this.elm_project_id();
    if(elm){
      elm.value = urlinfo.query.id;
    }
  };
  MAIN.prototype.elm_project_id = function(){
    return document.getElementById("project_id");
  };
  MAIN.prototype.get_project_id = function(){
    let elm = this.elm_project_id();
    if(elm){
      return elm.value;
    }
  };
  MAIN.prototype.set_project_id = function(){
    let id = this.get_project_id();
    if(!id){
      // id = new $$UUID().make();
      id = (+new Date());

      let elm = this.elm_project_id();
      elm.value = id;
      let url = this.set_url_id(id);
      window.history.pushState({}, '', url);
    }
  };
  MAIN.prototype.set_url_id = function(id){
    let urlinfo = new $$lib("urlinfo");
    let querys = [];
    for(let i in urlinfo.query){
      if(i === "id"){continue;}
      querys.push(i +"="+ urlinfo.query[i]);
    }
    querys.push("id="+id);
    return urlinfo.url +"?"+ querys.join("&");
  };

  MAIN.prototype.event = function(){
    document.getElementById("save").addEventListener("click" , this.save.bind(this));

    window.addEventListener("mousedown" , this.event_mousedown.bind(this));
    window.addEventListener("mousemove" , this.event_mousemove.bind(this));
    window.addEventListener("mouseup"   , this.event_mouseup.bind(this));
  };

  MAIN.prototype.set_pic = function(data , uuid , src){
    var pic = document.createElement("div");
    pic.className = "pic";
    if(data){
      pic.setAttribute("data-new" , "1");
    }
    pic.setAttribute("data-uuid" , uuid);
    var area = document.querySelector(".img-canvas");
    var img = new Image("img");
    if(data){
      img.src = data.result;
    }
    else if(src){
      img.src = src;
    }
    img.addEventListener("load" , this.set_image_size.bind(this));
    pic.appendChild(img);
    area.appendChild(pic);

    let ct = document.createElement("div");
    ct.className = "center";
    pic.appendChild(ct);

  };

  MAIN.prototype.set_image_size = function(e){
    var area = document.querySelector(".img-canvas");
    let img = e.target;
    let x = img.naturalWidth;
    let y = img.naturalHeight;
    // 画像が全体的に大きい場合
    if(area.clientWidth < x
    && area.clientHeight < y){
      let rate_x = area.clientWidth  / x;
      let rate_y = area.clientHeight / y;
      // 縦長サイズ
      if(rate_x < rate_y){
        x = x * rate_x;
        y = y * rate_x;
      }
      // 横長サイズ
      else{
        x = x  * rate_y;
        y = y * rate_y;
      }
    }
    // 横幅が表示オーバーの場合
    else if(area.clientWidth < x
    && area.clientHeight >= y){
      let rate = area.clientWidth / x;
      x = area.clientWidth;
      y = y * rate;
    }
    // 縦サイズが表示オーバーの場合
    else if(area.clientWidth >= x
    && area.clientHeight < y){
      let rate = area.clientHeight / y;
      x = x * rate;
      y = area.clientHeight;
    }
    img.parentNode.style.setProperty("width"  , x + "px" , "");
    img.parentNode.style.setProperty("height" , y + "px" , "");
  };
  MAIN.prototype.set_image_from_data = function(uuid , data){
    let pic = this.get_pic(uuid);
    let img = pic.querySelector("img");

    img.parentNode.style.setProperty("left"   , data.x + "px" , "");
    img.parentNode.style.setProperty("top"    , data.y + "px" , "");
    img.parentNode.style.setProperty("width"  , data.w + "px" , "");
    img.parentNode.style.setProperty("height" , data.h + "px" , "");

  };

  MAIN.prototype.add_layer = function(data , uuid){
    let layer_area = document.querySelector(".img-layer .layer-lists");
    let li = document.createElement("div");
    li.className = "layer-list";
    let html = "<span>"+ data.name +"</span>";
    // html += "<div class='move'></div>";
    li.innerHTML = html;
    li.setAttribute("data-uuid" , uuid);
    if(!layer_area.children.length){
      layer_area.appendChild(li);
    }
    else{
      layer_area.insertBefore(li , layer_area.firstChild);
    }
  };


  MAIN.prototype.event_mousedown = function(e){
    if(this.event_mousedown_pic_center(e) === true){return;}
    if(this.event_mousedown_pic(e) === true){return;}
    // if(this.event_mousedown_layer_move(e) === true){return;}
    if(this.event_mousedown_layer(e) === true){return;}
    this.active_off_all();
  };

  MAIN.prototype.event_mousedown_pic_center = function(e){
    let center = new $$lib().upperSelector(e.target , ".pic .center");
    if(!center){return;}
    let pic = new $$lib().upperSelector(center , ".pic");
    // let bounding = pic.getBoundingClientRect();
    this.pic_center = {
      pic      : pic,
      elm      : center,
      uuid     : pic.getAttribute("data-uuid"),
      // x        : center.offsetLeft,
      // y        : center.offsetTop,
      // base_x   : bounding.left,
      // base_y   : bounding.top,
      page_x   : e.pageX,
      page_y   : e.pageY
      // offset_x : pic.offsetLeft,
      // offset_y : pic.offsetTop,
      // max_x    : pic.offsetWidth,
      // max_y    : pic.offsetHeight
    };
    return true;
  };
  MAIN.prototype.event_mousedown_pic = function(e){
    let pic = new $$lib().upperSelector(e.target , ".pic");
    if(!pic){return;}
    this.active_off_all();
    let uuid = pic.getAttribute("data-uuid");
    let bounding = pic.parentNode.getBoundingClientRect();
    this.pic_data = {
      elm      : pic,
      uuid     : uuid,
      x        : pic.offsetLeft,
      y        : pic.offsetTop,
      touch_x  : e.pageX - bounding.left,
      touch_y  : e.pageY - bounding.top,
      offset_x : bounding.left,
      offset_y : bounding.top
    };
    this.active_on(uuid);
    return true;
  };
  // MAIN.prototype.event_mousedown_layer_move = function(e){
  //   let layer_move = new $$lib().upperSelector(e.target , ".img-layer li .move");
  //   if(!layer_move){return;}
  //   let layer = new $$lib().upperSelector(e.target , ".img-layer li");
  //   let uuid = layer.getAttribute("data-uuid");
  //   let area = document.querySelector(".img-layer");
  //   let bounding = area.getBoundingClientRect();
  //   this.data_layer_move = {
  //     elm  : layer_move,
  //     layer : layer,
  //     uuid : uuid,
  //     page_x : e.pageX,
  //     page_y : e.pageY,
  //     y    : layer.offsetTop,
  //     w    : layer.offsetWidth,
  //     h    : layer.offsetHeight,
  //     val  : layer.textContent,
  //     offset_x : 0,
  //     offset_y : e.pageY - layer.offsetTop,
  //     min_y : 0,
  //     max_y : 0 + bounding.height - layer.offsetHeight
  //   };
  //   this.layer_move_on(uuid);
  //   return true;
  // };
  MAIN.prototype.event_mousedown_layer = function(e){
    let layer = new $$lib().upperSelector(e.target , ".img-layer .layer-list");
    if(!layer){return}
    this.active_off_all();
    let uuid = layer.getAttribute("data-uuid");
    this.active_on(uuid);
    return true;
  };


  MAIN.prototype.event_mousemove = function(e){
    if(this.event_mousemove_pic_center(e) === true){return}
    // if(this.event_mousemove_pic_data(e) === true){return}
    // if(this.event_mousemove_layer_move(e) === true){return}
  };
  MAIN.prototype.event_mousemove_pic_center = function(e){
    if(!this.pic_center){return;}
    e.preventDefault();
    let from = {x : this.pic_center.page_x,y : this.pic_center.page_y};
    let to   = {x : e.pageX , y : e.pageY};
    this.draw_line(from,to);
    this.hover_images(e);
    
    return true;
  };

  MAIN.prototype.draw_line = function(fromPos , toPos){
    let canvas = document.querySelector("canvas.line");
    if(!canvas){
      canvas = document.createElement("canvas");
      canvas.className = "line";
      document.body.appendChild(canvas);
    }
    let trans = this.get_canvas_trans(canvas , fromPos , toPos);
    canvas.style.setProperty("top"   , trans.y + "px","");
    canvas.style.setProperty("left"  , trans.x + "px","");
    canvas.width  = trans.w;
    canvas.height = trans.h;

    var w = canvas.width;
    var h = canvas.height;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255,0,0,0.5)";
    ctx.beginPath();
    ctx.lineWidth = 2;
    if(trans.type === "increase"){
      ctx.moveTo(w,0);
      ctx.lineTo(0,h);
    }
    else{
      ctx.moveTo(0,0);
      ctx.lineTo(w,h);
    }
    ctx.stroke();
    // ctx.strokeRect(0, 0, w, h);

  };
  MAIN.prototype.get_canvas_trans = function(canvas , fromPos , toPos){
    let trans = {x:0,y:0,w:0,h:0,type:""};

    // from:左上 , to:右下
    if(fromPos.x <= toPos.x && fromPos.y <= toPos.y){
      trans.x = fromPos.x;
      trans.y = fromPos.y;
      trans.w = toPos.x - fromPos.x;
      trans.h = toPos.y - fromPos.y;
      trans.type = "decrease";
    }
    // from:右下 , to:左上
    else if(fromPos.x >= toPos.x && fromPos.y >= toPos.y){
      trans.x = toPos.x;
      trans.y = toPos.y;
      trans.w = fromPos.x - toPos.x;
      trans.h = fromPos.y - toPos.y;
      trans.type = "decrease";
    }
    // from：左下 , to: 右上
    else if(fromPos.x <= toPos.x && fromPos.y >= toPos.y){
      trans.x = fromPos.x;
      trans.y = toPos.y;
      trans.w = toPos.x   - fromPos.x;
      trans.h = fromPos.y - toPos.y;
      trans.type = "increase";
    }
    // from：右上 , to: 左下
    else if(fromPos.x >= toPos.x && fromPos.y <= toPos.y){
      trans.x = toPos.x;
      trans.y = fromPos.y;
      trans.w = fromPos.x - toPos.x;
      trans.h = toPos.y   - fromPos.y;
      trans.type = "increase";
    }
    
    return trans;
  };

  MAIN.prototype.clear_canvas = function(){
    let canvas = document.querySelector("canvas.line");
    if(!canvas){return}
    canvas.parentNode.removeChild(canvas);
  };

  MAIN.prototype.hover_images = function(e){
    let target = e.target;
    if(!target){return}
    this.un_hover_images();

    let pic = new $$lib().upperSelector(target , ".pic");
    if(!pic){
      // this.un_hover_images();
      if(this.pic_center.linkTarget){
        delete this.pic_center.linkTarget;
      }
      return;
    }
    if(this.pic_center
    && this.pic_center.pic === pic){
      if(this.pic_center.linkTarget){
        delete this.pic_center.linkTarget;
      }
      return;
    }
    // if(this.pic_center
    // && this.pic_center.linkTarget
    // && this.pic_center.linkTarget === pic){return}
    // this.un_hover_images();

// console.log(pic);
    pic.setAttribute("data-link-hover","1");
    this.pic_center.linkTarget = pic;
  };
  MAIN.prototype.un_hover_images = function(e){
    let pics = document.querySelectorAll(".img-canvas .pic");
    if(!pics || !pics.length){return;}
    for(let pic of pics){
      if(pic.hasAttribute("data-link-hover")){
        pic.removeAttribute("data-link-hover")
      }
    }
  };


  // MAIN.prototype.event_mousemove_pic_data = function(e){
  //   if(!this.pic_data){return}
  //   let x = e.pageX - this.pic_data.offset_x - this.pic_data.touch_x + this.pic_data.x;
  //   let y = e.pageY - this.pic_data.offset_y - this.pic_data.touch_y + this.pic_data.y;
  //   x = ~~x;
  //   y = ~~y;
  //   let elm = this.pic_data.elm;
  //   elm.style.setProperty("left" , x + "px" , "");
  //   elm.style.setProperty("top"  , y + "px" , "");
  //   let info_center = document.querySelector(".img-info .pos");
  //   info_center.textContent = "x: "+ x +" px / y: "+ y +" px";

  //   e.preventDefault();
  //   return true;
  // };
  // MAIN.prototype.event_mousemove_layer_move = function(e){
  //   if(!this.data_layer_move){return}
  //   let elm = document.querySelector(".img-layer .layer-moving-float");
  //   let y = e.pageY - this.data_layer_move.offset_y;
  //   if(y < this.data_layer_move.min_y){
  //     y = this.data_layer_move.min_y;
  //   }
  //   else if(y > this.data_layer_move.max_y){
  //     y = this.data_layer_move.max_y;
  //   }
  //   if(elm){
  //     elm.style.setProperty("top" , y + "px" , "");
  //   }
  //   this.layer_over_check(y);
  //   e.preventDefault();
  //   return true;
  // };


  MAIN.prototype.event_mouseup = function(e){

    if(this.pic_center){
      this.set_link();
      this.clear_canvas();
      this.un_hover_images();
      delete this.pic_center;
    }

    if(this.pic_data){
      delete this.pic_data;
    }
    if(this.data_layer_move){
      this.layer_over_sort();
      this.layer_move_off(this.data_layer_move.uuid);
      delete this.data_layer_move;
    }
  };
  MAIN.prototype.set_link = function(){
    if(!this.pic_center.linkTarget){return;}
    // this.pic_center.linkTarget.style.setProperty("border","1px solid red","");
    let child_pic = this.pic_center.pic;
    let child = child_pic.getAttribute("data-uuid");
    let parent_pic = this.pic_center.linkTarget;
    let parent = parent_pic.getAttribute("data-uuid");
    this.link_child2parent(child , parent);
  };

  MAIN.prototype.link_child2parent = function(child , parent){
    let layer_child  = document.querySelector(".img-layer .layer-list[data-uuid='"+ child  +"']");
    let layer_parent = document.querySelector(".img-layer .layer-list[data-uuid='"+ parent +"']");
    if(!layer_child || !layer_parent){return;}
    console.log(layer_parent,layer_child)
    layer_parent.appendChild(layer_child);
    layer_child.setAttribute("data-parent" , parent);
  };




  MAIN.prototype.active_on = function(uuid){
    if(!uuid){return;}
    this.img_active_on(uuid);
    this.layer_active_on(uuid);
    this.view_info(uuid);
  };
  MAIN.prototype.active_off_all = function(){
    let pics  = document.querySelectorAll(".img-canvas .pic");
    for(let i=0; i<pics.length; i++){
      pics[i].setAttribute("data-active" , "0");
    }
    let layers = document.querySelectorAll(".img-layer .layer-list");
    for(let i=0; i<layers.length; i++){
      layers[i].setAttribute("data-active" , "0");
    }
    this.clear_info();
  };
  MAIN.prototype.get_pic = function(uuid){
    return document.querySelector(".img-canvas .pic[data-uuid='"+ uuid +"']");
  };
  MAIN.prototype.img_active_on = function(uuid){
    let target = this.get_pic(uuid);
    if(!target){return;}
    target.setAttribute("data-active" , "1");
  };
  MAIN.prototype.img_active_off = function(uuid){
    let target = this.get_pic(uuid);
    if(!target){return;}
    target.setAttribute("data-active" , "0");
  };
  MAIN.prototype.get_layer = function(uuid){
    return document.querySelector(".img-layer .layer-lists .layer-list[data-uuid='"+ uuid +"']");
  };
  MAIN.prototype.layer_active_on = function(uuid){
    let target = this.get_layer(uuid);
    if(!target){return;}
    target.setAttribute("data-active" , "1");
  };
  MAIN.prototype.layer_active_off = function(uuid){
    let target = this.get_layer(uuid);
    if(!target){return;}
    target.setAttribute("data-active" , "0");
  };
  MAIN.prototype.view_info = function(uuid){
    if(!uuid){return;}
    let html = this.view_info_html(uuid);
    let info = document.querySelector(".img-info");
    // info.innerHTML = html;
    info.insertAdjacentHTML("beforeend" , html);
    info.setAttribute("data-info-view" , "1");
  };
  MAIN.prototype.view_info_html = function(uuid){
    let pic = this.get_pic(uuid);
    if(!pic){return "";}
    let layer = this.get_layer(uuid);
    let img = pic.getElementsByTagName("img")[0];
    let center = pic.querySelector(".center");
    let html = "<table>";
    html += "<tr><th>id</th><td class='uuid'>"+  pic.getAttribute("data-uuid")  +"</td></tr>";
    html += "<tr><th>file</th><td class='name'>"+  layer.textContent  +"</td></tr>";
    html += "<tr><th>pos</th><td class='pos'>x: "+  pic.offsetLeft  +" px / y: "+ pic.offsetTop +" px</td></tr>";
    html += "<tr><th>size</th><td class='size'>x: "+  img.offsetWidth  +" px / y: "+ img.offsetHeight +" px</td></tr>";
    html += "<tr><th>center</th><td class='center'>x: "+  center.offsetLeft  +" px / y: "+ center.offsetTop +" px</td></tr>";
    html += "</table>";
    return html;
  };
  MAIN.prototype.clear_info = function(){
    let info = document.querySelector(".img-info");
    let info_table = info.querySelector("table");
    if(!info_table){return;}
    info_table.parentNode.removeChild(info_table);
    info.setAttribute("data-info-view" , "0");
  };

  MAIN.prototype.layer_move_on = function(uuid){
    let target = this.get_layer(uuid);
    if(!target){return;}
    target.setAttribute("data-moving" , "1");

    if(!this.data_layer_move){return;}
    let div = document.createElement("div");
    div.className = "layer-moving-float";
    div.style.setProperty("width"  , (this.data_layer_move.w * 0.9) + "px" , "");
    div.style.setProperty("height" , (this.data_layer_move.h) + "px" , "");
    div.style.setProperty("left"   , (this.data_layer_move.x) + "px" , "");
    div.style.setProperty("top"    , (this.data_layer_move.y) + "px" , "");
    div.textContent = this.data_layer_move.val;
    let info = document.querySelector(".img-layer");
    info.appendChild(div);
  };
  MAIN.prototype.layer_move_off = function(uuid){
    let target = this.get_layer(uuid);
    if(!target){return;}
    target.setAttribute("data-moving" , "0");
    let elm = document.querySelector(".img-layer .layer-moving-float");
    if(elm){
      elm.parentNode.removeChild(elm);
    }
    let lists = document.querySelectorAll(".img-layer .layer-lists .layer-list");
    for(let i=0; i<lists.length; i++){
      if(lists[i].hasAttribute("data-over")){
        lists[i].removeAttribute("data-over");
      }
    }
  };
  MAIN.prototype.layer_over_check = function(y){
    if(!this.data_layer_move){return;}
    
    let lists = document.querySelectorAll(".img-layer .layer-lists .layer-list");
    if(!lists || !lists.length){return;}

    let direction = null;
    if(this.data_layer_move.y > y){
      direction = "up";
    }
    else{
      direction = "down";
    }

    let num = null;
    for(let i=0; i<lists.length; i++){
      // 対象範囲内
      if(lists[i].offsetTop < y && y < lists[i].offsetTop + lists[i].offsetHeight){
        num = i;
        lists[i].setAttribute("data-over" , direction);
      }
      // 対象外
      else{
        lists[i].setAttribute("data-over" , "0");
      }
    }
    this.data_layer_move.cursor_y = y;
    this.data_layer_move.move_num = num;
    this.data_layer_move.move_direction = direction;
  };
  MAIN.prototype.layer_over_sort = function(){
    if(!this.data_layer_move){return;}
    if(typeof this.data_layer_move.move_num !== "number"){return;}
    let lists = document.querySelectorAll(".img-layer .layer-lists .layer-list");
    let target = null;
    let img_elm = this.get_pic(this.data_layer_move.uuid);
    let img_lists = document.querySelectorAll(".img-canvas .pic");
    let img_num = img_lists.length - this.data_layer_move.move_num;
    switch(this.data_layer_move.move_direction){
      case "up":
        // layer
        target = lists[this.data_layer_move.move_num];
        target.parentNode.insertBefore(this.data_layer_move.layer , target);

        // img
        img_target = img_lists[img_num];
        if(img_target){
          img_elm.parentNode.insertBefore(img_elm , img_target);
        }
        else{
          img_elm.parentNode.appendChild(img_elm);
        }
        
        break;
      case "down":
        // layer
        target = lists[this.data_layer_move.move_num + 1];
        if(target){
          this.data_layer_move.layer.parentNode.insertBefore(this.data_layer_move.layer , target);
        }
        else{
          this.data_layer_move.layer.parentNode.appendChild(this.data_layer_move.layer);
        }

        // img
        img_target = img_lists[img_num - 1];
        img_elm.parentNode.insertBefore(img_elm , img_target);

        break;

      default:
        console.log("no-move.");
        break;
    }
    // this.layer_move_off();
    this.active_off_all();
    this.active_on(this.data_layer_move.uuid);
  };

  // MAIN.prototype.save = function(){
  //   // let lists = document.querySelectorAll(".img-canvas .pic");
  //   // if(!lists || !lists){return;}
  //   // this.img_lists = [];
  //   // this.post_infos = [];
  //   // for(let list of lists){
  //   //   this.img_lists.push(list);
  //   // }
  //   // this.save_img_post();
  //   this.save_info_post();
  // };

  // MAIN.prototype.save_img_post = function(){
  //   if(!this.img_lists || !this.img_lists.length){
  //     if(this.post_infos && this.post_infos.length){
  //       this.save_info_post();
  //     }
  //     return;
  //   }

  //   let pic    = this.img_lists.shift();
  //   let img    = pic.querySelector("img");
  //   let id     = this.get_project_id();
  //   let uuid   = pic.getAttribute("data-uuid");
  //   let layer  = this.get_layer(uuid);
  //   let center = pic.querySelector(".center");
  //   this.post_infos.push({
  //     uuid : uuid,
  //     name : layer.textContent,
  //     x    : pic.offsetLeft,
  //     y    : pic.offsetTop,
  //     w    : pic.clientWidth,
  //     h    : pic.clientHeight,
  //     cx   : center.offsetLeft,
  //     cy   : center.offsetTop
  //   });

  //   if(pic.getAttribute("data-new") !== "1"){
  //     this.save_img_post();
  //     return;
  //   }

  //   new $$ajax({
  //     url : __options.php,
  //     query : {
  //       mode : "save_img",
  //       id   : id,
  //       uuid : uuid,
  //       data : img.getAttribute("src"),
  //       name : layer.textContent
  //     },
  //     onSuccess : (function(res){
  //       this.save_img_post();
  //     }).bind(this)
  //   });
  // };
  
  MAIN.prototype.save = function(){
    // if(!this.post_infos || !this.post_infos.length){return;}
    let datas = this.get_links();
    if(!datas){return;}
    new $$ajax({
      url : __options.php,
      query : {
        mode : "save_link",
        id   : this.get_project_id(),
        data : JSON.stringify(datas)
      },
      onSuccess : (function(res){
        console.log(res);
      }).bind(this)
    });
  };
  MAIN.prototype.get_links = function(){
    let layers = document.querySelectorAll(".img-layer .layer-list");
    if(!layers || !layers.length){return;}
    let datas = [];
    for(let layer of layers){
      let parent = layer.getAttribute("data-parent");
      if(!parent){continue;}
      let data = {
        uuid   : layer.getAttribute("data-uuid"),
        parent : parent
      };
      datas.push(data);
    }
    return datas;
  };


  MAIN.prototype.load_data = function(){
    let id = this.get_project_id();
    new $$ajax({
      url : __options.php,
      query : {
        mode : "load_link",
        id   : id
      },
      onSuccess : (function(id , res){
// console.log(res);
        if(!res){return;}
        let datas = JSON.parse(res);

// console.log(datas);
        if(!datas.images){return;}
        

        for(let data of datas.images){
          let uuid = data.uuid;
          let src = "data/"+ id +"/"+ uuid +"."+ data.ext;
          this.set_pic("" , uuid , src);
          this.set_image_from_data(uuid , data);
          this.add_layer({name : data.name} , uuid);
        }
        if(datas.links && datas.links.length){
          this.set_parents(datas.links);
        }
        
      }).bind(this , id)
    });
  };

  MAIN.prototype.load_id = function(){
    new $$ajax({
      url : __options.php,
      query : {
        mode : "load_id"
      },
      onSuccess : (function(res){
        if(!res){return;}
        let datas = JSON.parse(res);
        if(!datas.lists || !datas.lists.length){return;}
        let urlinfo = new $$lib("urlinfo");
        let current_id = urlinfo.query.id;
        let select = document.querySelector(".select-id");
        if(!select){return;}
        for(let id of datas.lists){
          select.options[select.options.length] = new Option(id , id);
          if(current_id && current_id === id){
            select.options[select.options.length-1].selected = true;
          }
        }
      }).bind(this)
    });
  };

  MAIN.prototype.set_parents = function(data_links){
    for(let link of data_links){
      if(!link.parent){continue;}
      let child  = document.querySelector(".img-layer .layer-list[data-uuid='"+link.uuid+"']");
      let parent = document.querySelector(".img-layer .layer-list[data-uuid='"+link.parent+"']");
      if(!child || !parent){continue;}
      parent.appendChild(child);
      child.setAttribute("data-parent" , link.parent);
    }
  };






  // ==========
  // Ajax
  var $$ajax = function(options){
    if(!options){return}
		var ajax = new $$ajax;
		var httpoj = $$ajax.prototype.createHttpRequest();
		if(!httpoj){return;}
		// open メソッド;
		var option = ajax.setOption(options);
		// 実行
		httpoj.open( option.method , option.url , option.async );
		// type
		httpoj.setRequestHeader('Content-Type', option.type);
		// onload-check
		httpoj.onreadystatechange = function(event_res){// thisは、event_res.targetと同じ
			//readyState値は4で受信完了;
			if (this.readyState==4 && this.status==200){
				//コールバック(既存データも返す)
				option.onSuccess(this.responseText , event_res);
			}
		};
		//query整形
		var data = ajax.setQuery(option);
		//send メソッド
		if(data.length){
			httpoj.send(data.join("&"));
		}
		else{
			httpoj.send();
		}
  };
	$$ajax.prototype.dataOption = {
		url:"",
		query:{},				// same-key Nothing
		querys:[],			// same-key OK
		data:{},				// ETC-data event受渡用
		async:"true",		// [trye:非同期 false:同期]
		method:"POST",	// [POST / GET]
		type:"application/x-www-form-urlencoded", // [text/javascript]...
		onSuccess:function(res){},
		onError:function(res){}
	};
	$$ajax.prototype.option = {};
	$$ajax.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){
      let xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;
      return xhr;
    }
		else{return null}
	};
	$$ajax.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	$$ajax.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.query != "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys != "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
		return data;
	};
	$$ajax.prototype.loadHTML = function(filePath , selector){
		$$ajax({
      url:filePath+"?"+(+new Date()),
      method:"GET",
			async:false,
			data:{
				selector:selector
			},
      async:true,
      onSuccess:function(res){
        var target = document.querySelector(this.data.selector);
				if(!target){return;}

				// resをelementに変換
				var div1 = document.createElement("div");
				var div2 = document.createElement("div");
				div1.innerHTML = res;

				// script抜き出し
				var scripts = div1.getElementsByTagName("script");
				while(scripts.length){
					div2.appendChild(scripts[0]);
				}

				// script以外
				target.innerHTML = "";
				target.appendChild(div1);

				// script
				$$ajax.prototype.orderScript(div2 , target);
      }
    });
	};

	$$ajax.prototype.orderScript = function(tags , target){
		if(!tags.childNodes.length){return;}

		var div = document.createElement("div");
		var newScript = document.createElement("script");
		if(tags.childNodes[0].innerHTML){newScript.innerHTML = tags.childNodes[0].innerHTML;}

		// Attributes
		var attrs = tags.childNodes[0].attributes;
		for(var i=0; i<attrs.length; i++){
			newScript.setAttribute(attrs[i].name , attrs[i].value);
		}

		if(typeof tags.childNodes[0].src === "undefined"){
			target.appendChild(newScript);
			div.appendChild(tags.childNodes[0]);
			$$ajax.prototype.orderScript(tags , target);
		}
		else{
			newScript.onload = function(){
				$$ajax.prototype.orderScript(tags , target);
			};
			target.appendChild(newScript);
			div.appendChild(tags.childNodes[0]);
		}
	};

	$$ajax.prototype.addHTML = function(filePath , selector){
		$$ajax({
      url:filePath+"?"+(+new Date()),
      method:"GET",
			async:false,
			data:{
				selector:selector
			},
      async:true,
      onSuccess:function(res){
        var target = document.querySelector(this.data.selector);
				if(!target){return;}

				// resをelementに変換
				var div1 = document.createElement("div");
				var div2 = document.createElement("div");
				div1.innerHTML = res;

				// script抜き出し
				var scripts = div1.getElementsByTagName("script");
				while(scripts.length){
					div2.appendChild(scripts[0]);
				}

				// script以外
				// target.innerHTML = "";
				target.appendChild(div1);

				// script
				$$ajax.prototype.orderScript(div2 , target);
      }
    });
	};




  // ----------
  // Library
  function $$lib(){
    let mode = "",
        args = [];
    for(let i=0; i<arguments.length; i++){
      if(i===0){
        mode = arguments[i];
      }
      else{
        args.push(arguments[i]);
      }
    }
    if(!mode){return;}
    if(this[mode] === undefined){return;}
    return this[mode].apply({} , args);
  }
  $$lib.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
		if (target.addEventListener){target.addEventListener(mode, func, flg)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };
  $$lib.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
		//URLとクエリ分離分解;
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		//基本情報取得;
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2]
    , protocol : sp[0].replace(":","")
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv.slice(1).join("=");
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };
  $$lib.prototype.pathinfo = function(p){
		var basename="",
		    dirname=[],
				filename=[],
				ext="";
		var p2 = p.split("?");
		var urls = p2[0].split("/");
		for(var i=0; i<urls.length-1; i++){
			dirname.push(urls[i]);
		}
		basename = urls[urls.length-1];
		var basenames = basename.split(".");
		for(var i=0;i<basenames.length-1;i++){
			filename.push(basenames[i]);
		}
		ext = basenames[basenames.length-1];
		return {
			"hostname":urls[2],
			"basename":basename,
			"dirname":dirname.join("/"),
			"filename":filename.join("."),
			"extension":ext,
      "query":(p2[1])?p2[1]:"",
      "path":p2[0]
    };
  };

  $$lib.prototype.upperSelector = function(elm , selectors) {
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }

  //指定したエレメントの座標を取得
	$$lib.prototype.pos = function(e,t){

		//エレメント確認処理
		if(!e){return null;}

		//途中指定のエレメントチェック（指定がない場合はbody）
		if(typeof(t)=='undefined' || t==null){
			t = document.body;
		}

		//デフォルト座標
		var pos={x:0,y:0};
		do{
			//指定エレメントでストップする。
			if(e == t){break}

			//対象エレメントが存在しない場合はその辞典で終了
			if(typeof(e)=='undefined' || e==null){return pos;}

			//座標を足し込む
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
		}

		//上位エレメントを参照する
		while(e = e.offsetParent);

		//最終座標を返す
		return pos;
  };


  switch(document.readyState){
    case "complete" : new MAIN();break;
    default : window.addEventListener("load" , function(){new MAIN()});break;
  }
})()