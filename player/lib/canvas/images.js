import { Scale } from '../image/scale.js'
import { CanvasTransform } from './transform.js'
import { Homography } from './homography.js'

export class Images{
  constructor(options , callback){
    this.options = options || {}
    this.callback = callback || null
    this.loaded_count = 0
    this.canvas = this.create_canvas()
    this.ctx = this.canvas.getContext("2d")
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
    }
  }

  // canvas作成
  create_canvas(){
    const canvas = document.createElement('canvas')
    canvas.className = 'scale'
    return canvas
  }

  // canvasの設置
  set_canvas(){
    this.options.root.appendChild(this.canvas)
  }

  // 画像のtransform設定
  set_canvas_property(){
    const base_rect = this.options.root.getBoundingClientRect()
    this.canvas.width  = this.options.scale.fit.width
    this.canvas.height = this.options.scale.fit.height
    console.log(this.options)
    // width-fit
    if(this.options.scale.fit.width / base_rect.width > this.options.scale.fit.height / base_rect.height){
      this.canvas.style.setProperty('width'  , `${base_rect.width}px`  , '')
    }
    // height-fit
    else{
      this.canvas.style.setProperty('height' , `${base_rect.height}px` , '')
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
    const images = this.get_sort_images(this.options.data.images)
    for(let image_data of images){
      const transform = this.get_transform(image_data.uuid , animation_name , keyframe)
      if(this.is_shape_use(image_data)){
        this.view_shape(transform)
      }
      else{
        this.view_image(transform)
      }
    }
  }
  get_transform(uuid , animation_name , keyframe){
    const data = this.get_uuid2images(uuid)
    const anim = this.get_animation_data(uuid , animation_name , keyframe) || {}
    const res = {
      data    : data,
      anim    : anim,
      elm     : data.element,
      ox      : -data.cx,
      oy      : -data.cy,
      cx      : data.cx,
      cy      : data.cy,
      x       : data.x + data.cx + (anim.posx || 0),
      y       : data.y + data.cy + (anim.posy || 0),
      w       : data.w,
      h       : data.h,
      r       : anim.rotate || 0,
      anim_corners : anim.shape && anim.shape.points ? anim.shape.points : [],
      opacity : anim.opacity !== undefined ? anim.opacity : data.opacity,
      scale   : anim.scale   !== undefined ?  anim.scale  : data.scale,
      // matrix  : this.get_matrix_data(uuid , animation_name , keyframe),
    }
    if(data.parent){
      const parent_data = this.get_transform(data.parent , animation_name , keyframe)
      res.opacity = res.opacity * parent_data.opacity
      res.scale   = res.scale   * parent_data.scale
      res.r += parent_data.r

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
        res.x = parent_data.x + rotate_pos.x * parent_data.scale
        res.y = parent_data.y + rotate_pos.y * parent_data.scale
      }
      else{
        res.x = parent_data.x + parent_data.ox + res.x * parent_data.scale
        res.y = parent_data.y + parent_data.oy + res.y * parent_data.scale
      }
    }
    return res
  }

  // get_matrix_data(uuid , animation_name , keyframe){
  //   if(!animation_name || keyframe === undefined){return}
  //   const anim = this.get_animation_data(uuid , animation_name , keyframe)
  //   if(anim && anim.shape){
  //     return anim.shape.canvas
  //   }
  // }

  // 画面を描き替えるためのflash処理
  canvas_clear(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    // console.log(data)
    const r = this.deg(data.r || 0)
    this.ctx.globalAlpha = data.opacity;
    this.ctx.translate(data.x || 0 , data.y || 0)
    this.ctx.rotate(r);
    this.ctx.scale(data.scale , data.scale)
    if(data.clip){
      if(data.shape){
        this.ctx.drawImage(
          data.shape,
          data.clip.x,
          data.clip.y,
          data.clip.w,
          data.clip.h,
          data.ox,
          data.oy,
          data.w,
          data.h,
        )
        console.log(data)
        // this.ctx.drawImage(
        //   data.shape,
        //   // data.clip.x,
        //   // data.clip.y,
        //   // data.clip.w,
        //   // data.clip.h,
        //   // data.ox,
        //   // data.oy,
        //   0,0,
        //   data.w,
        //   data.h,
        // )
      }
      else{
        this.ctx.drawImage(
          data.elm,
          data.clip.x,
          data.clip.y,
          data.clip.w,
          data.clip.h,
          data.ox,
          data.oy,
          data.w,
          data.h,
        )
      }
    }
    else{
      this.ctx.drawImage(
        data.elm,
        data.ox,
        data.oy,
        data.w,
        data.h,
      )
    }
    if(data.scale !== 1){
      this.ctx.scale(1 / data.scale , 1 / data.scale)
    }
    this.ctx.rotate(-r || 0);
    this.ctx.translate(-data.x || 0 , -data.y || 0);
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
    // console.log('shape',data)
    // const uuid    = data.data.uuid
    // const corners = this.options.data.shape[uuid]
    const corners_base  = this.get_shape_points(data.data.uuid)
    const corners_anim  = data.anim_corners
    // console.log(corners_normal,corners_anim)
    // 画像分割(clip)
    // console.log(data.data.nw , data.elm.naturalWidth)
    const split = {
      w : data.w / data.data.shape_table.x,
      h : data.h / data.data.shape_table.y,
      nw : data.elm.naturalWidth  / data.data.shape_table.x,
      nh : data.elm.naturalHeight / data.data.shape_table.y,
      // nw : data.nw  / data.data.shape_table.x,
      // nh : data.nh/ data.data.shape_table.y,
    }
    let num = 0
    for(let y=0; y<data.data.shape_table.y; y++){
      for(let x=0; x<data.data.shape_table.x; x++){
        const pos = this.rotate_pos(
          (split.w * x),
          (split.h * y),
          data.r
        )

        // const clip_data2 = {
        //   w : split.nw,
        //   h : split.nh,
        //   x : split.nw * x,
        //   y : split.nh * y,
        // }

        // console.log(data)
        // continue;

        const homography = new Homography({
          image  : data.elm,
          corner0 : corners_base[num],
          corner1 : corners_anim[num] || null,
          // clip : clip_data,
          x : split.nw * x,
          y : split.nh * y,
          // x : data.x + pos.x,
          // y : data.y + pos.y,
          w : split.nw,
          h : split.nh,
          // width  : split.w + (x === data.data.shape_table.x-1 ? 0 : 1),
          // height : split.h + (y === data.data.shape_table.y-1 ? 0 : 1),
        })

        const clip_data = {
          // x : split.nw * x,
          // y : split.nh * y,
          x : homography.x,
          y : homography.y,
          w : homography.width,
          h : homography.height,
        }
        // console.log(clip_data ,homography.x,homography.y)

        // console.log(split.w + (x === data.data.shape_table.x-1 ? 0 : 1) , homography.width)
        // console.log(data.x + pos.x)
        console.log(homography)
        // continue;

        
        const temp = {
          elm     : data.elm,
          // shape   : this.create_matrix_image_test(),
          // x : 100,
          // y : 100,
          // w : 300,
          // h : 300,
          // shape   : this.create_matrix_image(data.elm , clip , data.matrix , num),
          shape   : corners_anim[num] ? homography.image : null,
          // x       : data.x + pos.x,
          // y       : data.y + pos.y,
          // w       : split.w + (x === data.data.shape_table.x-1 ? 0 : 1),
          // h       : split.h + (y === data.data.shape_table.y-1 ? 0 : 1),
          x       : data.x + pos.x + homography.gap.min.x,
          y       : data.y + pos.y + homography.gap.min.y,
          w       : homography.width,
          h       : homography.height,
          r       : data.r,
          ox      : data.ox,
          oy      : data.oy,
          scale   : data.scale,
          opacity : data.opacity,
          matrix  : null,
          clip    : clip_data,
        }
        this.view_image(temp)
        num++
      }
    }
  }
  // create_matrix_image_test(){
  //   const transform = {
  //     w : 100,
  //     h : 100,
  //   }
  //   const canvas  = document.createElement('canvas')
  //   canvas.width  = transform.w
  //   canvas.height = transform.h
  //   const ctx    = canvas.getContext("2d")
  //   const shape = ctx.createImageData(transform.w, transform.h)
  //   ctx.fillStyle = 'blue'
  //   ctx.fillRect(10, 10, 50, 50)
  //   ctx.fillText('hoge', 20, 75);
  //   // ctx.strokeStyle = 'red'
  //   // ctx.strokeRect(20,20,80,80)
  //   return shape
  // }

  // create_matrix_image(base_image , clip , matrix , num){
  //   if(!matrix || matrix[num] === undefined){return}
  //   // console.log(clip)
  //   // const input  = this.ctx.getImageData(clip.x, clip.y, clip.w, clip.h)
  //   // const transform = {
  //   //   x : clip.x * 2,
  //   //   y : clip.y * 2,
  //   //   w : clip.w * 2,
  //   //   h : clip.h * 2,
  //   // }
  //   // const offset = {
  //   //   x : clip.w / 2 + clip.x * 2,
  //   //   y : clip.h / 2 + clip.x * 2,
  //   // }
  //   const transform = {
  //     x : clip.x,
  //     y : clip.y,
  //     w : clip.w,
  //     h : clip.h,
  //   }
  //   const offset = {
  //     x : clip.x,
  //     y : clip.x,
  //   }
  //   // console.log(Matrix3D)
    
  //   const canvas  = document.createElement('canvas')
  //   canvas.width  = transform.w
  //   canvas.height = transform.h
  //   const ctx     = canvas.getContext("2d")
  //   ctx.drawImage(base_image, 0, 0, transform.w, transform.h, offset.x, offset.y, clip.w, clip.h)
  //   const input  = ctx.getImageData(transform.x , transform.y, transform.w, transform.h)
  //   const output = ctx.createImageData(transform.w, transform.h)
  //   const ans    = matrix[num].ans
  //   for(let y=0; y<transform.h; ++y){
  //     for(let x=0; x<transform.w; ++x){
  //       const z  =  x * ans.e(7) + y * ans.e(8) + 1.0
  //       const u  = (x * ans.e(1) + y * ans.e(2) + ans.e(3)) / z
  //       const v  = (x * ans.e(4) + y * ans.e(5) + ans.e(6)) / z
  //       const pixelData = this.getPixel(input, u, v)
  //       this.setPixel(output, x, y, pixelData)
  //     }
  //   }
  //   ctx.putImageData(
  //     output,
  //     transform.x,
  //     transform.y,
  //     0,0,
  //     transform.w,
  //     transform.h,
  //   )
  //   return canvas
  // }

  // getPixel(image, u, v){
  //   const pixels = image.data
  //   const index = (image.width * ~~v * 4) + (~~u * 4)
  //   if(index < 0 || pixels.length < index + 3) return {}
  //   return { 
  //     r: pixels[index + 0], 
  //     g: pixels[index + 1], 
  //     b: pixels[index + 2], 
  //     a: pixels[index + 3],
  //   }
  // }

//   setPixel(image, x, y, pixelData){
//     pixelData = pixelData ?? {}
//     const pixels = image.data
//     const index  = (image.width * y * 4) + (x * 4)
//     if(index < 0 || pixels.length < index + 3) return undefined
//     pixels[index + 0] = pixelData.r
//     pixels[index + 1] = pixelData.g
//     pixels[index + 2] = pixelData.b
//     pixels[index + 3] = pixelData.a
//  }

  play(animation_name){
    this.view(animation_name , 0)
  }

  deg(r){
    return r * Math.PI / 180
  }

}