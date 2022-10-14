import { Transform } from '../animation/transform.js'
import { Shape } from '../animation/shape.js'
import { Sound } from '../animation/sound.js'


export class Animation{
  constructor(options){
    if(!options || !options.data || !options.data.animations){return}
    this.options = options
    this.animation_names = this.get_animation_names()
    this.set_transform()
    this.set_shape()
    this.set_sound()
  }

  // animation-nameの一覧を取得
  get_animation_names(){
    const animations = this.options.data.animations
    return Object.keys(animations)
  }

  set_transform(){
    this.options.transform_data = new Transform(this.options)
  }

  set_shape(){
    this.options.shape_data = new Shape(this.options)
  }

  set_sound(){
    this.options.sound_data = new Sound(this.options)
  }
}