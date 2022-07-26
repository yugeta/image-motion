// import { Shape }     from './shape.js'
import { Scale } from './scale.js'

export class Images{
  constructor(options){
    this.options = options
    this.view_images()
    new Scale(options.root , options.scale)
  }

  // 個別画像の表示設定
  view_images(){
    const images = this.options.data.images
    let num = 0
    for(let data of images){
      this.pic = this.create_pic(data)
      this.set_pic_property(this.pic , data)
      data.num = num
      if(this.is_shape_use(data)){
        this.create_shape(data)
      }
      else{
        this.create_image(data)
      }
      num++
    }
  }

  create_pic(data){
    const parent = this.get_parent(data.parent)
    const pic = document.createElement('div')
    parent.appendChild(pic)
    return pic
  }

  // 画像のtransform設定
  set_pic_property(pic , data){
    pic.className = 'pic'
    pic.setAttribute('data-uuid' , data.uuid)
    pic.style.setProperty('top'     , `${data.y}px`,'')
    pic.style.setProperty('left'    , `${data.x}px`,'')
    pic.style.setProperty('width'   , `${data.w}px`,'')
    pic.style.setProperty('height'  , `${data.h}px`,'')
    if(data.order){
      pic.style.setProperty('z-index' , `${data.order}`,'')
    }
    pic.style.setProperty('transform-origin', `${data.cx}px ${data.cy}px`,'')
  }

  // ----------
  // Image view

  create_image(data){
    const pic = this.pic
    const img = new Image()
    img.onload = this.loaded_image.bind(this)
    img.src = data.src
    pic.appendChild(img)
  }

  // 親要素の取得
  get_parent(uuid){
    return this.options.root.querySelector(`.pic[data-uuid='${uuid}']`) || this.options.scale
  }

  
  // 読み込み後の画像ファイルの扱い（現在なにもしない）
  loaded_image(e){
    const img = e.target
  
  }

  // ----------
  // Shape view
  is_shape_use(data){
    return data && data.shape_use === 1 ? true : false
  }

  get_table(){
    return this.image_data.shape_table
  }

  create_shape(data){
    const shape = document.createElement('div')
    shape.className = 'shape'
    const shapes = this.set_shapes(data)
    for(let shape_item of shapes){
      shape.appendChild(shape_item)
    }
    this.pic.appendChild(shape)
    this.options.data.images[data.num].shape_splits = shapes
    this.options.data.images[data.num].shape_points = this.get_shape_points(data.uuid)
  }

  set_shapes(data){
    const d ={
      num : 0,
      w   : data.w / data.shape_table.x,
      h   : data.h / data.shape_table.y,
    }
    const shapes = []
    for(let i=0; i<data.shape_table.y; i++){
      const y = i * d.h
      for(let j=0; j<data.shape_table.x; j++){
        const x = j * d.w
        const shape_item = this.get_shape_item(
          x, y, d.w, d.h,
          data,
          d.num
        )
        shapes.push(shape_item)
        d.num++
      }
    }
    return shapes

    // shapeアニメーション用イベントセット
    // this.pic.addEventListener('animationstart' , ((e)=>{
    //   console.log('anim-start',e)
    // }).bind(this))
    // this.pic.addEventListener('animationiteration' , ((e)=>{
    //   console.log('anim-end',e)
    // }).bind(this))
    
    // this.animation.animation_init()
  }

  get_shape_item(x,y,w,h,data,num){
    const div = document.createElement('div')
    div.className = 'shape-item'
    // セグメントラインが出ないための１ピクセル余分に表示（右と下のライン）
    const width  = w
    const height = h
    div.style.setProperty('width'  , `${width}px` , '')
    div.style.setProperty('height' , `${height}px` , '')
    div.style.setProperty('left'   , `${x}px` , '')
    div.style.setProperty('top'    , `${y}px` , '')
    div.style.setProperty('transform-origin' , `-${x}px -${y}px` , '')
    const img = new Image()
    img.src = data.src
    img.style.setProperty('width'  , `${data.w}px` , '')
    img.style.setProperty('height' , `${data.h}px` , '')
    img.style.setProperty('left'   , `-${x}px` , '')
    img.style.setProperty('top'    , `-${y}px` , '')
    div.appendChild(img)
    div.setAttribute('data-num' , num)
    return div
  }

  // // ----------
  // // Shape animation

  // set_shape_event(pic){
  //   pic.addEventListener('animationstart'     , this.animation.play.bind(this.animation))
  //   pic.addEventListener('animationiteration' , this.animation.play.bind(this.animation))
  //   pic.addEventListener('animationcancel'    , this.animation.stop.bind(this.animation))
  // }

  // set_shape_animation(){
  //   const names = this.get_animation_names()
  //   if(!names.length){return}
  //   for(let name of names){
  //     this.anims[name] = this.get_property(name)
  //   }
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


}