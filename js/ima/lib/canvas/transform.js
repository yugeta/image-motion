import { Shape } from './shape.js'

export class Transform{
  constructor(options , uuid , animation_name='' , keyframe=0){
    if(!options){return}
    this.options        = options
    this.uuid           = uuid
    this.animation_name = animation_name
    this.keyframe       = keyframe
    this.transform      = this.get_transform(uuid)
    this.shape_data     = this.set_shape()
    this.set_gap_tmp()
    // console.log(animation_name,keyframe,this.gap_tmp)
  }

  get image(){
    return this.transform.image
  }
  get rotate(){
    return this.deg(this.transform.rotate || 0)
  }
  get scale(){
    return this.transform.scale
  }
  get opacity(){
    return this.transform.opacity
  }
  get x(){
    return this.transform.x
  }
  get y(){
    return this.transform.y
  }
  get z(){
    return this.transform.z
  }
  get w(){
    return this.transform.w
  }
  get h(){
    return this.transform.h
  }
  get ox(){
    return this.transform.ox
  }
  get oy(){
    return this.transform.oy
  }
  get left(){
    return this.transform.ox
  }
  get top(){
    return this.transform.oy
  }
  get shape(){
    return this.shape_data
  }
  get animation_corners(){
    return this.transform.anim_corners
  }
  get gap(){
    return this.gap_tmp
  }

  is_hidden(){
    // scale=0
    if(this.transform.scale === 0){
      return true
    }
    if(this.transform.opacity === 0){
      return true
    }
  }

  // 四隅の回転座標を取得（通常画像）
  set_gap_tmp(){
    const shape_gap = this.shape_data.gap || {min:{x:0,y:0},max:{x:0,y:0}}
    // const shape_gap = {min:{x:0,y:0},max:{x:0,y:0}}
    // console.log(shape_gap)
    this.gap_tmp = {min:{x:0,y:0},max:{x:0,y:0}}
    // this.gap_tmp = shape_gap
    if(this.is_hidden() === true){return}

    // 左上
    const left_top = this.rotate_pos(
      this.transform.ox * this.transform.scale + shape_gap.min.x,
      this.transform.oy * this.transform.scale + shape_gap.min.y,
      this.transform.rotate || 0,
    )
    this.put_gap_tmp(left_top)

    // 右上
    const right_top = this.rotate_pos(
      this.transform.ox * this.transform.scale + this.transform.w * this.transform.scale + shape_gap.max.x,
      this.transform.oy * this.transform.scale + shape_gap.min.y,
      this.transform.rotate || 0,
    )
    this.put_gap_tmp(right_top)

    // 左下
    const left_bottom = this.rotate_pos(
      this.transform.ox * this.transform.scale + shape_gap.min.x,
      this.transform.oy * this.transform.scale + this.transform.h * this.transform.scale + shape_gap.max.y,
      this.transform.rotate || 0,
    )
    this.put_gap_tmp(left_bottom)

    // 右下
    const right_bottom = this.rotate_pos(
      this.transform.ox * this.transform.scale + this.transform.w * this.transform.scale + shape_gap.max.x,
      this.transform.oy * this.transform.scale + this.transform.h * this.transform.scale + shape_gap.max.x,
      this.transform.rotate || 0,
    )
    this.put_gap_tmp(right_bottom)
  }
  put_gap_tmp(data){
    const fit = this.options.scale.fit
    const min = {
      x : this.transform.x + data.x - fit.left,
      y : this.transform.y + data.y - fit.top,
    }
    const max = {
      x : this.transform.x + data.x - fit.left - fit.width,
      y : this.transform.y + data.x - fit.top  - fit.height,
    }
    if(min.x < this.gap_tmp.min.x){
      this.gap_tmp.min.x = min.x
    }
    if(min.y < this.gap_tmp.min.y){
      this.gap_tmp.min.y = min.y
    }
    if(max.x > this.gap_tmp.max.x){
      this.gap_tmp.max.x = max.x
    }
    if(max.y > this.gap_tmp.max.y){
      this.gap_tmp.max.y = max.y
    }
  }


