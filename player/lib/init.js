import { Options }  from '../options.js'
import { Uuid }     from './uuid.js'

export class Init{
  constructor(options){
    this.options = Options
    this.set_options(options)
    this.options.root  = this.get_root(this.options.selector)
    this.options.scale = this.set_scale(this.options.root)
    this.set_uuid()
  }

   // 初期設定
   set_options(options){
    if(!options){return}
    if(!options.file && !options.data){return}
    if(!options.selector){return}
    const datas = {}
    for(let i in options){
      this.options[i] = options[i]
    }
  }

  // 表示rootの取得
  get_root(selector){
    if(!selector){return}
    return document.querySelector(selector)
  }

  // 一式の親要素の設置
  set_scale(elm){
    const scale = document.createElement('div')
    scale.className = 'scale'
    elm.appendChild(scale)
    elm.setAttribute('data-service' , this.options.service_name)
    return scale
  }

  set_uuid(){
    this.options.uuid  = new Uuid().id
    this.options.root.setAttribute('data-uuid' , this.options.uuid)
  }

}