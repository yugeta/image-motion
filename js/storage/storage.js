import { Options } from '../options.js'

export class Storage{
  constructor(){
    this.name = Options.storage_name
    this.cache = this.load()
    // this.init()
  }

  // init(){
  //   if(Options.header){
  //     if(this.cache.scale){
  //       Options.header.set_init_value(this.cache.scale)
  //     }
  //   }
  // }

  load(){
    const json = localStorage.getItem(this.name)
    if(!json){return {}}
    return JSON.parse(json)
  }
  save(){
    if(!this.cache){return}
    const data = JSON.stringify(this.cache)
    localStorage.setItem(this.name , data)
  }

  get_data(key){
    return this.cache[key]
  }

  set_data(key , value){
    this.cache[key] = value
    this.save()
  }
  
}