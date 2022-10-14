import { Images }    from './images.js'
import { Animation } from './animation.js'
import { Event }     from './event.js'

export class Setting{
  constructor(options , on , callback){
    this.options  = options
    this.callback = callback
    this.on       = on
    
    this.init()
  }

  finish(){
    if(!this.callback){return}
    this.callback()
  }

  init(){
    this.options.root.setAttribute('data-view-type' , 'image')
    new Images(this.options)
    new Event(this.options , this.on)
    this.options.animation = new Animation(this.options)
    this.finish()
  }

  add_scale_element(){
    const elm = document.createElement('div')
    elm.className = 'scale'
    this.options.root.appendChild(elm)
    this.options.scale = elm
  }
}
