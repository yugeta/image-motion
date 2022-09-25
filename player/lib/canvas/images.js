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
      data.transform = this.get_hierarchy_pos(data)
    }
  }

  // 初期座標、サイズの設定
  get_hierarchy_pos(data){
    data.r = data.rotate
    const pos = this.get_pos(data)
    return {
      x : pos.x,
      y : pos.y,
      // r : pos.rotate,
    }
  }

  // 親elementにさかのぼって実際の座標を取得（再起処理）
  get_pos(data){
    const pos = {
      x : data.x,
      y : data.y,
      // rotate : data.rotate || 0,
    }
    if(data.parent){
      const parent_data = this.get_pos(this.get_uuid_data(data.parent))
      // console.log(parent_data)
      // if(parent_data.rotate){//console.log(parent_data)
      //   const rpos = this.rotatePoint2D(parent_data.rotate , parent_data.x , parent_data.y)
      //   pos.x += rpos.x
      //   pos.y += rpos.y
      //   pos.rotate += parent_data.rotate
      // }
      // else{
        pos.x += parent_data.x
        pos.y += parent_data.y
      // }
    }
    return pos
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
    // this.options.root.appendChild(img)
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
  
  
  // get_shape_points(uuid){
  //   const shape_datas = this.options.data.shape[uuid]
  //   const res = []
  //   for(let num in shape_datas){
  //     const shape_data = shape_datas[num]
  //     const pos_datas = []
  //     for(let i=0; i<shape_data.corners.length; i++){
  //       pos_datas.push({
  //         x : shape_data.corners[i].x,
  //         y : shape_data.corners[i].y,
  //       })
  //     }
  //     res.push(pos_datas)
  //   }
  //   return res
  // }

  // ----------
  // View
  view(animation_name , keyframe){
    animation_name = typeof animation_name === 'string' ? animation_name : ''
    this.canvas_clear()
    const images = this.get_sort_images(this.options.data.images)
    for(let image_data of images){
      const transform = this.get_transform(image_data.uuid , animation_name , keyframe)
      this.view_image(transform)
      // if(this.is_shape_use(data)){
      //   this.view_image(data.element , transform)
      // }
      // else{
      //   this.view_image(data.element , transform)
      // }
    }
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
    }
    if(data.parent){
      const parent_data = this.get_transform(data.parent , animation_name , keyframe)
      if(parent_data.r){
        const diff = {
          x : res.x + parent_data.ox,
          y : res.y + parent_data.oy,
        }
        const rotate_pos = this.rotate_pos(
          diff.x,
          diff.y,
          parent_data.r,
        )
        res.x = parent_data.x + rotate_pos.x
        res.y = parent_data.y + rotate_pos.y
      }
      else{
        res.x += parent_data.x + parent_data.ox
        res.y += parent_data.y + parent_data.oy
      }
      res.r += parent_data.r
    }
    return res
  }

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

  view_image(data){
    // const transform = this.get_animation_transform(data.uuid , animation_name , keyframe)
    console.log(data)
    const r = this.deg(data.r || 0)
    this.ctx.translate(data.x || 0 , data.y || 0)
    this.ctx.rotate(r);
    this.ctx.drawImage(
      data.elm,
      data.ox,
      data.oy,
      data.w  || 0,
      data.h  || 0,
    )
    this.ctx.rotate(-r || 0);
    this.ctx.translate(-data.x || 0 , -data.y || 0);
  }

  get_animation_transform(uuid , animation_name , keyframe){
    const data = this.get_uuid2images(uuid)
    let res_data = {
      cx : -data.cx,
      cy : -data.cy,
      x : data.transform.x + data.cx,
      y : data.transform.y + data.cy,
      w : data.w,
      h : data.h,
      r : 0
    }

    const transform = this.get_animation_parent_transform(data.uuid , animation_name , keyframe)
    if(transform){
      // console.log(transform)
      res_data.x = transform.x
      res_data.y = transform.y
      res_data.r = transform.r
    }

    return res_data
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
    // console.log(this.options.data.images)
    return this.options.data.images.find(e => e.uuid === uuid)
  }

  get_animation_parent_transform(uuid , animation_name , keyframe){
    const data = this.get_uuid2images(uuid)
    if(!data || !data.parent || !animation_name || keyframe === undefined){return}
    const my_anim = this.get_animation_data(uuid   , animation_name , keyframe)
    if(!my_anim){return}
    const my_rotate = my_anim.rotate || 0
    const diff = this.get_parent_diff_pos(uuid)
    const parent_rotate = this.get_parent_rotate(data.parent , animation_name , keyframe)
    const trigonometric_function = this.rotatePoint2D(parent_rotate , diff.x , diff.y) // 三角関数
    const res_data = {
      uuid : uuid,
      cx   : -data.cx,
      cy   : -data.cy,
      x    : trigonometric_function.x,
      y    : trigonometric_function.y,
      r    : my_rotate + parent_rotate,
    }

    // const parent_data      = this.get_animation_data(data.parent , animation_name , keyframe)
    // const parent_transform = this.get_animation_rotate(data.parent , animation_name , keyframe)
    // if(parent_transform){
    //   res_data.x += parent_transform.x
    //   res_data.y += parent_transform.y
    //   // res_data.r += parent_rotate.r
    // }

    return res_data

    // const parent_anim = this.get_animation_data(data.parent , animation_name , keyframe)
    // if(!my_anim){return}
    // const my_axis = {
    //   x : my_anim.x + my_anim.cx,
    //   y : my_anim.y + my_anim.cy,
    //   r : my_anim.rotate || 0
    // }
    // const parent_axis = {
    //   x : parent_anim ? parent_anim.x + parent_anim.cx : 0,
    //   y : parent_anim ? parent_anim.y + parent_anim.cy : 0,
    //   r : parent_anim ? (parent_anim.rotate || 0) : 0,
    // }
    // const new_pos = this.rotatePoint2D(
    //   my_anim.rotate,
    //   my_axis.x - parent_axis.x,
    //   my_axis.y - parent_axis.y,
    // )
    
    // const parent_data = parent_anim ? this.get_uuid_data(data.parent) : null
    // const parent_transform = this.get_animation_rotate(parent_data , animation_name , keyframe)
    // if(!parent_transform){return}
    // return {
    //   x : new_pos.x + parent_transform.x,
    //   y : new_pos.y + parent_transform.y,
    //   r : (my_anim.rotate || 0) + (parent_anim.rotate || 0),
    // }
  }

  get_parent_diff_pos(uuid){
    const my_data     = this.get_uuid2images(uuid)
    const parent_data = this.get_uuid2images(my_data.parent) || {x:0,y:0,cx:0,cy:0}
    return{
      x : (my_data.x + my_data.cx) - (parent_data.x + parent_data.cx),
      y : (my_data.y + my_data.cy) - (parent_data.y + parent_data.cy),
    }
    // return{
    //   x : (parent_data.x + parent_data.cx) - (my_data.x + my_data.cx),
    //   y : (parent_data.y + parent_data.cy) - (my_data.y + my_data.cy),
    // }
  }
  // get_animation_rotate(data , animation_name , keyframe){
  //   if(!data || !animation_name || keyframe === undefined){return}
  //   const my_anim     = this.get_animation_data(data.uuid   , animation_name , keyframe)
  //   const parent_anim = this.get_animation_data(data.parent , animation_name , keyframe)
  //   if(!my_anim){return}
  //   const my_axis = {
  //     x : my_anim.x + my_anim.cx,
  //     y : my_anim.y + my_anim.cy,
  //     r : my_anim.rotate || 0
  //   }
  //   const parent_axis = {
  //     x : parent_anim ? parent_anim.x + parent_anim.cx : 0,
  //     y : parent_anim ? parent_anim.y + parent_anim.cy : 0,
  //     r : parent_anim ? (parent_anim.rotate || 0) : 0,
  //   }
  //   const new_pos = this.rotatePoint2D(
  //     my_anim.rotate,
  //     my_axis.x - parent_axis.x,
  //     my_axis.y - parent_axis.y,
  //   )
    
  //   const parent_data = parent_anim ? this.get_uuid_data(data.parent) : null
  //   const parent_transform = this.get_animation_rotate(parent_data , animation_name , keyframe)
  //   if(!parent_transform){return}
  //   return {
  //     x : new_pos.x + parent_transform.x,
  //     y : new_pos.y + parent_transform.y,
  //     r : (my_anim.rotate || 0) + (parent_anim.rotate || 0),
  //   }
  // }

  get_parent_rotate(uuid , animation_name , keyframe){
    const my_image = this.get_uuid2images(uuid)
    const my_data  = this.get_uuid2images(uuid)
    let rotate = my_data.rotate || 0
    if(my_image.parent){
      const parent_anim = this.get_animation_data(my_image.uuid   , animation_name , keyframe)
      rotate += parent_anim.rotate
    }
    return rotate
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
    console.log(data)
  }

  play(animation_name){
    this.view(animation_name , 0)
  }

  deg(r){
    return r * Math.PI / 180
  }

}