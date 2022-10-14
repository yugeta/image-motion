import { SortImages }     from './sort_images.js'

export class View{
  constructor(options , setting){
    this.options        = options || {}
    this.setting        = setting
    this.animation_name = setting.animation_name
    this.keyframe       = setting.keyframe
    this.canvas         = setting.canvas
    this.ctx            = setting.ctx

    // this.gap            = setting.gap
    // this.set_canvas(this.canvas , this.gap)
    this.gap            = this.get_gap_data(this.animation_name)
    this.options.canvas.images.set_canvas_size(this.gap)

    // console.log(this.gap)
    this.view(this.animation_name , this.keyframe)
  }

  // set_canvas(canvas , gap){
  //   const w = Number(canvas.getAttribute('data-width'))
  //   const h = Number(canvas.getAttribute('data-height'))
  //   // canvas.width  = -gap.min.x + gap.max.x + w
  //   // canvas.height = -gap.min.y + gap.max.y + h
  //   const image_size = {
  //     w : Number(canvas.getAttribute('data-width')),
  //     h : Number(canvas.getAttribute('data-height')),
  //   }
  //   const root_size = {
  //     w : this.options.root.offsetWidth,
  //     h : this.options.root.offsetHeight
  //   }

  //   const aspect = this.get_aspect(image_size,root_size)

  //   gap = gap || {min:{x:0,y:0},max:{x:0,y:0}}
  //   const min = {
  //     x : gap.min.x / aspect.set,
  //     y : gap.min.y / aspect.set,
  //   }
  //   const max = {
  //     x : gap.max.x / aspect.set,
  //     y : gap.max.y / aspect.set,
  //   }

  //   // natural-size
  //   const natural_size ={
  //     w : image_size.w - gap.min.x + gap.max.x,
  //     h : image_size.h - gap.min.y + gap.max.y,
  //   }
  //   canvas.width  = natural_size.w
  //   canvas.height = natural_size.h
  //   // this.canvas.setAttribute('data-width'  , natural_size.w)
  //   // this.canvas.setAttribute('data-height' , natural_size.h)

  //   // canvas-size
  //   const root_size2 = {
  //     w : image_size.w - min.x + max.x,
  //     h : image_size.h - min.y + max.y,
  //   }
  //   canvas.style.setProperty('width'   , `${root_size2.w}px`  , '')
  //   canvas.style.setProperty('height'  , `${root_size2.h}px`  , '')

  //   // offset
  //   const offset = {
  //     w : min.x,
  //     h : min.y,
  //   }
  //   canvas.style.setProperty('--offset-w' , `${offset.w}px`  , '')
  //   canvas.style.setProperty('--offset-h' , `${offset.h}px`  , '')
  // }

  // get_aspect(image_size , root_size){
  //   const w = image_size.w / root_size.w
  //   const h = image_size.h / root_size.h
  //   return {
  //     w : w,
  //     h : h,
  //     set : w > h ? w : h,
  //     type : w > h ? 'vertical' : 'horizon',
  //   }
  // }

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
      // return this.options.data.image_animations[animation_name][keyframe]
      return this.options.data.transform_animation[animation_name][keyframe]
    }
    else{
      return this.options.data.transform_default
    }
  }

  get_images(animation_name , keyframe){
    return new SortImages(this.options , animation_name , keyframe).datas
    // if(animation_name
    // && this.options.data.sort_images[animation_name]
    // && this.options.data.sort_images[animation_name][keyframe]){
    //   return this.options.data.sort_images[animation_name][keyframe]
    // }
    // else{
    //   return new SortImages(this.options).datas
    // }
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
          x       : transform[uuid].x + shape_gap.min.x - this.gap.min.x,
          y       : transform[uuid].y + shape_gap.min.y - this.gap.min.y,
          // w       : transform[uuid].w,
          // h       : transform[uuid].h,
          w       : transform[uuid].w - shape_gap.min.x + shape_gap.max.x,
          h       : transform[uuid].h - shape_gap.min.y + shape_gap.max.y,
          left    : transform[uuid].ox,
          top     : transform[uuid].oy,
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
    const offset = {
      x : this.options.scale.fit.left,
      y : this.options.scale.fit.top,
    }
    const translate = {
      x : (data.x || 0) - offset.x - base_gap.min.x,
      y : (data.y || 0) - offset.y - base_gap.min.y,
    }
    const rotate = data.rotate
    this.ctx.globalAlpha = data.opacity;
    this.ctx.translate(translate.x , translate.y)
    this.ctx.rotate(rotate)
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
    this.ctx.rotate(-rotate || 0);
    this.ctx.translate(-translate.x , -translate.y);
  }

}