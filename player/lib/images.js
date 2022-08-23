import { Scale } from './scale.js'

export class Images{
  constructor(options){
    this.options = options
    this.image_count  = this.options.data.images.length
    this.loaded_count = 0
    this.view_images()
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
    this.check_count(img.parentNode.getAttribute('data-uuid'))
  }

  // ----------
  // Shape view
  is_shape_use(data){
    return data && data.shape_use === 1 ? true : false
  }

  get_table(data){
    return {
      x : data.shape_table.x || 1,
      y : data.shape_table.y || 1,
    }
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
    const table = this.get_table(data)
    const d ={
      num : 0,
      w   : data.w / (table.x || 1),
      h   : data.h / (table.y || 1),
    }
    const shapes = []
    for(let i=0; i<table.y; i++){
      const y = i * d.h
      for(let j=0; j<table.x; j++){
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
  }

  get_shape_item(x,y,w,h,data,num){
    const div = document.createElement('div')
    div.className = 'shape-item'
    div.setAttribute('data-num' , num)
    data.shape_num = num
    // セグメントラインが出ないための１ピクセル余分に表示（右と下のライン）
    const width  = w
    const height = h
    div.style.setProperty('width'  , `${w + 1}px` , '')
    div.style.setProperty('height' , `${h + 1}px` , '')
    div.style.setProperty('left'   , `${x}px` , '')
    div.style.setProperty('top'    , `${y}px` , '')
    div.style.setProperty('transform-origin' , `-${x}px -${y}px` , '')

    const img = this.get_shape_item_img(
      x, 
      y, 
      w, 
      h,
      data)
    div.appendChild(img)
    
    return div
  }
  
  get_shape_item_img(x,y,w,h , data){
    const img = new Image()
    if(data.shape_num === 0){
      img.onload = this.check_count.bind(this,data.uuid)
    }
    img.src = data.src
    img.style.setProperty('left'   , `-${x}px` , '')
    img.style.setProperty('top'    , `-${y}px` , '')
    
    return img
  }
  check_count(uuid){
    this.loaded_count++
    // すべての画像が表示完了したらscale処理をする
    if(this.image_count <= this.loaded_count){
      new Scale(this.options.root)
    }
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
}