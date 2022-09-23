import { Scale } from '../image/scale.js'

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
      data.transform = this.get_transform(data)
    }
  }

  // 初期座標、サイズの設定
  get_transform(data){
    const pos = this.get_pos(data)
    return {
      x : pos.x,
      y : pos.y,
    }
  }

  // 親elementにさかのぼって実際の座標を取得（再起処理）
  get_pos(data){
    const pos = {
      x : data.x,
      y : data.y
    }
    if(data.parent){
      const parent_data = this.get_pos(this.get_uuid_data(data.parent))
      pos.x += parent_data.x
      pos.y += parent_data.y
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
    for(let data of images){
      if(this.is_shape_use(data)){
        this.view_image(data , animation_name , keyframe)
      }
      else{
        this.view_image(data , animation_name , keyframe)
      }
    }
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

  view_image(data , animation_name , keyframe){
    if(!data.element){return}
    const animation_data = this.get_animation_data(data , animation_name , keyframe)
// if(animation_data.r)console.log(animation_data)
    const trans = {
      x : animation_data.x + data.cx,
      y : animation_data.y + data.cy,
      r : animation_data.r * Math.PI / 180,
    }
    this.ctx.translate(trans.x , trans.y);
    this.ctx.rotate(trans.r);
    this.ctx.drawImage(
      data.element,
      -data.cx,
      -data.cy,
      animation_data.w,
      animation_data.h,
    )
    this.ctx.rotate(-trans.r);
    this.ctx.translate(-trans.x , -trans.y);

    // this.ctx.translate(animation_data.x , animation_data.y);
    // this.ctx.rotate(animation_data.rotate * Math.PI / 180);
    // this.ctx.drawImage(
    //   data.element,
    //   0,
    //   0,
    //   animation_data.w,
    //   animation_data.h,
    // )
    // this.ctx.rotate(animation_data.rotate * Math.PI / 180 * -1);
    // this.ctx.translate(-animation_data.x , -animation_data.y);



    // this.ctx.drawImage(
    //   data.element,
    //   animation_data.x,
    //   animation_data.y,
    //   animation_data.w,
    //   animation_data.h,
    // )


    // this.ctx.restore();
    // this.ctx.rotate(animation_data.rotate * Math.PI / 180 * -1);
    // this.ctx.translate(-trans.x , -trans.y);
    // console.log(animation_data.x + data.cx, animation_data.x + data.cy)
    // console.log(animation_data , data)
  }

  get_animation_data(data , animation_name , keyframe){
    let res_data = {
      // uuid : data.uuid,
      x : data.transform.x,
      y : data.transform.y,
      w : data.w,
      h : data.h,
      r : 0
    }
    const anim = this.options.canvas.animation.options.data.animations
    if(animation_name
    && keyframe !== undefined
    && anim
    && anim[animation_name]
    && anim[animation_name].items
    && anim[animation_name].items[data.uuid]
    && anim[animation_name].items[data.uuid].keyframes
    && anim[animation_name].items[data.uuid].keyframes[keyframe]){
      // const animation_data = anim[animation_name] || null
      // const keyframe_data = anim[animation_name].items[data.uuid].keyframes[keyframe]
      const keyframe_data = anim[animation_name].items[data.uuid].keyframes[keyframe]
      // console.log(keyframe_data)
      res_data.x += keyframe_data.posx || 0
      res_data.y += keyframe_data.posy || 0
      res_data.r += keyframe_data.rotate || 0
    }
    return res_data
  }

  view_shape(data){
    console.log(data)
  }

  play(animation_name){
    this.view(animation_name , 0)
  }

}