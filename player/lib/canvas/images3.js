import { Scale } from '../image/scale.js'
import { CanvasTransform } from './transform.js'

export class Images{
  constructor(options , callback){
    this.options = options || {}
    this.callback = callback || null
    this.loaded_count = 0
    this.elm = this.create_canvas()
    this.ctx = this.elm.getContext("2d")
    this.ctx.imageSmoothingEnabled = false
    this.images = this.get_sort_images(this.options.data.images)
    this.set_canvas()
    this.set_canvas_property()
    this.set_images()
  }

  callback(){
    if(!this.callback){return}
    this.callback()
  }

  get datas(){
    return this.options.data.images
  }

  // 個別画像の表示設定
  set_images(){
    const images = this.options.data.images
    let num = 0
    for(let data of images){
      data.num = num++
      data.element = this.create_image(data)
    }
  }

  // canvas作成
  create_canvas(){
    const canvas = document.createElement('canvas')
    canvas.slassName = 'scale'
    return canvas
  }

  // canvasの設置
  set_canvas(){
    this.options.root.appendChild(this.elm)
  }

  // 画像のtransform設定
  set_canvas_property(){
    const base_rect = this.options.root.getBoundingClientRect()
    this.elm.width  = this.options.scale.fit.width
    this.elm.height = this.options.scale.fit.height
    // width-fit
    if(this.options.scale.fit.width / base_rect.width > this.options.scale.fit.height / base_rect.height){
      this.elm.style.setProperty('width'  , `${base_rect.width}px`  , '')
    }
    // height-fit
    else{
      this.elm.style.setProperty('height' , `${base_rect.height}px` , '')
    }
  }

  // uuidを指定してimage-dataを取得する
  get_uuid_data(uuid){
    return this.options.data.images.find(e => e.uuid === uuid)
  }

  // ----------
  // Image view
  create_image(data){
    const pic = this.pic
    const img = new Image()
    img.onload = this.loaded_image.bind(this)
    img.src = data.src || ''
    return img
  }

  // 親要素の取得
  get_parent(uuid){
    return this.options.root.querySelector(`.pic[data-uuid='${uuid}']`) || this.options.scale
  }

  // 読み込み後の画像ファイルの扱い（現在なにもしない）
  loaded_image(e){
    // const img = e.target
    this.check_count()
  }

  check_count(){
    this.loaded_count++
    // すべての画像が表示完了したらscale処理をする
    if(this.options.data.images.length <= this.loaded_count){
      // new Scale(this.options)
      this.callback()
    }
  }

  // ----------
  // Shape view
  is_shape_use(data){
    return data && data.shape_use === 1 ? true : false
  }

  // get_table(data){
  //   return {
  //     x : data.shape_table.x || 1,
  //     y : data.shape_table.y || 1,
  //   }
  // }

  // create_shape(data){
  //   const shape = document.createElement('div')
  //   shape.className = 'shape'
  //   const shapes = this.set_shapes(data)
  //   for(let shape_item of shapes){
  //     shape.appendChild(shape_item)
  //   }
  //   this.pic.appendChild(shape)
  //   this.options.data.images[data.num].shape_splits = shapes
  //   this.options.data.images[data.num].shape_points = this.get_shape_points(data.uuid)
  // }

  // set_shapes(data){console.log(data)
  //   const table = this.get_table(data)
  //   const d ={
  //     num : 0,
  //     w   : data.w / (table.x || 1),
  //     h   : data.h / (table.y || 1),
  //   }
  //   const shapes = []
  //   for(let i=0; i<table.y; i++){
  //     const y = i * d.h
  //     for(let j=0; j<table.x; j++){
  //       const x = j * d.w
  //       const shape_item = this.get_shape_item(
  //         x, y, d.w, d.h,
  //         data,
  //         d.num
  //       )
  //       shapes.push(shape_item)
  //       d.num++
  //     }
  //   }
  //   return shapes
  // }

  // get_shape_item(x,y,w,h,data,num){
  //   const div = document.createElement('div')
  //   div.className = 'shape-item'
  //   div.setAttribute('data-num' , num)
  //   data.shape_num = num
  //   // セグメントラインが出ないための１ピクセル余分に表示（右と下のライン）
  //   const width  = w
  //   const height = h
  //   div.style.setProperty('width'  , `${w + 1}px` , '')
  //   div.style.setProperty('height' , `${h + 1}px` , '')
  //   div.style.setProperty('left'   , `${x}px` , '')
  //   div.style.setProperty('top'    , `${y}px` , '')
  //   div.style.setProperty('transform-origin' , `-${x}px -${y}px` , '')

  //   const img = this.get_shape_item_img(
  //     x, 
  //     y, 
  //     w, 
  //     h,
  //     data)
  //   div.appendChild(img)
    
  //   return div
  // }
  
