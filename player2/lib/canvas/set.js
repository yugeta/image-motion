import { CanvasEvent } from './event.js'
import { Images }      from './images.js'
import { Animation }   from './animation.js'
import { Scale }       from './scale.js'

export class CanvasSet{
  constructor(options , on){
    this.options  = options || {}
    this.callback = this.options.callback || null
    this.on       = on
    this.init()
    // this.view()
  }

  callback(){
    if(!this.callback){return}
    this.callback()
  }

  init(){
    this.options.scale = new Scale(this.options)
    this.images        = new Images(this.options , this.image_loaded.bind(this))
    this.animation     = new Animation(this.options)
    this.event         = new CanvasEvent(this.options , this.on)
  }

  image_loaded(){
    this.view()
  }

  view(){
    this.images.view(this.options)
  }
}
