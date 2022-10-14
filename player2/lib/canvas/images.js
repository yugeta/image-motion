// import { Scale } from '../image/scale.js'
// import { CanvasTransform } from './transform.js'
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
  set_images(){
    const images = this.options.data.images
    let num = 0
    for(let data of images){
      data.num = num++
      data.element = this.create_image(data)
    }
  }
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
    this.check_count()
  }

  check_count(){
    this.loaded_count++
    // すべての画像が表示完了したらscale処理をする
    if(this.options.data.images.length <= this.loaded_count){
      if(this.callback){
        this.callback()
      }
    }
  }

  // ----------
  // Shape view
  is_shape_use(data){
    return data && data.shape_use === 1 ? true : false
  }
  
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
        this.view_image({
          image   : transform.image,
          rotate  : transform.rotate,
          scale   : transform.scale,
          opacity : transform.opacity,
          x       : transform.x,
          y       : transform.y,
          w       : transform.w,
          h       : transform.h,
          left    : transform.ox,
          top     : transform.oy,
        })
      }
    }
  }
  get_transform(uuid , animation_name , keyframe){
    const data = this.get_uuid2images(uuid)
    const anim = this.get_animation_data(uuid , animation_name , keyframe) || {}
    const res = {
      data    : data,
      anim    : anim,
      image   : data.element,
      ox      : -data.cx,
      oy      : -data.cy,
      cx      : data.cx,
      cy      : data.cy,
      x       : data.x + data.cx + (anim.posx || 0),
      y       : data.y + data.cy + (anim.posy || 0),
      w       : data.w,
      h       : data.h,
      rotate  : anim.rotate || 0,
      anim_corners : anim.shape && anim.shape.points ? anim.shape.points : [],
      opacity : anim.opacity !== undefined ? anim.opacity : data.opacity,
      scale   : anim.scale   !== undefined ?  anim.scale  : data.scale,
    }
    if(data.parent){
      const parent_data = this.get_transform(data.parent , animation_name , keyframe)
      res.opacity = res.opacity * parent_data.opacity
      res.scale   = res.scale   * parent_data.scale
      res.rotate += parent_data.rotate

      if(parent_data.rotate){
        const diff = {
          x : res.x + parent_data.ox,
          y : res.y + parent_data.oy,
        }
        const rotate_pos = this.rotate_pos(
          diff.x,
          diff.y,
          parent_data.rotate,
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
    if(!data.image){return}
    if(!data.scale){return}
    const rotate = this.deg(data.rotate || 0)
    this.ctx.globalAlpha = data.opacity;
    this.ctx.translate(data.x || 0 , data.y || 0)
    this.ctx.rotate(rotate);
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
    const corners_base  = this.get_shape_points(data.data.uuid)
    const corners_anim  = data.anim_corners
    // 画像分割(clip)
    const split = {
      w  : data.w / data.data.shape_table.x,
      h  : data.h / data.data.shape_table.y,
      nw : data.image.naturalWidth  / data.data.shape_table.x,
      nh : data.image.naturalHeight / data.data.shape_table.y,
    }
    let num = 0
    for(let y=0; y<data.data.shape_table.y; y++){
      for(let x=0; x<data.data.shape_table.x; x++){
        
        const split_image = this.get_split_image({
          image : data.image,
          clip :{
            x : split.nw * x,
            y : split.nh * y,
            w : split.nw,
            h : split.nh,
          },
        })

        const homography = new Homography({
          image  : split_image,
          corner0 : corners_base[num],
          corner1 : corners_anim[num] || null,
          x : 0,
          y : 0,
          w : split.w,
          h : split.h,
          offset : {
            x : split.w * x,
            y : split.h * y
          }
        })
        if(!homography.image){return}
        // console.log(homography)

        const pos = this.rotate_pos(
          split.w * x,
          split.h * y,
          data.rotate
        )

        this.view_image({
          image   : homography.image,
          rotate  : data.rotate,
          scale   : data.scale,
          opacity : data.opacity,
          x       : data.x + pos.x + homography.gap.min.x,
          y       : data.y + pos.y + homography.gap.min.y,
          w       : homography.width,
          h       : homography.height,
          left    : data.ox,
          top     : data.oy,
        })
        num++
      }
    }
  }

  get_split_image(data){
    const canvas = document.createElement('canvas')
    canvas.width  = data.clip.w
    canvas.height = data.clip.h
    const ctx = canvas.getContext("2d")
    ctx.drawImage(
      data.image,
      data.clip.x, 
      data.clip.y, 
      data.clip.w, 
      data.clip.h, 
      0,
      0,
      data.clip.w,
      data.clip.h,
    )
    ctx.strokeStyle='red'
    ctx.strokeRect(0,0,data.w,data.h)
    return canvas
  }

  play(animation_name , keyframe){
    this.view(animation_name , keyframe)
  }

  deg(r){
    return r * Math.PI / 180
  }

}