import { Options } from '../options.js'

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
    return {
      images : images,
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

  get_animations(){
    return Options.animations
  }
  // get_animation_datas(){
  //   return this.get_animations()
  // }
  get_animation_name_datas(name){
    const datas = this.get_animations()
    if(!datas
    || !datas[name]){return null}
    return datas[name] || {}
  }
  get_animation_uuid(name , uuid){
    const datas = this.get_animation_name_datas(name)
    if(!datas
    || !datas.items
    || !datas.items[uuid]){return null}
    return datas.items[uuid] || {}
  }
  get_animation_per_datas(name , uuid , per){
    const datas = this.get_animation_uuid(name , uuid)
    if(!datas
    || !datas.keyframes
    || !datas.keyframes[per]){return null}
    return datas.keyframes[per] || {}
  }
  get_animation_name_data(name , uuid , per , type){
    const datas = this.get_animation_per_datas(name , uuid , per)
    if(!datas
    || !datas[type]){return null}
    return datas[type] || 0
  }
  get_animation_type_keyframes(name , uuid , type){
    const datas = this.get_animation_uuid(name , uuid)
    const res = {}
    if(datas && datas.keyframes){
      for(let per in datas.keyframes){
        if(!datas.keyframes
        || !datas.keyframes[per]
        || !datas.keyframes[per][type]){continue}
        res[per] = datas.keyframes[per][type]
      }
    }
    return res
  }

  get_animation_name_data_between(name , uuid , per , type){
    const num = this.get_animation_name_data(name , uuid , per , type)
    if(typeof num === 'number'){
      return num
    }
    const per_between_pers = this.get_per_between_pers(name , uuid , per , type)
    if(!per_between_pers || !per_between_pers.length){
      return 0
    }
    const between_num = this.get_calc_between_num(name , uuid , per , type , per_between_pers)
    // console.log(between_num)
    return between_num || 0
  }

  // animation値の取得（keyがない場合は、中間補正値を返す）
  get_per_between_pers(name , uuid , per , type){
    // const lists  = Options.elements.get_timeline_lists()
    // const points = lists.querySelectorAll('.point')
    // if(!points || !points.length){return}
    const pers = this.get_animation_type_keyframes(name , uuid , type)

    let prev = null
    let next = null
    for(let p in pers){
      // const num = pers[p]
      // const num = Number(point.getAttribute('data-num') || 0)
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
  // get_per_between_pers(per){
  //   const lists  = Options.elements.get_timeline_lists()
  //   const points = lists.querySelectorAll('.point')
  //   if(!points || !points.length){return}
  //   let prev = null
  //   let next = null
  //   for(let point of points){
  //     const num = Number(point.getAttribute('data-num') || 0)
  //     if(per === num){
  //       prev = num
  //       next = num
  //       break
  //     }
  //     if(num <= per){
  //       prev = num
  //     }
  //     else if(num >= per){
  //       next = num
  //       break
  //     }
  //   }
  //   if(prev === null && next === null){
  //     return null
  //   }
  //   else if(prev !== null && next === null){
  //     next = prev
  //   }
  //   else if(prev === null && next !== null){
  //     prev = next
  //   }
  //   return [prev , next]
  // }
  get_calc_between_num(name , uuid , per , type , pers){
    const num_prev    = this.get_animation_name_data(name , uuid , pers[0] , type)
    const num_next    = this.get_animation_name_data(name , uuid , pers[1] , type)
    const num_max     = num_next - num_prev
    const max_per     = pers[1] - pers[0]
    const current_per = per - pers[0]
    const rate        = current_per / max_per
    const num         = num_prev + num_max * rate
    return ~~(num * 100) / 100
  }

  add_animation(name , data){
    if(!name){return}
    const animations = this.get_animations()
    if(animations[name]){return}
    animations[name] = data
  }


}