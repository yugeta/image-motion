import { Options }  from './options.js'
import { Uuid }     from './uuid.js'
import { On }      from '../event/on.js'

export class Init{
  constructor(options){
    this.options = JSON.parse(JSON.stringify(Options))
    this.set_options(options)
    this.options.root   = this.get_root()
    // console.log(this.options)
    this.options.scale  = this.set_scale()
    this.set_uuid()
    this.options.on     = new On()
  }

  // 初期設定
  set_options(options){
    if(!options){return}
    // if(!options.file && !options.files && !options.data){return}
    if(!options.selector){return}
    const datas = {}
    for(let i in options){
      this.options[i] = options[i]
    }
  }

  // 表示rootの取得
  get_root(){
    const selector = this.options.selector
    if(!selector){return}
    const elm = document.querySelector(selector)
    return elm
  }

  // 一式の親要素の設置
  set_scale(){
    const root = this.options.root
    if(!root){return}
    const scale = document.createElement('div')
    scale.className = 'scale'
    root.appendChild(scale)
    root.setAttribute('data-service' , this.options.service_name)
    return scale
  }

  set_uuid(){
    this.options.uuid  = new Uuid().id
    this.options.root.setAttribute('data-uuid' , this.options.uuid)
  }

}