  // get_shape_item_img(x,y,w,h , data){
  //   const img = new Image()
  //   if(data.shape_num === 0){
  //     img.onload = this.check_count.bind(this,data.uuid)
  //   }
  //   img.src = data.src
  //   img.style.setProperty('left'   , `-${x}px` , '')
  //   img.style.setProperty('top'    , `-${y}px` , '')
    
  //   return img
  // }
  
  
  get_shape_points(uuid){
    const shape_datas = this.options.data.shape[uuid]
    const res = []
    for(let num in shape_datas){
      const shape_data = shape_datas[num]
      const pos_datas = []
      for(let i=0; i<shape_data.corners.length; i++){
        pos_datas.push({
          x : shape_data.corners[i].x,
          y : shape_data.corners[i].y,
        })
      }
      res.push(pos_datas)
    }
    return res
  }

  // ----------
  // View
  view(animation_name , keyframe){
    animation_name = typeof animation_name === 'string' ? animation_name : ''
    this.canvas_clear()

    // const images = this.get_sort_images(this.options.data.images)
    for(let image_data of this.images){
      // 上位階層以外はスルー（上位階層からの子階層検索で対応）
      if(image_data.parent){continue}
      this.set_view(image_data , animation_name , keyframe)
      // const transform = this.get_transform(image_data.uuid , animation_name , keyframe)
      // if(this.is_shape_use(image_data)){
      //   // this.view_shape(transform)
      //   this.view_image(transform)
      // }
      // else{
      //   this.view_image(transform)
      // }
      
    }
  }
  set_view(data , animation_name , keyframe){
    const transform = this.get_transform(data.uuid , animation_name , keyframe)
    if(this.is_shape_use(data)){
      // this.view_shape(transform)
      this.view_image(transform)
    }
    else{
      this.view_image(transform)
    }
    // 子階層対応
    const children = this.images.filter(e => e.parent === data.uuid)
    // console.log(children)
    if(children.length){
      for(let child of children){
        this.set_view(child , animation_name , keyframe)
      }
    }
    else{
      this.reset_ctx()
    }
  }
  view_image(data){
    this.ctx_opacity = this.ctx_opacity || 1
    this.ctx_scale   = this.ctx_scale   || 1
    this.ctx_rotate  = this.ctx_rotate  || 0
    this.ctx_x       = this.ctx_x       || 0
    this.ctx_y       = this.ctx_y       || 0

    this.ctx_opacity *= data.opacity
    this.ctx_scale   *= data.scale
    this.ctx_rotate  += this.deg(data.r || 0)
    this.ctx_x       += data.x
    this.ctx_y       += data.y
console.log(data)
console.log(this.ctx_x,this.ctx_y)

    // const r = this.deg(data.r || 0)
    this.ctx.globalAlpha = this.ctx_opacity
    this.ctx.translate(this.ctx_x , this.ctx_y)
    this.ctx.rotate(this.ctx_rotate);
    this.ctx.scale(this.ctx_scale , this.ctx_scale)
    this.ctx.drawImage(
      data.elm,
      data.ox,
      data.oy,
      data.w,
      data.h,
    )
    // if(data.scale !== 1){
    //   this.ctx.scale(1 / data.scale , 1 / data.scale)
    // }
    // this.ctx.rotate(-r || 0);
    // this.ctx.translate(-data.x || 0 , -data.y || 0);
  }
  reset_ctx(){
    this.ctx.globalAlpha = 1 / this.ctx_opacity
    const scale = 1 / this.ctx_scale
    this.ctx.scale(scale , scale)
    this.ctx.rotate(-this.ctx_rotate);
    this.ctx.translate(-this.ctx_x , -this.ctx_y)
    this.ctx_opacity = 1
    this.ctx_rotate  = 0
    this.ctx_scale   = 1
    this.ctx_x       = 0
    this.ctx_y       = 0
  }

