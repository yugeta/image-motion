
/**
 * アニメーションデータから、cssのtransform値を取得する
 * new ModelsElementsTransform(data).value
 */

export class ModelsElementsTransform{
  constructor(data){
    data = data || {}
    this.posx   = data.posx
    this.posy   = data.posy
    this.posz   = data.posz
    this.scale  = data.scale
    this.rotate = data.rotate
  }

  get value(){
    const transforms = []
    if(this.posx !== undefined){
      transforms.push(`translateX(${this.posx}px)`)
    }
    if(this.posy !== undefined){
      transforms.push(`translateY(${this.posy}px)`)
    }
    if(this.posz !== undefined){
      transforms.push(`translateZ(${this.posz}px)`)
    }
    if(this.scale !== undefined){
      transforms.push(`scale(${this.scale})`)
    }
    if(this.rotate !== undefined){
      transforms.push(`rotate(${this.rotate}deg)`)
    }
    return transforms.join(' ')
  }

}