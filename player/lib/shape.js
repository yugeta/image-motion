// import { ShapeAnimation } from './shape_animation.js'

export class Shape{
  constructor(options){
    
  }



  // constructor(pic , image_data , full_data){
  //   if(!this.is_shape_use(image_data)){return}
  //   this.uuid = image_data.uuid
  //   this.pic = pic
  //   this.image_data = image_data
  //   this.full_data  = full_data
  //   this.create_shape(image_data)
    
  //   // this.init()
  // }

  is_shape_use(image_data){
    return image_data && image_data.shape_use === 1 ? true : false
  }

  // init(){
  //   this.create_shape(this.image_data)
  // }

  create_shape(data){
    const shape = document.createElement('div')
    shape.className = 'shape'
    this.pic.appendChild(shape)
    const table = this.get_table()
    let image_num = 0
    const w       = data.w / table.x
    const h       = data.h / table.y
    for(let i=0; i<table.y; i++){
      const y = i * h
      for(let j=0; j<table.x; j++){
        const x = j * w
        this.set_element(shape , data.src , x,y,w,h,data,image_num)
        image_num++
      }
    }
    // shapeアニメーション用イベントセット
    // this.pic.addEventListener('animationstart' , ((e)=>{
    //   console.log('anim-start',e)
    // }).bind(this))
    // this.pic.addEventListener('animationiteration' , ((e)=>{
    //   console.log('anim-end',e)
    // }).bind(this))
    this.animation = new ShapeAnimation(this.pic , this.full_data)
    this.pic.addEventListener('animationstart'     , this.animation.play.bind(this.animation))
    this.pic.addEventListener('animationiteration' , this.animation.play.bind(this.animation))
    this.pic.addEventListener('animationcancel'    , this.animation.stop.bind(this.animation))
    // this.animation.animation_init()
  }

  get_table(){
    return this.image_data.shape_table
  }

  set_element(shape_elm,src,x,y,w,h,data,num){
    const div = document.createElement('div')
    div.className = 'shape-item'
    // セグメントラインが出ないための１ピクセル余分に表示（右と下のライン）
    const width  = w
    const height = h
    div.style.setProperty('width'  , `${width}px` , '')
    div.style.setProperty('height' , `${height}px` , '')
    div.style.setProperty('left'   , `${x}px` , '')
    div.style.setProperty('top'    , `${y}px` , '')
    const transform_origin = `-${x}px -${y}px`
    div.style.setProperty('transform-origin' , transform_origin , '')
    const img = document.createElement('img')
    img.src = src
    img.style.setProperty('width'  , `${data.w}px` , '')
    img.style.setProperty('height' , `${data.h}px` , '')
    img.style.setProperty('left'   , `-${x}px` , '')
    img.style.setProperty('top'    , `-${y}px` , '')
    div.appendChild(img)
    shape_elm.appendChild(div)
    div.setAttribute('data-num' , num)
  }


  // animation_init(){
  //   console.log(this.full_data)
  //   // this.anim_time = 
  // }
  // animation_play(e){
  //   console.log(this.uuid)
  // }

  // animation_stop(e){

  // }

}
