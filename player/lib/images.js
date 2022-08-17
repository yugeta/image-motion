// import { Shape }     from './shape.js'
import { Scale } from './scale.js'

export class Images{
  constructor(options){//console.log(options)
    this.options = options
    this.image_count  = this.options.data.images.length
    this.loaded_count = 0
    this.view_images()
    // new Scale(options.root , options.scale)
  }

  // 個別画像の表示設定
  view_images(){
    const images = this.options.data.images
    let num = 0
    for(let data of images){
      // console.log(num,data.uuid)
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
      // const shape_item = shapes[i]
      // console.log(shape_item)
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
    // console.log(data.uuid , d)
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
    // console.log(data,img.getAttribute('data-num'))
    if(data.shape_num === 0){
      img.onload = this.check_count.bind(this,data.uuid)
    }
    img.src = data.src

    // const pos_arr = [
    //   `${x}px ${y}px`,
    //   `${x + w + 1}px ${y}px`,
    //   `${x + w + 1}px ${y + h + 1}px`,
    //   `${x}px ${y + h + 1}px`,
    // ]
    // const clip = pos_arr.join(',')
    // img.style.setProperty('clip-path' , `polygon(${clip})` , '')

    // img.style.setProperty('width'  , `${w}px` , '')
    // img.style.setProperty('height' , `${h}px` , '')
    img.style.setProperty('left'   , `-${x}px` , '')
    img.style.setProperty('top'    , `-${y}px` , '')
    
    return img
  }
  check_count(uuid){
    // this.loaded_count = this.loaded_count || 0
    this.loaded_count++
    // console.log(uuid,this.image_count +"<="+ this.loaded_count)
    // すべての画像が表示完了したらscale処理をする
    if(this.image_count <= this.loaded_count){
      // console.log('callback:'+ this.image_count+"/"+this.loaded_count)
      new Scale(this.options.root)
    }
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