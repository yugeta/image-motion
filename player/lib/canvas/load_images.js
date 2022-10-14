// import { Homography } from './homography.js'
// import { View }       from './view.js'
import { Transform }  from './transform.js'
import { SortImages }     from './sort_images.js'

export class LoadImages{
  constructor(options , callback){
    this.options = options || {}
    this.callback = callback || null
    this.loaded_count = 0
    this.set_canvas()
    this.set_images()
  }

  get datas(){
    return this.options.data.images
  }

  get image_size(){
    return {
      w : this.options.scale.fit.width,
      h : this.options.scale.fit.height,
    }
  }
  get root_size(){
    return {
      w : this.options.root.offsetWidth,
      h : this.options.root.offsetHeight
    }
  }
  get view_size(){

  }
  get aspect(){
    const image_size = this.image_size
    const root_size  = this.root_size
    const w = image_size.w / root_size.w
    const h = image_size.h / root_size.h
    return {
      w : w,
      h : h,
      set : w > h ? w : h,
      type : w > h ? 'vertical' : 'horizon',
    }
  }

  // canvasの縦横表示サイズの取得
  get canvas_size(){
    const image_size  = this.image_size
    const root_size   = this.root_size
    const aspect      = this.aspect
    if(aspect.w > aspect.h){
      return {
        w : root_size.w,
        h : image_size.h / aspect.w,
      }
    }
    else{
      return {
        w : image_size.w / aspect.h,
        h : root_size.h,
      }
    }
  }


  finish(){
    if(!this.callback){return}
    this.callback()
  }

  // ----------
  // canvas作成

  create_canvas(){
    const canvas = document.createElement('canvas')
    return canvas
  }

  // canvasの設置
  set_canvas(){
    this.canvas = this.create_canvas()
    this.ctx    = this.canvas.getContext("2d", { storage: "discardable" })
    // this.ctx.imageSmoothingEnabled = false
    this.options.root.appendChild(this.canvas)
    
  }

  set_canvas_size(gap){
    gap = gap || {min:{x:0,y:0},max:{x:0,y:0}}
    const min = {
      x : gap.min.x / this.aspect.set,
      y : gap.min.y / this.aspect.set,
    }
    const max = {
      x : gap.max.x / this.aspect.set,
      y : gap.max.y / this.aspect.set,
    }

    // natural-size
    const natural_size ={
      w : this.image_size.w - gap.min.x + gap.max.x,
      h : this.image_size.h - gap.min.y + gap.max.y,
    }
    this.canvas.width  = natural_size.w
    this.canvas.height = natural_size.h
    this.canvas.setAttribute('data-width'  , natural_size.w)
    this.canvas.setAttribute('data-height' , natural_size.h)

    // canvas-size
    const root_size = {
      w : this.canvas_size.w - min.x + max.x,
      h : this.canvas_size.h - min.y + max.y,
    }
    this.canvas.style.setProperty('width'   , `${root_size.w}px`  , '')
    this.canvas.style.setProperty('height'  , `${root_size.h}px`  , '')

    // offset
    const offset = {
      // w : 0,
      // h : 0,
      w : min.x,
      h : min.y,
    }
    this.canvas.style.setProperty('--offset-w' , `${offset.w}px`  , '')
    this.canvas.style.setProperty('--offset-h' , `${offset.h}px`  , '')

    // console.log(natural_size , root_size , offset , this.aspect)
  }

  // uuidを指定してimage-dataを取得する
  get_uuid_data(uuid){
    return this.options.data.images.find(e => e.uuid === uuid)
  }

  // ----------
  // load Image

  set_images(){
    const images = this.options.data.images
    let num = 0
    for(let data of images){
      data.num = num++
      data.element = this.create_image(data)
    }
  }
  create_image(data){
    const img = new Image()
    img.onload = this.loaded_image.bind(this)
    img.src = data.src || ''
    return img
  }

  // 読み込み後の画像ファイルの扱い（現在なにもしない）
  loaded_image(e){
    this.check_count()
  }


  check_count(){
    this.loaded_count++
    // すべての画像が表示完了したらscale処理をする
    if(this.options.data.images.length <= this.loaded_count){
      // console.log('image-loaded' , this.options.data.images.length , this.loaded_count)
      this.loaded_images()
    }
  }
  
  loaded_images(){
    this.set_images_transform()
    this.delete_src()
    this.finish()
  }

  delete_src(){
    const images = this.options.data.images
    for(let data of images){
      delete data.src
    }
  }

  // デフォルト値のメモリセット
  set_images_transform(){
    // const images = new SortImages(this.options).datas
    const images = this.options.data.images
    const transform_default = {}
    for(let image of images){
      transform_default[image.uuid] = new Transform(
        this.options,
        image.uuid,
        '', // animation_name
        0,  // keyframe
      )
    }
    // this.options.sort_images = images
    this.options.data.transform_default = transform_default
  }


}