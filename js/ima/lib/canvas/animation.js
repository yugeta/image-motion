// import { Datas } from './datas.js'
// import { Shape } from './shape.js'
// import { Sound } from '../animation/sound.js'
import { Transform }  from './transform.js'
import { Gap }        from './gap.js'
// import { SortImages }     from './sort_images.js'

export class Animation{
  constructor(options){
    this.options = options || {}
    this.options.data.transform_animation = this.options.data.transform_animation || {}
    this.options.data.gap = {}
    // this.options.data.sort_images = this.options.data.sort_images || {}
    this.set_animations()
    // this.options.sort_images = this.get_sort_images()
  }

  // アニメーション一覧
  get datas(){
    return this.options.data.animations
  }

  // animation-nameの一覧を取得
  get names(){
    const animations = this.datas
    return Object.keys(animations)
  }
  get animation_names(){
    return this.names
  }
  get frame(){
    return {
      start : 0,
      end   : 100,
    }
  }
  
  set_animations(){
    if(!this.datas || !this.names.length){return}
    for(let name in this.datas){
      // this.options.data.gap[name] = {min:{x:0,y:0},max:{x:0,y:0}}
      const data = this.datas[name]
      this.options.data.transform_animation[name] = {}
      for(let i=this.frame.start; i<=this.frame.end; i++){
        this.options.data.transform_animation[name][i] = this.set_images(name , i)
      }
      // this.options.data.gap[name] = new Gap(this.options , name)
      this.options.data.animations[name].gap = new Gap(this.options , name)
    }
  }

  set_images(animation_name , keyframe){
    animation_name = animation_name || ''
    const images = this.options.data.images
    const res = {}
    for(let image of images){
      const uuid = image.uuid
      res[uuid] = new Transform(
        this.options,
        image.uuid,
        animation_name,
        keyframe,
      )
    }
    return res
  }

  // get_sort_images(animation_name='' , keyframe=0){
  //   const res = new SortImages(this.options , animation_name , keyframe)
  //   return res.datas
  // }




}