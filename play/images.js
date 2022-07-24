import { Shape }     from './shape.js'

export class Images{
  constructor(root , elm , data){
    this.root = root
    this.elm  = elm
    this.data = data
    this.view_images()
  }

  // 個別画像の表示設定
  view_images(){
    for(let data of this.data.images){
      const parent = this.get_parent(data)
      this.pic = document.createElement('div')
      this.set_image(this.pic , data)
      parent.appendChild(this.pic)
      this.pic.className = 'pic'
      this.pic.setAttribute('data-uuid' , data.uuid)
      if(data.shape_use === 1){
        new Shape(this.pic , data)
      }
      else{
        this.view_image(this.pic , data)
      }
    }
  }
  view_image(pic , data){
    const img = new Image()
    img.onload = this.loaded_image.bind(this)
    img.src = data.src
    pic.appendChild(img)
  }

  // 親要素の取得
  get_parent(data){
    if(data.parent){
      return this.elm.querySelector(`.pic[data-uuid='${data.parent}']`)
    }
    else{
      return this.root
    }
  }

  // 画像のtransform設定
  set_image(elm , data){
    elm.style.setProperty('top'     , `${data.y}px`,'')
    elm.style.setProperty('left'    , `${data.x}px`,'')
    elm.style.setProperty('width'   , `${data.w}px`,'')
    elm.style.setProperty('height'  , `${data.h}px`,'')
    if(data.order){
      elm.style.setProperty('z-index' , `${data.order}`,'')
    }
    elm.style.setProperty('transform-origin', `${data.cx}px ${data.cy}px`,'')
  }

  // 読み込み後の画像ファイルの扱い（現在なにもしない）
  loaded_image(e){
    const img = e.target
  
  }
}