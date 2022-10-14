export class Datas{
  constructor(options){
    this.options = options || {}
    this.setting()
  }

  // animation-name別の内部データの事前計算処理
  setting(){
    const animations = this.options.data.animations
    for(let animation_name in animations){
      for(let image_uuid in animations[animation_name].items){
        const keyframes = animations[animation_name].items[image_uuid].keyframes
        if(!keyframes){continue}
        const anim_types = this.get_anim_types(keyframes)
        for(let type of anim_types){
          const datas = this.get_anim_type_datas(keyframes , type)
          const new_datas = this.get_complement_datas(type , datas)
          this.set_keyframes(animation_name ,image_uuid , type , new_datas)
        }
      }
    }
  }

  get_anim_types(keyframes){
    const types = []
    for(let keyframe in keyframes){
      for(let type in keyframes[keyframe]){
        if(this.options.style_types.indexOf(type) === -1){continue}
        if(types.indexOf(type) !== -1){continue}
        types.push(type)
      }
    }
    return types
  }

  get_anim_type_datas(keyframes , type){
    const datas = []
    for(let keyframe in keyframes){
      keyframe = Number(keyframe)
      if(keyframes[keyframe][type] === undefined){continue}

      datas.push({
        keyframe : keyframe,
        type     : type,
        value    : keyframes[keyframe][type],
      })
    }
    return datas
  }

  // ポイントの無いキーフレームのデータを補完する
  get_complement_datas(type , datas){
    const new_datas = {}

    // フレーム毎にrateと値をセットする
    let status = null
    let start  = null
    let end    = null
    let rate   = 1
    let value  = null
    for(let keyframe=0; keyframe<=100; keyframe++){
      const data = datas.find(e => e.keyframe === keyframe && e.type === type)
      if(data === undefined){
        status = 'between'
        end    = this.get_next_keyframe(datas , keyframe , type)
        rate   = this.get_keyframe_rate(start , end , keyframe)
        value  = this.get_keyframe_value(datas , type , start , end , rate)
      }
      else{
        status = 'exist'
        start  = keyframe
        end    = keyframe
        value  = data.value
        rate   = null
      }
      new_datas[keyframe] = {
        status : status,
        start  : start,
        end    : end,
        rate   : rate,
        value  : value,
      }
    }
    return new_datas
  }

  set_keyframes(animation_name , image_uuid , type , new_datas){
    const keyframes = this.options.data.animations[animation_name].items[image_uuid].keyframes
    // 計算結果の値を書き込む
    for(let keyframe in new_datas){
      if(new_datas[keyframe].status === 'exist'){continue}
      keyframes[keyframe]       = keyframes[keyframe] || {}
      keyframes[keyframe][type] = new_datas[keyframe].value
    }
  }

  get_next_keyframe(datas , keyframe , type){
    for(let data of datas){
      if(data.type !== type){continue}
      if(data.keyframe <= keyframe){continue}
      return data.keyframe
    }
  }

  get_keyframe_rate(start , end , keyframe){
    if(!(end - start)){
      return 0
    }
    else{
      return (keyframe - start) / (end - start)
    }
  }

  get_keyframe_value(datas , type , start , end , rate){
    const start_data = datas.find(e => e.keyframe === start && e.type === type) || {}
    const end_data   = datas.find(e => e.keyframe === end   && e.type === type) || {}
    const start_val  = this.get_default_value(type , start_data.value)
    const end_val    = this.get_default_value(type , end_data.value)
    if(start === null){
      return end_val
    }
    else if(end === undefined){
      return start_val
    }
    else if(!rate){
      return start
    }
    else{
      const val = start_val + (( end_val - start_val ) * rate)
      return val
    }
  }

  get_default_value(type , value){
    if(value !== undefined){return value}
    switch(type){
      case 'opacity':
        return 1
      default:
        return 0
    }
  }

  // 同じ値のkeyframeの羅列を削除する。（データ容量軽減処理）
  delete_same_keyframes(){
    const animations = this.options.data.animations
    for(let animation_name in animations){
      for(let image_uuid in animations[animation_name].items){
        const keyframes = animations[animation_name].items[image_uuid].keyframes
        if(!keyframes){continue}
        let prev_value = null
        for(let keyframe in keyframes){
          const value = JSON.stringify(keyframes[keyframe])
          if(prev_value === null){
            prev_value = value
            continue
          }
          if(value === prev_value){
            delete keyframes[keyframe]
          }
          else{
            prev_value = value
          }
        }
      }
    }
  }

}
