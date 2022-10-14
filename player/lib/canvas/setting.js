import { Scale }      from './scale.js'
import { LoadImages } from './load_images.js'
import { Animation }  from './animation.js'
import { Sound }      from './sound.js'
import { Datas }      from './datas.js'
import { Shape }      from './shape.js'
import { Event }      from './event.js'
import { View }       from './view.js'
// import { Gap }        from './gap.js'

export class Setting{
  constructor(options , on , callback){
    this.options  = options || {}
    // console.log(this.options.callback)
    // this.callback = this.options.callback || null
    this.callback = callback
    this.on       = on
    this.init()
  }

  finish(){
    if(!this.callback){return}
    this.callback()
  }

  init(){
    this.options.scale      = new Scale(this.options)
    this.images             = new LoadImages(this.options , this.image_loaded.bind(this))
    // this.canvas             = this.images.canvas
    // this.ctx                = this.images.ctx
    // this.options.sound_data = new Sound(this.options)
    // new Datas(this.options)
    // new Shape(this.options)
  }

  image_loaded(){
    this.animation = new Animation(this.options)
    this.event     = new Event(this.options , this.on)
    // this.gap    = new Gap(this.options)
    // this.gap       = this.get_gap()
    // this.images.set_canvas_size(this.gap) // gap余白をbase-canvasにセットする
    this.view(this , '' , 0)
    this.finish()
  }

  get_gap(){
    if(animation_name && this.options.data.animations[animation_name].gap){
      return this.options.data.animations[animation_name].gap
    }
    else{
      return {min:{x:0,y:0},max:{x:0,y:0}}
      // return this.setting.gap
    }
  //   return {
  //     min : {x : 0, y : 0}, max : {x : 0, y : 0}
  //     // min : {
  //     //   x : -this.options.scale.fit.width  / 2,
  //     //   y : -this.options.scale.fit.height / 2,
  //     // },
  //     // max : {
  //     //   x : this.options.scale.fit.width  / 2,
  //     //   y : this.options.scale.fit.height / 2,
  //     // }
  //   }
  }

  view(animation_name='' , keyframe=0){
    return new View(this.options,{
      animation_name : typeof animation_name === 'string' ? animation_name : '',
      keyframe       : keyframe,
      canvas         : this.images.canvas,
      ctx            : this.images.ctx,
      // gap            : this.gap,
    })
  }


}
