export class Scale{
  constructor(root){
    if(!root){return}
    const fit  = this.fit_images(root)
    const rate = this.get_rate_contain(root , fit)
    this.set_scale_contain(root , rate , fit)
  }
  get_scale_element(root){
    return root.querySelector(':scope > .scale')
  }

  fit_images(root){
    const scale = this.get_scale_element(root)
    if(!scale){return}
    const root_rect = root.getBoundingClientRect()
    const pics = scale.querySelectorAll('.pic')
    const image_corner = {
      left   : null,
      right  : null,
      top    : null,
      bottom : null,
    }
    for(let pic of pics){
      const pic_rect = pic.getBoundingClientRect()
      const x = pic_rect.left - root_rect.left
      const y = pic_rect.top  - root_rect.top
      const w = pic_rect.width
      const h = pic_rect.height
      
      // 左
      if(image_corner.left === null
      || x < image_corner.left){
        image_corner.left = x
      }
      // 右
      if(image_corner.right === null
        || x + w > image_corner.right){
          image_corner.right = x + w
        }

      // 上
      if(image_corner.top === null
      || y < image_corner.top){
        image_corner.top = y
      }

      // 下
      if(image_corner.bottom === null
      || y + h > image_corner.bottom){
        image_corner.bottom = y + h
      }
    }
    image_corner.width  = image_corner.right  - image_corner.left
    image_corner.height = image_corner.bottom - image_corner.top
    return image_corner
  }

  get_rate_contain(root , fit){
    const root_size = {
      w : root.clientWidth,
      h : root.clientHeight,
    }
    const rate = {
      w : root_size.w / fit.width,
      h : root_size.h / fit.height,
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

  // scale値の自動設定（rootに合わせる） object-contain
  set_scale_contain(root , scale , fit){
    const elm = this.get_scale_element(root)
    scale = Number(scale.toFixed(2))
    if(!scale){return}
    const w = fit.width * scale
    const h = fit.height * scale
    const x = fit.left * -1
    const y = fit.top * -1
    elm.style.setProperty('width'           ,`${w}px`,'')
    elm.style.setProperty('height'          ,`${h}px`,'')
    elm.style.setProperty('transform-origin',`0 0`,'')
    elm.style.setProperty('transform'       ,`scale(${scale}) translateX(${x}px) translateY(${y}px)`,'')
  }
}