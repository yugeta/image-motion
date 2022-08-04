import { Options }  from '../options.js'
import { M_Matrix } from '../shape/m_matrix.js'

export class Datas{

  get_all(){
    return Options.cache
  }

  set_cache(uuid , datas){
    if(!uuid || !datas){return}
    const cache = this.get_data(uuid)
    if(datas.constructor === Array){
      for(let data of datas){
        cache.push(data)
      }
    }
    else{
      for(let d in datas){
        cache[d] = datas[d]
      }
    }
    return cache
  }

  get_data(uuid){
    const data = this.get_all()
    if(typeof data[uuid] === 'undefined'){
      data[uuid] = {}
    }
    return data[uuid]
  }

  set_data(uuid , key , val){
    const data = this.get_data(uuid)
    data[key] = val
  }

  // set_data_shape_position(uuid , num , data){
  //   const data = this.get_data(uuid)
  //   data.shape_data = data.shape_data || []
  //   data.shape_data[num] = data
  // }

  get_save_data(){
    const images = []
    const items = Options.elements.get_image_lists()
    for(let item of items){
      const uuid = item.getAttribute('data-uuid')
      const newData = {}
      const data = this.get_data(uuid)
      for(let key in data){
        if(key === 'pic'
        || key === 'img'
        || key === 'list'
        || key === 'file'){continue}
        newData[key] = data[key]
      }
      images.push(newData)
    }
    const animations = this.get_animations()
    const shapes     = this.get_shapes()
    return {
      images     : images,
      animations : animations,
      shape      : shapes,
      // sort   : this.get_image_sorts()
    }
  }


  // get_image_sorts(){
  //   const lists = Options.elements.get_image_lists()
  //   if(!lists || !lists.length){return []}
  //   const res = []
  //   for(let list of lists){
  //     res.push(list.getAttribute('data-uuid'))
  //   }
  //   return res
  // }

  // ----------
  // Animation
  /* 
   * Options.animations = {
   *   "%animation-key" : {
   *     "duration" : 1,
   *     "timing"   : "linear",
   *     "count"    : "infinite",
   *     "direction": "normal",
   *     "items"    : {
   *       "%%image-uuid" : {
   *         "0(%animation-frame-number" : {
   *           "animation-type(rotate,posx,posy...)" : "%value"
   *         },
   *         "100" : {
   *           "animation-type(rotate,posx,posy...)" : "%value"
   *         }
   *       }
   *     }
   *   }
   * }
   */


  get_animations(){
    if(!Options.animations){return {}}

    // 空keyframeを削除する
    for(let key in Options.animations){
      if(!Options.animations[key]
      || !Options.animations[key].items){continue}
      for(let uuid in Options.animations[key].items){
        if(!Options.animations[key].items[uuid].keyframes){continue}
        for(let per in Options.animations[key].items[uuid].keyframes){
          if(!Object.keys(Options.animations[key].items[uuid].keyframes[per]).length){
            delete Options.animations[key].items[uuid].keyframes[per]
          }
        }
        if(!Object.keys(Options.animations[key].items[uuid].keyframes).length){
          delete Options.animations[key].items[uuid].keyframes
        }
        if(!Object.keys(Options.animations[key].items[uuid]).length){
          delete Options.animations[key].items[uuid]
        }
      }
      if(!Object.keys(Options.animations[key].items).length){
        delete Options.animations[key].items
      }
      if(!Object.keys(Options.animations[key]).length){
        delete Options.animations[key]
      }
    }

    return Options.animations
  }

  set_animation_header(name , key , value){
    if(!name || !key){return}
    const datas = this.get_animations()
    if(!datas[name]){return}
    if(value === '' || value === null || value === undefined){
      if(typeof datas[name][key] !== 'undefined'){
        delete datas[name][key]
      }
    }
    else{
      datas[name][key] = value
    }
  }

  get_animation_default_value(type){
    switch(type){
      case 'opacity':
        return 1.0
      default:
        return 0
    }
  }
  get_animation_name_datas(name){
    const datas = this.get_animations()
    if(!datas
    || typeof datas[name] === 'undefined'){return null}
    return datas[name] || {}
  }
  get_animation_uuid(name , uuid){
    const datas = this.get_animation_name_datas(name)
    if(!datas
    || !datas.items
    || typeof datas.items[uuid] === 'undefined'){return null}
    return datas.items[uuid] || {}
  }
  get_animation_per_datas(name , uuid , per){
    const datas = this.get_animation_uuid(name , uuid)
    if(!datas
    || !datas.keyframes
    || typeof datas.keyframes[per] === 'undefined'){return null}
    return datas.keyframes[per] || {}
  }
  get_animation_name_data(name , uuid , per , type){
    const datas = this.get_animation_per_datas(name , uuid , per)
    if(!datas || typeof datas[type] === 'undefined'){return null}
    return datas[type]
    // return datas[type] || this.get_animation_default_value(type)
  }
  del_animation_name_data(name , uuid , per , type){
    const datas = this.get_animation_per_datas(name , uuid , per)
    if(typeof datas[type] !== 'undefined'){
      delete datas[type]
      return true
    }
    else{
      return false
    }
  }
  get_animation_type_keyframes(name , uuid , type){
    const datas = this.get_animation_uuid(name , uuid)
    const res = {}
    if(datas && datas.keyframes){
      for(let per in datas.keyframes){
        if(!datas.keyframes
        || !datas.keyframes[per]
        || typeof datas.keyframes[per][type] === 'undefined'){continue}
        res[per] = datas.keyframes[per][type]
      }
    }
    return res
  }

