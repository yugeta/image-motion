import { Options } from '../options.js'
import { Uuid }  from '../common/uuid.js'

export class Upload{
  constructor(file){
    if(!file){return}
    this.file = file
    this.uuid = new Uuid().id
    if(!Options.datas[this.uuid]){
      Options.datas[this.uuid] = {}
    }
    this.init()
    
  }

  init(){
		const fileReader  = new FileReader()
    fileReader.onload = this.add_img.bind(this, fileReader)
		fileReader.readAsDataURL(this.file)
    
    Options.lists.add(this.uuid , this.file)
    // this.add_lists(this.file)
    // this.add_layer(this.file)
  }

  
  
  loaded_img(data , src){
    if(!data){return}
    add_img(data , src)
  }
  add_img(data , src){
    data.uuid = this.uuid
    var area = Options.images.get_area_view()
    let template = Options.common.get_template('image_pic')
    data.src = data.result || src
    template = Options.common.doubleBlancketConvert(template , data)
    area.insertAdjacentHTML('beforeend' , template)
    const pic = area.querySelector(`[data-uuid='${data.uuid}']`)
    const img = pic.querySelector(`img`)
    if(!img){return}
    img.onload = this.loaded_src.bind(this)
    img.src    = img.getAttribute('data-src')
    img.removeAttribute('data-src')

    Options.datas[this.uuid].pic = pic
    // const pic = area.querySelector(`[data-uuid='${data.uuid}']`)
    // if(!pic){return}

    // const pic     = document.createElement("div")
    // pic.className = 'pic'
    // pic.setAttribute("data-new"  , "1")
    // pic.setAttribute("data-uuid" , this.uuid)
    // 

    // var img = new Image()
    // if(data){
    //   img.src = data.result
    // }
    // else if(src){
    //   img.src = src
    // }

    // img.addEventListener("load" , this.set_image_size.bind(this))
    // pic.appendChild(img)
    // area.appendChild(pic)


    // // add-point
    // let tl = document.createElement("div")
    // tl.className = "top-left"
    // // pic.appendChild(tl);

    // let br = document.createElement("div")
    // br.className = "bottom-right"
    // // pic.appendChild(br);

    // let ct = document.createElement("div")
    // ct.className = "center"
    // pic.appendChild(ct)

  }
  add_layer(data){
    let layer_area = document.querySelector("[name='layer'] ul")
    let li = document.createElement("li")
    let html = "<span>"+ data.name +"</span>"
    html += "<div class='move'></div>"
    li.innerHTML = html
    li.setAttribute("data-uuid" , this.uuid)
    if(!layer_area.children.length){
      layer_area.appendChild(li)
    }
    else{
      layer_area.insertBefore(li , layer_area.firstChild)
    }
  }

  loaded_src(e){
    const img = e.target
    this.set_image_size(img)
    this.set_image_pos(img)
  }

  set_image_pos(img){

  }
  set_image_size(img){
    // var area = this.get_area()
    // let img = e.target
    let w = img.naturalWidth
    let h = img.naturalHeight
    // // 画像が全体的に大きい場合
    // if(area.clientWidth < x
    // && area.clientHeight < y){
    //   let rate_x = area.clientWidth  / x
    //   let rate_y = area.clientHeight / y
    //   // 縦長サイズ
    //   if(rate_x < rate_y){
    //     x = x * rate_x
    //     y = y * rate_x
    //   }
    //   // 横長サイズ
    //   else{
    //     x = x  * rate_y
    //     y = y * rate_y
    //   }
    // }
    // // 横幅が表示オーバーの場合
    // else if(area.clientWidth < x
    // && area.clientHeight >= y){
    //   let rate = area.clientWidth / x
    //   x = area.clientWidth
    //   y = y * rate
    // }
    // // 縦サイズが表示オーバーの場合
    // else if(area.clientWidth >= x
    // && area.clientHeight < y){
    //   let rate = area.clientHeight / y
    //   x = x * rate
    //   y = area.clientHeight
    // }
    // img.parentNode.style.setProperty("width"  , w + "px" , "")
    // img.parentNode.style.setProperty("height" , y + "px" , "")
    
  }
}