  get_transform(uuid){
    const data = this.get_uuid2images(uuid)
    // const gap  = this.gap ? this.gap.min : {x : 0, y : 0}
    const center = {
      x : data.cx,
      y : data.cy,
    }
    const anim = this.get_keyframe_data(uuid) || {}
    const res = {
      anim         : anim,
      image        : data.element,
      ox           : -center.x || 0,
      oy           : -center.y || 0,
      cx           : center.x  || 0,
      cy           : center.y  || 0,
      w            : data.w   || 0,
      h            : data.h   || 0,
      x            : ((data.x || 0) + (center.x || 0) + (this.get_value(uuid , 'posx') || 0)) || 0,
      y            : ((data.y || 0) + (center.y || 0) + (this.get_value(uuid , 'posy') || 0)) || 0,
      z            : this.get_value(uuid , 'posz') || 0,
      rotate       : this.get_value(uuid , 'rotate') || 0,
      anim_corners : anim.shape && anim.shape.points ? anim.shape.points : [],
      opacity      : this.get_value(uuid , 'opacity') ?? 1,
      scale        : this.get_value(uuid , 'scale') ?? 1,
    }
    // console.log(res)
    // console.log(this.get_value(uuid , 'posx'), this.get_value(uuid , 'posy'), this.get_value(uuid , 'posz'))

    if(data.parent){
      const parent_data = this.get_transform(data.parent)
      const ps    = parent_data.scale ?? 1
      const px    = parent_data.x || 0
      const py    = parent_data.y || 0
      const pox   = parent_data.ox || 0
      const poy   = parent_data.oy || 0
      const pr    = parent_data.rotate || 0
      const po    = parent_data.opacity ?? 1
      res.opacity = res.opacity * po
      res.scale   = res.scale   * ps
      res.rotate += pr || 0
      if(pr){
        const rotate_pos = this.rotate_pos(
          res.x + pox ,
          res.y + poy,
          pr,
        )
        res.x = px + (rotate_pos.x || 0) * ps
        res.y = py + (rotate_pos.y || 0) * ps
      }
      else{
        res.x = px + pox + res.x * ps
        res.y = py + poy + res.y * ps
      }
    }
    return res
  }

  // uuidからimageデータを取得
  get_uuid2images(uuid){
    if(!uuid){return}
    return this.options.data.images.find(e => e.uuid === uuid)
  }

  // nameとkeyframeから、animationデータの取得
  get_animation_data(uuid){
    if(!uuid){return}
    const name = this.animation_name
    const anim = this.options.data.animations
    if(anim
    && anim[name]
    && anim[name].items
    && anim[name].items[uuid]
    && anim[name].items[uuid].keyframes){
      return anim[name].items[uuid].keyframes
    }
  }
  get_keyframe_data(uuid){
    if(!uuid){return}
    const data = this.get_animation_data(uuid)
    return data ? data[this.keyframe] : null
  }
  get_keyframe_type(uuid , type){
    const data = this.get_keyframe_data(uuid)
    if(data && data[type] !== undefined){
      return data[type]
    }
    else{
      return null
    }
  }

  // 回転角度による子階層の座標の求め方
  rotate_pos(x, y, rotate) {
    const deg = this.deg(rotate)
    var sin = Math.sin(deg)
    var cos = Math.cos(deg)
    return {
      x : x * cos - y * sin,
      y : x * sin + y * cos,
    }
  }

  // 回転値を角度からdeg情報に変換
  deg(rotate){
    return rotate * Math.PI / 180
  }

  // 対象のanimation-typeが、keyframeでの値を取得する。値が無い場合は、between値を返す
  get_value(uuid , animation_type){
    const keyframe_data  = this.get_keyframe_type(uuid , animation_type)
    const value = keyframe_data ?? this.get_between_value(uuid , animation_type)
    return value
  }
  get_between_value(uuid , animation_type){
    const datas = []
    const anim_datas = this.get_animation_data(uuid)
    if(anim_datas){
      for(const keyframe in anim_datas){
        if(anim_datas[keyframe][animation_type] === undefined){continue}
        const value = anim_datas[keyframe][animation_type]
        datas.push({
          frame : Number(keyframe),
          value : this.get_default_value(animation_type , value),
        })
      }
    }

    

    // 値がない場合は、デフォルト値を返す
    if(!datas.length){
      return
    }

    // 値が1つしかセットされていない場合は、セットされている単一値を返す
    if(datas.length === 1){
      return datas[0].value
    }

    // keyframeが先頭データよりも前の場合は、先頭データ値を返す
    if(datas[0].frame > this.keyframe){
      return datas[0].value
    }

    // keyframeが最終データよりも後の場合は、先頭データ値を返す
    if(datas[datas.length-1].frame < this.keyframe){
      return datas[datas.length-1].value
    }

    // 中間値の値をframe比率に応じて返す
    datas.push({
      frame : this.keyframe,
      value : 'test'
    })
    datas.sort((a,b)=>{
      if(a.frame < b.frame){
        return -1;
      }
      if(a.frame > b.frame){
        return +1;
      }
      return 0;
    })
    const index = datas.findIndex(e => e.frame === this.keyframe)
    if(index === -1){return}
    if(index === 0){
      return datas[1].value
    }
    const current = datas[index]
    const prev = datas[index-1]
    const next = datas[index+1]
    const rate = (current.frame - prev.frame) / (next.frame - prev.frame)
    const diff = next.value - prev.value
    const value = diff * rate + prev.value
    return value
  }

  set_shape(){
    return new Shape(
      this.options,
      this.uuid,
      this.animation_name,
      this.keyframe,
    )
  }

  get_default_value(animation_type , value){
    switch(animation_type){
      case 'rotate':
        return value || 0
      default:
        return value
    }
  }
  

}