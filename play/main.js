import { Options }  from './options.js'
import { Ajax }     from './ajax.js'
import { Setting }  from './setting.js'

export class Main{
  constructor(options){
    const datas = this.init(options)
    if(!datas){return}

    for(let i in datas){
      this[i] = datas[i]
    }
    if(this.file){
      this.load_data()
    }
    if(this.data){
      this.set_setting()
    }
  }

  // アニメーション再生の設定（外部実行用）
  action(name){
    this.elm.setAttribute('data-action' , name)
  }

  // 初期設定
  init(options){
    if(!options){return}
    if(!options.file && !options.data){return}
    if(!options.target){return}
    const elm = document.querySelector(options.target)
    if(!elm){return}
    elm.setAttribute('data-name' , options.name)
    const datas = {}
    for(let i in options){
      datas[i] = options[i]
    }
    datas.elm = elm
    this.set_target_element(elm)
    return datas
  }
  
  // 一式の親要素の設置
  set_target_element(elm){
    this.root = document.createElement('div')
    this.root.className = 'scale'
    elm.appendChild(this.root)
    elm.setAttribute('data-service' , Options.service_name)
  }
  
  // 設定ファイルのload処理 : json-data
  load_data(){
    new Ajax({
      url : this.file,
      method : 'get',
      callback : (e =>{
        const json = e.target.response
        const data = JSON.parse(json)
        this.data = data
        this.set_setting()
      }).bind(this) 
    })
  }

  set_setting(){
    new Setting(this)
  }
}





