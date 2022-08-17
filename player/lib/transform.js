import { Options }   from '../options.js'

export class Transform{
  constructor(keyframes , per){
    this.keyframes = keyframes
    this.per  = Number(per)
    this.set_data(keyframes[per])
  }

  get data(){
    const data = []
    data.push(`translateX(${this.posx}px)`)
    data.push(`translateY(${this.posy}px)`)
    data.push(`translateZ(${this.posz}px)`)
    data.push(`scale(${this.scale})`)
    data.push(`rotate(${this.rotate}deg)`)
    return data.join(' ')
  }

  get_data(){
    return this.keyframes[this.per]
  }
  set_data(){
    const data = this.get_data()
    if(!data){return}
    for(let type of Options.transform_types){
      this[type] = this.get_transform(type) || 0
    }
  }

  get_transform(type){
    const data = this.get_data()
    if(type === 'posy'){
      console.log(data)
    }
    if(data[type] !== undefined){
      return data[type]
    }
    else{
      return this.get_between(type)
    }
  }
  get_between(type){
    if(this.is_setting(type)){
      return this.get_between_value(type)
    }
    else{
      return this.get_between_default(type)
    }
  }
  get_between_default(type){
    switch(type){
      case 'posx':
      case 'posy':
      case 'posz':
      case 'rotate':
        return 0
      case 'scale':
        return 1
    }
  }

  // 現在perの前後のperを求める [ before-per , after-per ]
  get_between_value(type){
    const pers     = this.get_per_before_after(type)
    // フレーム数が同じ値、または前方、後方のみ、の場合（前方値、高放置の場合）
    if(pers[0] === pers[1]){
      return this.get_value(type , pers[0])
    }
    if(pers[0] === null){
      return this.get_value(type , pers[1])
    }
    if(pers[1] === null){
      return this.get_value(type , pers[0])
    }

    // フレームの中間値を計算する。
    return this.get_value_calc(type , pers)
  }

  get_per_before_after(type){
    const data = [null , null]
    for(let per in this.keyframes){
      if(this.keyframes[per][type] === undefined){continue}
      per = Number(per)
      // before
      if(per < this.per){
        data[0] = per
      }
      // after
      else if(this.per < per){
        if(data[1] === null){
          data[1] = per
        }
        break
      }
      if(data[0] === null && per < this.per){
        data[0] = per
      }
      // after
      else if(data[1] === null && this.per < per){
        data[1] = per
        break
      }
    }
    return data
  }

  get_value(type , per){
    return this.keyframes[per][type]
  }

  get_value_calc(type , pers){
    const per_rate   = this.get_per_rate(pers)
    const before_val = this.get_value(type , pers[0])
    const after_val  = this.get_value(type , pers[1])
    const val        = (after_val - before_val) * per_rate
    // console.log(after_val +"-"+ before_val +"*"+ per_rate)
    return before_val + Number(val.toFixed(2))
  }

  get_per_rate(pers){
    const between_count = pers[1]  - pers[0]
    const current_count = this.per - pers[0]
    return current_count / between_count
  }



  get_between_value_posx(){
    return 0
  }
  get_between_value_posy(){
    return 0
  }
  get_between_value_scale(){
    return 1
  }
  get_between_value_rotate(){
    return 0
  }

  // データ全体で対象のtypeが存在しているか？ return : true（存在） , false（不在）
  is_setting(type){
    for(let per in this.keyframes){
      if(typeof this.keyframes[per][type] !== 'undefined'){return true}
    }
  }

  set_animation_data_move(datas){
    const value = this.get_animation_name_data(name , uuid , before_per , type)

    this.set_animation_data_value(name , uuid , after_per , type , value)
  }

}