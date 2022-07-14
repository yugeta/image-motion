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

}