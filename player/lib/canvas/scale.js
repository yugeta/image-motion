export class Scale{
  constructor(options){
    if(!options){return}
    this.datas  = {}
    this.root   = options.root
    this.images = options.data.images
    this.fit    = this.fit_images()
    this.scale  = this.get_rate_contain()
    // this.set_scale_contain()
    // this.finish()
  }
  get_scale_element(){
    return this.root.querySelector(':scope > .scale')
  }

  fit_images(){
    const scale = this.get_scale_element()
    if(!scale){return}

    const image_corner = {
      left   : null,
      right  : null,
      top    : null,
      bottom : null,
    }
    for(let image of this.images){
      const pos = this.get_pos(image.uuid)
      const x1  = pos.x
      const x2  = pos.x + image.w
      const y1  = pos.y
      const y2  = pos.y + image.h
      // console.log(image.uuid,x1,x2,y1,y2)
      // 左
      if(image_corner.left === null
      || x1 < image_corner.left){
        image_corner.left = x1
      }

      // 右
      if(image_corner.right === null
      || x2 > image_corner.right){
          image_corner.right = x2
        }

      // 上
      if(image_corner.top === null
      || y1 < image_corner.top){
        image_corner.top = y1
      }

      // 下
      if(image_corner.bottom === null
      || y2 > image_corner.bottom){
        image_corner.bottom = y2
      }
    }
    image_corner.width  = image_corner.right  - image_corner.left
    image_corner.height = image_corner.bottom - image_corner.top

    this.datas.image_corner = image_corner
    return image_corner
  }

  get_pos(uuid){
    const image = this.images.find(e => e.uuid === uuid)
    if(!image){return null}
    const parent = image.parent ? this.get_pos(image.parent) : {x:0,y:0}
    return {
      x : image.x + parent.x,
      y : image.y + parent.y,
    }
  }

  get_rate_contain(){
    const root_size = {
      w : this.root.clientWidth,
      h : this.root.clientHeight,
    }

    const rate = {
      w : root_size.w / this.fit.width,
      h : root_size.h / this.fit.height,
    }

    // 横合わせ
    if(rate.w < rate.h || !root_size.h){
      return rate.w
    }

    // 縦合わせ
    else{
      return rate.h
    }
  }

  // // scale値の自動設定（rootに合わせる） object-contain
  // set_scale_contain(){
  //   const elm = this.get_scale_element(this.root)
  //   this.scale = Number(this.scale.toFixed(2))
  //   if(!this.scale){return}
  //   const w = this.fit.width
  //   const h = this.fit.height
  //   const x = this.fit.left * -1
  //   const y = this.fit.top * -1
  //   elm.style.setProperty('width'  ,`${w}px`,'')
  //   elm.style.setProperty('height' ,`${h}px`,'')
  //   elm.style.setProperty('transform-origin',`0 0`,'')
  //   const transforms = []
  //   transforms.push(`scale(${this.scale})`)
  //   elm.style.setProperty('transform'       , transforms.join(' ') ,'')
  // }

  // // 処理完了
  // finish(){
  //   this.root.style.removeProperty('visibility')
  // }
}