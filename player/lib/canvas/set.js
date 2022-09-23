import { CanvasEvent } from './event.js'
import { Images }      from './images.js'
import { Animation }   from './animation.js'
import { Scale }       from './scale.js'

export class CanvasSet{
  constructor(options , callback){
    this.options  = options || {}
    this.callback = this.options.callback || null
    this.init()
    // this.view()
  }

  callback(){
    if(!this.callback){return}
    this.callback()
  }

  init(){
    // console.log(this.options)
    this.options.scale = new Scale(this.options)
    this.images        = new Images(this.options , this.image_loaded.bind(this))
    this.animation     = new Animation(this.options)
    this.event         = new CanvasEvent(this.options)
    // console.log(this.images)
  }

  image_loaded(){
    this.view()
  }

  view(){
    this.images.view(this.options)
  }
}