  set_animation_data_move(name , uuid , type , before_per , after_per){
    const datas = this.get_animation_uuid(name , uuid)
    if(!datas || !datas.keyframes || !datas.keyframes[before_per]){return}
    const value = this.get_animation_name_data(name , uuid , before_per , type)
    delete datas.keyframes[before_per][type]
    this.set_animation_data_value(name , uuid , after_per , type , value)
  }

  get_animation_name_data_between(name , uuid , per , type){
    const num = this.get_animation_name_data(name , uuid , per , type)
    if(typeof num === 'number'){
      return num
    }
    const per_between_pers = this.get_per_between_pers(name , uuid , per , type)
    if(!per_between_pers || !per_between_pers.length){
      return this.get_animation_default_value(type)
    }
    const between_num = this.get_calc_between_num(name , uuid , per , type , per_between_pers)
    return between_num !== null ? between_num : this.get_animation_default_value(type)
  }
  get_animation_name_shape_between(name , uuid , per){
    // 対象フレーム数の値（データ）を取得
    const datas = this.get_animation_name_data(name , uuid , per , 'shape')
    if(datas){
      return datas
    }
    // 値なし
    const per_between_pers = this.get_per_between_pers(name , uuid , per , 'shape')
    if(!per_between_pers || !per_between_pers.length){
      return null
    }
    // フレーム数が同じ値の場合（前方値、高放置の場合）
    if(per_between_pers[0] === per_between_pers[1]){
      return this.get_animation_name_data(name , uuid , per_between_pers[0] , 'shape')
    }
    // フレームの中間値を計算する。
    return this.get_calc_between_shape(name , uuid , per , per_between_pers)
  }

  // animation値の取得（keyがない場合は、中間補正値を返す）
  get_per_between_pers(name , uuid , per , type){
    const pers = this.get_animation_type_keyframes(name , uuid , type)
    let prev = null
    let next = null
    for(let p in pers){
      if(per === p){
        prev = p
        next = p
        break
      }
      if(p <= per){
        prev = p
      }
      else if(p >= per){
        next = p
        break
      }
    }
    if(prev === null && next === null){
      return null
    }
    else if(prev !== null && next === null){
      next = prev
    }
    else if(prev === null && next !== null){
      prev = next
    }
    return [prev , next]
  }

  get_calc_between_num(name , uuid , per , type , pers){
    
    const num_prev    = this.get_animation_name_data(name , uuid , pers[0] , type)
    const num_next    = this.get_animation_name_data(name , uuid , pers[1] , type)
// console.log('get_calc_between_num',num_prev,num_next)
    // 先頭perよりも手前の場合
    if(per <= pers[0]){
      return num_prev
    }
    // 後方perよりも後ろの場合
    else if(per >= pers[1]){
      return num_next
    }

    // 中間ポイントの場合（中間値の計算）
    const num_max     = num_next - num_prev
    const max_per     = pers[1] - pers[0]
    const current_per = per - pers[0]
    const rate        = current_per / max_per
    const num         = num_prev + num_max * rate
    return ~~(num * 100) / 100
  }

  // shape : 中間ポイントの場合（中間値の計算）
  get_calc_between_shape(name , uuid , per , pers){
    const base_points  = this.get_shape_data(uuid)
    const data_prev    = this.get_animation_name_data(name , uuid , pers[0] , 'shape')
    const data_next    = this.get_animation_name_data(name , uuid , pers[1] , 'shape')

    // 基本値計算(rate)
    const max_per     = pers[1] - pers[0]
    const current_per = per - pers[0]
    const rate        = current_per / max_per

    // corner-point毎の中間座標の計算
    const datas = {
      points : [],
      matrix : [],
    }

    // ４隅ポイント(corner-point)
    for(let i=0; i<data_prev.points.length; i++){
      const prev = data_prev.points[i]
      const next = data_next.points[i]
      const pos = []
      for(let j=0; j<next.length; j++){
        pos.push({
          x : prev[j].x + (next[j].x - prev[j].x) * rate,
          y : prev[j].y + (next[j].y - prev[j].y) * rate,
        })
      }
      datas.points.push(pos)
    }

    for(let i=0; i<data_prev.matrix.length; i++){
      const matrix = new M_Matrix(base_points[i].corners , datas.points[i])
      datas.matrix.push(matrix)
    }

    return datas
  }

