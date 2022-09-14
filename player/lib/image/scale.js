export class Scale{
  constructor(options){
    if(!options){return}
    this.datas = {}
    this.root  = options.root
    this.images = options.data.images
    // console.log(this.images)
    this.fit   = this.fit_images()
    this.scale = this.get_rate_contain()
    this.set_scale_contain()
    this.finish(this.root)
  }
  get_scale_element(){
    return this.root.querySelector(':scope > .scale')
  }

  fit_images(){
    const scale = this.get_scale_element()
    if(!scale){return}
    const root_rect = this.root.getBoundingClientRect()
    // const pics = scale.querySelectorAll('.pic')
    const image_corner = {
      left   : null,
      right  : null,
      top    : null,
      bottom : null,
    }
    this.datas.pics = {}
    for(let image of this.images){
      const id = image.uuid
      this.datas.pics[id] = {}
      // const img = pic.querySelector('img')
      // const pic_rect = pic.getBoundingClientRect()
      // const x = pic_rect.left - root_rect.left
      // const y = pic_rect.top  - root_rect.top
      // const w = pic.offsetWidth
      // const h = pic.offsetHeight
      // const w = img.NaturalWidth
      // const h = img.naturalHeight
      
      // 左
      if(image_corner.left === null
      || image.x < image_corner.left){
        image_corner.left = image.x
      }
      // 右
      if(image_corner.right === null
      || image.x + image.w > image_corner.right){
          image_corner.right = image.x + image.w
        }

      // 上
      if(image_corner.top === null
      || image.y < image_corner.top){
        image_corner.top = image.y
      }

      // 下
      if(image_corner.bottom === null
      || image.y + image.h > image_corner.bottom){
        image_corner.bottom = image.y + image.h
      }

      // this.datas.pics[id] = pic_rect
      // this.datas.pics[id].elm = pic
      
      // this.datas.pics[id].naturalWidth  = img.naturalWidth
      // this.datas.pics[id].naturalHeight = img.naturalHeight
    }
    image_corner.width  = image_corner.right  - image_corner.left
    image_corner.height = image_corner.bottom - image_corner.top

    this.datas.image_corner = image_corner
    return image_corner
  }

  // fit_images(){
  //   const scale = this.get_scale_element()
  //   if(!scale){return}
  //   const root_rect = this.root.getBoundingClientRect()
  //   const pics = scale.querySelectorAll('.pic')
  //   const image_corner = {
  //     left   : null,
  //     right  : null,
  //     top    : null,
  //     bottom : null,
  //   }
  //   this.datas.pics = {}
  //   for(let pic of pics){
  //     const id = pic.getAttribute('data-uuid')
  //     this.datas.pics[id] = {}
  //     const img = pic.querySelector('img')
  //     const pic_rect = pic.getBoundingClientRect()
  //     const x = pic_rect.left - root_rect.left
  //     const y = pic_rect.top  - root_rect.top
  //     const w = pic.offsetWidth
  //     const h = pic.offsetHeight
  //     // const w = img.NaturalWidth
  //     // const h = img.naturalHeight
      
  //     // 左
  //     if(image_corner.left === null
  //     || x < image_corner.left){
  //       image_corner.left = x
  //     }
  //     // 右
  //     if(image_corner.right === null
  //       || x + w > image_corner.right){
  //         image_corner.right = x + w
  //       }

  //     // 上
  //     if(image_corner.top === null
  //     || y < image_corner.top){
  //       image_corner.top = y
  //     }

  //     // 下
  //     if(image_corner.bottom === null
  //     || y + h > image_corner.bottom){
  //       image_corner.bottom = y + h
  //     }

  //     this.datas.pics[id] = pic_rect
  //     this.datas.pics[id].elm = pic
      
  //     this.datas.pics[id].naturalWidth  = img.naturalWidth
  //     this.datas.pics[id].naturalHeight = img.naturalHeight
  //   }
  //   image_corner.width  = image_corner.right  - image_corner.left
  //   image_corner.height = image_corner.bottom - image_corner.top

  //   this.datas.image_corner = image_corner
  //   return image_corner
  // }

  get_rate_contain(){
    const root_size = {
      w : this.root.clientWidth,
      h : this.root.clientHeight,
    }
    const rate = {
      w : root_size.w / this.fit.width,
      h : root_size.h / this.fit.height,
    }
    // console.log('size',root_size,rate)
    // 横合わせ
    if(rate.w < rate.h || !root_size.h){
      return rate.w
    }
    // 縦合わせ
    else{
      return rate.h
    }
  }

  // scale値の自動設定（rootに合わせる） object-contain
  set_scale_contain(){
    const elm = this.get_scale_element(this.root)
    this.scale = Number(this.scale.toFixed(2))
    if(!this.scale){return}
    const w = this.fit.width  * this.scale
    const h = this.fit.height * this.scale
    const x = this.fit.left * -1
    const y = this.fit.top * -1
    elm.style.setProperty('width'           ,`${w}px`,'')
    elm.style.setProperty('height'          ,`${h}px`,'')
    elm.style.setProperty('transform-origin',`0 0`,'')
    // elm.style.setProperty('transform'       ,`scale(${this.scale}) translateX(${x}px) translateY(${y}px)`,'')
    const transforms = []
    transforms.push(`scale(${this.scale})`)
    // transforms.push(`translateX(${x}px)`)
    // transforms.push(`translateY(${y}px)`)
    elm.style.setProperty('transform'       , transforms.join(' ') ,'')
    console.log({
      root  : this.root,
      elm   : elm,
      scale : this.scale,
      x     : x,
      y     : y,
      w     : w,
      h     : h,
      fit   : this.fit,
      datas : this.datas,
    })
  }

  // 処理完了
  finish(root){
    root.style.removeProperty('visibility')
  }
}