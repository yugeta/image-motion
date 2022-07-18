import { Ajax } from './ajax.js'

const setting = {
  service_name : 'image-motion',
}

export class Main{
  constructor(options){
    this.service_name = setting.service_name
    const datas = this.init(options)
    if(!datas){return}
    for(let i in datas){
      this[i] = datas[i]
    }
    if(this.file){
      this.load_data()
    }
    if(this.data){
      this.setting_data()
    }
  }

  init(options){
    if(!options){return}
    if(!options.file && !options.data){return}
    if(!options.target){return}
    const elm = document.querySelector(options.target)
    if(!elm){return}
    elm.setAttribute('data-name' , options.name)
    const datas = {}
    for(let i in options){
      datas[i] = options[i]
    }
    datas.elm = elm
    this.set_target_element(elm)
    return datas
  }
  
  set_target_element(elm){
    this.scale = document.createElement('div')
    this.scale.className = 'scale'
    elm.appendChild(this.scale)
    elm.setAttribute('data-service' , this.service_name)
  }
  
  // load : json-data
  load_data(){
    new Ajax({
      url : this.file,
      method : 'get',
      callback : (e =>{
        const json = e.target.response
        const data = JSON.parse(json)
        this.data = data
        this.setting_data()
      }).bind(this) 
    })
  }
  
  setting_data(){
    this.set_animation()
    this.view_image()
  }
  
  view_image(){
    for(let image of this.data.images){
      const img = new Image()
      img.onload = this.loaded_image.bind(this)
      img.src = image.src
      this.pic = document.createElement('div')
      this.pic.className = 'pic'
      this.pic.setAttribute('data-uuid' , image.uuid)
      this.pic.appendChild(img)
      this.set_image(this.pic , image)
      const parent = this.get_parent(image)
      parent.appendChild(this.pic)
    }
  }
  get_parent(data){
    if(data.parent){
      return this.elm.querySelector(`.pic[data-uuid='${data.parent}']`)
    }
    else{
      return this.scale
    }
  }
  set_image(img , data){
    img.style.setProperty('top'     , `${data.y}px`,'')
    img.style.setProperty('left'    , `${data.x}px`,'')
    img.style.setProperty('width'   , `${data.w}px`,'')
    img.style.setProperty('height'  , `${data.h}px`,'')
    if(data.order){
      img.style.setProperty('z-index' , `${data.order}`,'')
    }
    img.style.setProperty('transform-origin', `${data.cx}px ${data.cy}px`,'')
  }
  
  loaded_image(e){
    const img = e.target
  
  }
  
  set_animation(){
    if(!this.data.animations){return}
    this.style = this.style || this.set_style()
    for(let key in this.data.animations){
      for(let uuid in this.data.animations[key].items){
        const css = this.get_css(key , uuid , this.data.animations[key] , this.data.animations[key].items[uuid].keyframes)
        this.style.textContent += css
      }
    }
  }
  set_style(){
    const check = document.querySelector(`style[data-service='${setting.service_name}']`)
    if(check){return}
    const style = document.createElement('style')
    style.setAttribute('type' , 'text/css')
    style.setAttribute('data-service' , setting.service_name)
    document.querySelector('head').appendChild(style)
    return style
  }
  get_css(key , uuid , data , keyframes){
    const name      = this.name +'_'+ key +'_'+ uuid
    const timing    = data.timing    || 'ease-in-out'
    const duration  = data.duration  || 1
    const count     = data.count     || 'infinite'
    const direction = data.direction || 'normal'
    let css = ''
    css += `[data-service='${setting.service_name}'][data-name='${this.name}'][data-action='${key}'] .pic[data-uuid='${uuid}']{`+"\n"
    css += `animation-name : ${name};`+"\n"
    css += `animation-timing-function: ${timing};`+"\n"
    css += `animation-duration : ${duration}s;`+"\n"
    css += `animation-iteration-count : ${count};`+"\n"
    css += `animation-direction: ${direction};`+"\n"
    css += '}'+"\n"
    const keyframe = this.get_keyframes(keyframes);
    css += `@keyframes ${name}{`+"\n"
    css += keyframe
    css += `}`+"\n"

    return css
  }
  get_keyframes(keyframes){
    let css = ''
    for(let i in keyframes){
      css += `${i}%{`+"\n"
      css += this.get_transform(keyframes[i])+"\n"
      css += '}'+"\n"
    }
    return css
  }
  get_transform(transform_data){
    let datas = []
    if(transform_data.rotate){
      datas.push(`rotate(${transform_data.rotate}deg)`)
    }
    if(transform_data.posx){
      datas.push(`translateX(${transform_data.posx}px)`)
    }
    if(transform_data.posy){
      datas.push(`translateY(${transform_data.posy}px)`)
    }
    return 'transform :'+ datas.join(' ')+';'
  }
}





