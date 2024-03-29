import { SortImages }     from './sort_images.js'

export class View{
  constructor(options , setting){
    this.options        = options || {}
    this.setting        = setting
    this.animation_name = setting.animation_name
    this.keyframe       = setting.keyframe
    this.canvas         = setting.canvas
    this.ctx            = setting.ctx
    this.gap            = this.get_gap_data(this.animation_name)
    this.options.canvas.images.set_canvas_size(this.gap)

    this.view(this.animation_name , this.keyframe)
  }

  get_gap_data(animation_name){
    if(animation_name && this.options.data.animations[animation_name].gap){
      return this.options.data.animations[animation_name].gap
    }
    else{
      return {min:{x:0,y:0},max:{x:0,y:0}}
      // return this.setting.gap
    }
  }

  get_transform(animation_name , keyframe){
    if(animation_name){
      return this.options.data.transform_animation[animation_name][keyframe]
    }
    else{
      return this.options.data.transform_default
    }
  }

  get_images(animation_name , keyframe){
    return new SortImages(this.options , animation_name , keyframe).datas
  }

  // ----------
  // 画像一式セットで表示

  view(animation_name , keyframe){
    // this.gap = this.get_gap_data(animation_name)

    animation_name = typeof animation_name === 'string' ? animation_name : ''
    this.canvas_clear()
    const transform = this.get_transform(animation_name , keyframe)
    const images = this.get_images(animation_name , keyframe)
    for(let image of images){
      const uuid = image.uuid
      if(transform[uuid].shape.is === true){
        const shape = transform[uuid].shape
        const shape_data = this.get_shape_image(shape , uuid)
        const shape_gap = shape_data.gap ||{min:{x:0,y:0},max:{x:0,y:0}}
        // const shape_gap = shape_data.gap || this.gap || {min:{x:0,y:0},max:{x:0,y:0}}
        this.view_image({
          image   : shape_data.image || transform[uuid].image,
          rotate  : transform[uuid].rotate,
          scale   : transform[uuid].scale,
          opacity : transform[uuid].opacity,
          x       : transform[uuid].x  + shape_gap.min.x - this.gap.min.x,
          y       : transform[uuid].y  + shape_gap.min.y - this.gap.min.y,
          w       : transform[uuid].w  - shape_gap.min.x + shape_gap.max.x,
          h       : transform[uuid].h  - shape_gap.min.y + shape_gap.max.y,
          left    : transform[uuid].ox,
          top     : transform[uuid].oy,
          gap     : shape_gap,
        })
      }
      else{
        this.view_image({
          image   : transform[uuid].image,
          rotate  : transform[uuid].rotate,
          scale   : transform[uuid].scale,
          opacity : transform[uuid].opacity,
          x       : transform[uuid].x - this.gap.min.x,
          y       : transform[uuid].y - this.gap.min.y,
          w       : transform[uuid].w,
          h       : transform[uuid].h,
          left    : transform[uuid].ox,
          top     : transform[uuid].oy,
          gap     : {min:{x:0,y:0},max:{x:0,y:0}},
        })
      }
    }
  }

  get_shape_image(shape , uuid){
    if(shape.image_link !== undefined){
      const transform = this.get_transform(this.animation_name , shape.image_link)
      return transform[uuid].shape
    }
    else{
      return shape
    }
  }

  // 画面を描き替えるためのflash処理
  canvas_clear(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  view_image(data){
    if(!data.image){return}
    if(!data.scale){return}

    const base_gap = this.options.canvas.gap || {min:{x:0,y:0},max:{x:0,y:0}}
    // const base_gap = this.options.canvas.gap || {min:{x:0,y:0},max:{x:0,y:0}}
    // console.log(JSON.stringify(base_gap))
    const offset = {
      x : this.options.scale.fit.left,
      y : this.options.scale.fit.top,
    }
    const translate = {
      x : (data.x || 0) - (offset.x || 0) - (base_gap.min.x || 0),
      y : (data.y || 0) - (offset.y || 0) - (base_gap.min.y || 0),
    }
    const rotate = data.rotate
    this.ctx.globalAlpha = data.opacity;
    this.ctx.translate(translate.x , translate.y)

    // センターポイントずらし用処理
    this.ctx.translate(-data.gap.min.x , -data.gap.min.y)
    this.ctx.rotate(rotate)
    this.ctx.translate(data.gap.min.x , data.gap.min.y)

    this.ctx.scale(data.scale , data.scale)
    this.ctx.drawImage(
      data.image,
      data.left,
      data.top,
      data.w,
      data.h,
    )
    if(data.scale !== 1){
      this.ctx.scale(1 / data.scale , 1 / data.scale)
    }
    this.ctx.translate(-data.gap.min.x , -data.gap.min.y)
    this.ctx.rotate(-rotate || 0);
    this.ctx.translate(data.gap.min.x , data.gap.min.y)
    
    this.ctx.translate(-translate.x , -translate.y);
  }

}