  get_transform(uuid , animation_name , keyframe){
    const data = this.get_uuid2images(uuid)
    const anim = this.get_animation_data(uuid , animation_name , keyframe) || {}
    const res = {
      data : data,
      anim : anim,
      elm  : data.element,
      ox   : -data.cx,
      oy   : -data.cy,
      cx   : data.cx,
      cy   : data.cy,
      x    : data.x + data.cx + (anim.posx || 0),
      y    : data.y + data.cy + (anim.posy || 0),
      w    : data.w,
      h    : data.h,
      r    : anim.rotate || 0,
      opacity : anim.opacity !== undefined ? anim.opacity : data.opacity,
      scale   : anim.scale   !== undefined ?  anim.scale  : data.scale,
    }
    // if(data.parent){
    //   const parent_data = this.get_transform(data.parent , animation_name , keyframe)
    //   if(parent_data.r){
    //     const diff = {
    //       x : res.x + parent_data.ox,
    //       y : res.y + parent_data.oy,
    //     }
    //     const rotate_pos = this.rotate_pos(
    //       diff.x,
    //       diff.y,
    //       parent_data.r,
    //     )
    //     res.x = parent_data.x + rotate_pos.x
    //     res.y = parent_data.y + rotate_pos.y
    //   }
    //   else{
    //     res.x += parent_data.x + parent_data.ox
    //     res.y += parent_data.y + parent_data.oy
    //   }
    //   res.opacity = res.opacity * parent_data.opacity
    //   res.scale   = res.scale   * parent_data.scale
    //   res.r += parent_data.r
    // }
    return res
  }
  // get_transform(uuid , animation_name , keyframe){
  //   const data = this.get_uuid2images(uuid)
  //   const anim = this.get_animation_data(uuid , animation_name , keyframe) || {}
  //   const res = {
  //     data : data,
  //     anim : anim,
  //     elm  : data.element,
  //     ox   : -data.cx,
  //     oy   : -data.cy,
  //     cx   : data.cx,
  //     cy   : data.cy,
  //     x    : data.x + data.cx + (anim.posx || 0),
  //     y    : data.y + data.cy + (anim.posy || 0),
  //     w    : data.w,
  //     h    : data.h,
  //     r    : anim.rotate || 0,
  //     opacity : anim.opacity !== undefined ? anim.opacity : data.opacity,
  //     scale   : anim.scale   !== undefined ?  anim.scale  : data.scale,
  //   }
  //   if(data.parent){
  //     const parent_data = this.get_transform(data.parent , animation_name , keyframe)
  //     if(parent_data.r){
  //       const diff = {
  //         x : res.x + parent_data.ox,
  //         y : res.y + parent_data.oy,
  //       }
  //       const rotate_pos = this.rotate_pos(
  //         diff.x,
  //         diff.y,
  //         parent_data.r,
  //       )
  //       res.x = parent_data.x + rotate_pos.x
  //       res.y = parent_data.y + rotate_pos.y
  //     }
  //     else{
  //       res.x += parent_data.x + parent_data.ox
  //       res.y += parent_data.y + parent_data.oy
  //     }
  //     res.opacity = res.opacity * parent_data.opacity
  //     res.scale   = res.scale   * parent_data.scale
  //     res.r += parent_data.r
  //   }
  //   return res
  // }

  // 画面を描き替えるためのflash処理
  canvas_clear(){
    this.ctx.clearRect(0, 0, this.elm.width, this.elm.height);
  }

  // poszの値を元に、表示順番を並び替える（同数の場合は、書かれた絢に上に被さる）
  get_sort_images(images){
    return images.sort((a,b)=>{
      const a1 = Number(a.order || 0) * 100 + Number(a.posz || 0)
      const b1 = Number(b.order || 0) * 100 + Number(b.posz || 0)
      if(a1 < b1){
        return -1
      }
      else{
        return +1
      }
    })
  }

  

  

  get_animation_data(uuid , animation_name , keyframe){
    if(!uuid || !animation_name || !keyframe === undefined){return}
    const anim = this.options.canvas.animation.options.data.animations
    if(animation_name
    && keyframe !== undefined
    && anim
    && anim[animation_name]
    && anim[animation_name].items
    && anim[animation_name].items[uuid]
    && anim[animation_name].items[uuid].keyframes
    && anim[animation_name].items[uuid].keyframes[keyframe]){
      return anim[animation_name].items[uuid].keyframes[keyframe]
    }
  }

  get_uuid2images(uuid){
    if(!uuid){return}
    return this.options.data.images.find(e => e.uuid === uuid)
  }

  // 回転角度による子階層の座標の求め方
  rotate_pos(x, y, r) {
    r = this.deg(r)
    var sin = Math.sin(r)
    var cos = Math.cos(r)
    return {
      x : x * cos - y * sin,
      y : x * sin + y * cos,
    }
  }

  view_shape(data){
    // console.log(data)
    const shapes = this.get_shape_points(data.data.uuid)
    // console.log(shapes)
    // 画像分割(clip)
    const split = {
      w : data.w / data.data.shape_table.x,
      h : data.h / data.data.shape_table.y,
    }
    for(let y=0; y<data.data.shape_table.y; y++){
      for(let x=0; x<data.data.shape_table.x; x++){
        const temp = {
          elm : data.elm,
          x : data.x + (split.w * x),
          y : data.y + (split.h * y),
          w : split.w,
          h : split.h,
          r : data.r,
          ox : data.ox,
          oy : data.oy,
          scale : data.scale,
          opacity : data.opacity,
          matrix : null,
        }
        this.view_image(temp)
      }
    }
  }

  play(animation_name){
    this.view(animation_name , 0)
  }

  deg(r){
    return r * Math.PI / 180
  }

}