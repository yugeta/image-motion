import { Options } from '../options.js'

export class Datas{

  get_all(){
    return Options.cache
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
    const datas = []
    const cache = this.get_all()
    for(let uuid in cache){
      const newData = {}
      for(let key in cache[uuid]){
        if(key === 'pic'
        || key === 'img'
        || key === 'list'
        || key === 'file'){continue}
        newData[key] = cache[uuid][key]
      }
      datas.push(newData)
    }
    return datas
  }

}