  add_animation(name , data){
    if(!name){return}
    const animations = this.get_animations()
    if(animations[name]){return}
    animations[name] = data
  }
  set_animation_data_default(name , type , value){
    const animations = this.get_animations()
    animations[name]       = animations[name] || {}
    animations[name][type] = value
  }
  set_animation_data_value(name , uuid , per , type , value){
    const animations = this.get_animations()
    animations[name]                                  = animations[name]                            || {}
    animations[name].items                            = animations[name].items                      || {}
    animations[name].items[uuid]                      = animations[name].items[uuid]                || {}
    animations[name].items[uuid].keyframes            = animations[name].items[uuid].keyframes      || {}
    animations[name].items[uuid].keyframes[per]       = animations[name].items[uuid].keyframes[per] || {}
    animations[name].items[uuid].keyframes[per][type] = value
  }

  remove_animation_data(name){
    const animations = this.get_animations()
    if(!animations[name]){return}
    delete animations[name]
  }

  // ----------
  // pos(sort) : [ 0:top-left , 1:top-right , 2:bottom-right , 3:bottom-left ]
  // pos(data) : { x , y  , w , h}
  // ベースpositionデータの保管（アニメーションデータは、animationsに保存する）
  /* Shape
   * Options.images = {
   *   "%image-uuid" : {
   *     "shape_use" : 1, // 使用フラグ:1 , 未使用:0
   *     "shape_table" : {
   *       "x"   : 2, // 横分割数
   *       "y"   : 2, // 縦分割数
   *     }
   *   }
   * }
   * 
   * Options.shapes = {
   *   "%image-uuid" : [// splitする分割画像分の座標データ（サイズは均等割りの為一括保持だが、今後のことも考えて個別に保持することにする）
   *     { // image-num (split-0 : top-left)
   *       "w" : %width,
   *       "h" : %height,
   *       "corners" : [
   *         {x: %pos-x, y: %pos-y}, // pos-0,
   *         {x: %pos-x, y: %pos-y}, // pos-1, 
   *         {x: %pos-x, y: %pos-y}, // pos-2, 
   *         {x: %pos-x, y: %pos-y}, // pos-3
   *       ]
   *     },
   *     ...
   *   ]
   * }
   */

  get_shapes(){
    Options.shapes = Options.shapes || {}
    return Options.shapes
  }
  get_shape_data(uuid){
    const shapes = this.get_shapes()
    shapes[uuid] = shapes[uuid] || {}
    return shapes[uuid]
  }
  set_shape_data(uuid , key , value){
    const shapes = this.get_shape_data(uuid)
    // console.log(JSON.stringify(shapes))
    shapes[key] = value
  }

  get_shape_image(uuid , image_num){
    const shapes = this.get_shape_data(uuid)
    shapes[image_num] = shapes[image_num] || {}
    return shapes[image_num]
  }

  set_shape_image(uuid , image_num , key , value){
    const shapes = this.get_shape_data(uuid)
    shapes[image_num] = shapes[image_num] || {}
    shapes[image_num][key] = value
  }
  set_shape_corner(uuid , image_num , corner_num , pos){
    const shapes = this.get_shape_data(uuid)
    shapes[image_num] = shapes[image_num] || {}
    shapes[image_num].corners = shapes[image_num].corners || Array(4)
    shapes[image_num].corners[corner_num] = pos
  }
  set_shape_corners(uuid , image_num , pos_arr){
    for(let i=0; i<pos_arr.length; i++){
      this.set_shape_corner(uuid , image_num , i , pos_arr[i])
    }
  }


  get_shape_use(uuid){
    const data = this.get_data(uuid)
    return  data.shape_use ? 1 : 0
  }
  set_shape_use(uuid , flg){
    const data = this.get_data(uuid)
    data.shape_use = flg
  }
  get_shape_table(uuid){
    const data = this.get_data(uuid)
    data.shape_table = data.shape_table || {}
    return {
      x : data.shape_table.x || 1,
      y : data.shape_table.y || 1,
    }
  }
  set_shape_table(uuid , xy){
    const data = this.get_data(uuid)
    data.shape_table = data.shape_table || {}
    xy = xy || {}
    data.shape_table = {
      x : xy.x || 1,
      y : xy.y || 1,
    }
  }

  remove_animation_shape_data(uuid){
    const animation_datas = this.get_animations()
    if(!animation_datas){return}
    for(let animation_name in animation_datas){
      const animation_data = animation_datas[animation_name]
      if(!animation_data.items
      || !animation_data.items[uuid]
      || !animation_data.items[uuid].keyframes){continue}
      for(let key_num in animation_data.items[uuid].keyframes){
        const key_data = animation_data.items[uuid].keyframes[key_num]
        if(!key_data.shape){continue}
        console.log(animation_name , key_num,key_data)
        delete key_data.shape
      }
    }
  }



}