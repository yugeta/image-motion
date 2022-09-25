import { Matrix }    from './matrix.js'
import { MatrixCanvas }    from './matrix_canvas.js'

export class Shape{
  constructor(options){
    this.options = options || {}
    this.anims   = this.options.data.animations
    this.set()
  }

  set(){
    const animations = this.options.data.animations
    for(let animation_name in animations){
      for(let image_uuid in animations[animation_name].items){
        const keyframes = this.get_keyframes(animation_name , image_uuid)
        if(!keyframes){continue}
        const image_data = this.get_image_data(image_uuid)
        if(!image_data || !image_data.shape_use){continue}
        if(!this.is_shape_animation(animation_name , image_uuid)){continue}
        const datas = this.get_shape_datas(keyframes , image_uuid)
        const new_datas = this.get_complement_datas(datas)
        this.set_keyframes(animation_name ,image_uuid , new_datas)
      }
    }
  }

  get_image_data(uuid){
    return this.options.data.images.find(e => e.uuid === uuid)
  }
  // shapeアニメーションがkeyframe内に存在するか確認
  is_shape_animation(animation_name , uuid){
    const keyframes = this.get_keyframes(animation_name , uuid)
    for(let keyframe in keyframes){
      if(keyframes[keyframe].shape){
        return true
      }
    }
  }

  get_keyframes(animation_name , uuid){
    return this.options.data.animations[animation_name].items[uuid].keyframes
  }

  // shapeデータの取得
  get_shape_datas(keyframes , uuid){
    const datas = []
    for(let keyframe in keyframes){
      keyframe = Number(keyframe)
      if(keyframes[keyframe].shape === undefined){continue}
      datas.push({
        uuid     : uuid,
        keyframe : keyframe,
        value    : keyframes[keyframe].shape,
      })
    }
    return datas
  }

  // ポイントの無いキーフレームのデータを補完する
  get_complement_datas(datas){
    const new_datas = {}

    // フレーム毎にrateと値をセットする
    let status = null
    let start  = null
    let end    = null
    let rate   = 1
    let value  = null
    for(let keyframe=0; keyframe<=100; keyframe++){
      const data = datas.find(e => e.keyframe === keyframe)
      if(data === undefined){
        status = 'between'
        end    = this.get_next_keyframe(datas , keyframe)
        rate   = this.get_keyframe_rate(start , end , keyframe)
        value  = this.get_keyframe_value(datas , start , end , rate)
      }
      else{
        status = 'no-exist'
        start  = keyframe
        end    = keyframe
        // value  = data.value
        // rate   = null
        // rate   = this.get_keyframe_rate(start , end , keyframe)
        value  = this.get_keyframe_value(datas , start , end , rate)
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

  set_keyframes(animation_name , image_uuid , new_datas){
    const keyframes = this.get_keyframes(animation_name , image_uuid)

    // 計算結果の値を書き込む
    for(let keyframe in new_datas){
      if(new_datas[keyframe].status === 'exist'){continue}
      keyframes[keyframe]       = keyframes[keyframe] || {}
      keyframes[keyframe].shape = new_datas[keyframe].value
    }
  }

  get_next_keyframe(datas , keyframe){
    for(let data of datas){
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

  get_keyframe_value(datas , start , end , rate){
    const start_data = datas.find(e => e.keyframe === start) || {}
    const end_data   = datas.find(e => e.keyframe === end  ) || {}
    const start_val  = start_data.value
    const end_val    = end_data.value
    // if(start === null){
    //   // console.log('end',end_val)
    //   return end_val
    // }
    // else if(end === undefined){
    //   // console.log('start',start_val)
    //   return start_val
    // }
    // else if(!rate){
    //   return start
    // }
    if(!rate){
      return start
    }
    else{
      const start_points = start_data.value.points
      const end_points   = end_data.value .points
      return this.get_martix_datas(start_points , end_points , rate , start_data.uuid)
    }
  }

  get_martix_datas(start_points , end_points , rate , uuid){
    const matrix_datas = []
    const canvas_datas = []
    const point_datas = []
    for(let num=0; num<start_points.length; num++){
      const next_positions = this.get_shape_next_points(start_points[num] , end_points[num] , rate)
      const base_points    = this.get_base_points(uuid , num)
      if(!base_points){continue}
      const matrix = new Matrix(base_points , next_positions)
      matrix_datas.push(matrix)
      point_datas.push(next_positions)
      const canvas = new MatrixCanvas(base_points , next_positions)
      canvas_datas.push(canvas)
    }
    return {
      matrix : matrix_datas,
      points : point_datas,
      canvas : canvas_datas,
    }
  }

  get_shape_next_points(start_points , end_points , rate){
    const points = []
    for(let num=0; num<start_points.length; num++){
      points.push({
        x : start_points[num].x + (end_points[num].x - start_points[num].x) * rate,
        y : start_points[num].y + (end_points[num].y - start_points[num].y) * rate,
      })
    }
    return points
  }

  get_shape_splits(uuid){
    return this.options.shapes[uuid]
  }

  get_base_points(uuid , num){
    if(!this.options.data.shape[uuid] || !this.options.data.shape[uuid][num]){return}
    return this.options.data.shape[uuid][num].corners

  }


}
