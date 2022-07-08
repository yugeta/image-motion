import { Options } from '../options.js'
import { Uuid }  from '../common/uuid.js'

export class Upload{
  constructor(file){
    if(!file){return}
    // this.file = file
    const uuid = new Uuid().id
    // if(!Options.datas[this.uuid]){
    //   Options.datas[this.uuid] = {}
    // }
    this.cache = Options.datas.get_data(uuid)
    this.cache.uuid = uuid
    this.cache.file = file
    this.cache.name = Options.common.get_file2name(file.name)
    this.init()
  }

  init(){
		const fileReader  = new FileReader()
    fileReader.onload = this.add_img.bind(this, fileReader)
		fileReader.readAsDataURL(this.cache.file)
    
    Options.lists.add(this.cache.uuid , this.cache.file)
    // this.add_lists(this.file)
    // this.add_layer(this.file)
  }
  
  loaded_img(data , src){
    if(!data){return}
    add_img(data , src)
  }

  add_img(data , src){
    data.uuid = this.cache.uuid
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

    this.cache.pic = pic
    this.cache.img = img
    
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

  set_data(){
    this.cache.src = this.cache.img.getAttribute('src')
    this.cache.x   = this.cache.img.offsetLeft
    this.cache.y   = this.cache.img.offsetTop
    this.cache.w   = this.cache.img.offsetWidth
    this.cache.h   = this.cache.img.offsetHeight
  }

  add_layer(data){
    let layer_area = document.querySelector("[name='layer'] ul")
    let li = document.createElement("li")
    let html = "<span>"+ data.name +"</span>"
    html += "<div class='move'></div>"
    li.innerHTML = html
    li.setAttribute("data-uuid" , this.cache.uuid)
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
    this.set_data()
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