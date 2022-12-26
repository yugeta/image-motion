import { Init }                     from './lib/setting/init.js'
import { Ajax }                     from './lib/setting/ajax.js'

import { Setting as CanvasSetting } from './lib/canvas/setting.js'
import { Setting as FrameSetting }  from './lib/frames/setting.js'

import { Images }              from './lib/image/images.js'
import { Animation }           from './lib/html/animation.js'
// import { Style }               from './lib/setting/style.js'
import { Event }               from './lib/event/event.js'
// import { On }                  from './lib/event/on.js'

export class Player{
  constructor(options){
    this.options = options
    switch(document.readyState){
      case 'complete': 
        this.init()
        break
      default: 
        window.addEventListener('load' , (function(){
          this.init()
        }).bind(this)); 
        break
    }
    console.log(this)
  }

  init(){
    this.init       = new Init(this.options)
    this.options    = this.init.options
    this.callback   = this.options.callback || null
    this.set_data()
  }

  set_data(){

    // html or canvas表示
    if(this.options.file){
      this.load_data()
    }
    else if(this.options.data){
      this.set_setting()
    }

    // image事前レンダリング表示
    else if(this.options.files && this.options.files.length){
      this.load_datas()
    }
    else if(this.options.datas){
      this.set_settings()
    }
  }

  // 設定ファイルのload処理 : json-data
  load_data(){
    new Ajax({
      url : this.options.file,
      method : 'get',
      callback : (e =>{
        const json = e.target.response
        this.options.data = JSON.parse(json)
        this.set_setting()
      }).bind(this) 
    })
  }

  // 複数のアニメーションデータ（1キャラ分）のload処理 : json-data
  load_datas(){
    const file = this.options.files.shift()
    new Ajax({
      url : file,
      method : 'get',
      callback : (e =>{
        // console.log(e)
        this.options.data = this.options.data || []
        const json = e.target.response
        const data = JSON.parse(json)
        data.name  = data.name || this.get_url2filename(e.target.responseURL)
        this.options.data.push(data)
        if(this.options.files.length){
          this.load_datas()
        }
        else{
          this.set_settings()
        }
      }).bind(this) 
    })
  }

  set_setting(){
    switch(this.options.type){
      case 'canvas':
        this.options.canvas = new CanvasSetting(this.options , this.options.on , (()=>{
          this.animation      = this.options.canvas.animation
          this.loaded()
        }).bind(this))
        this.images         = this.options.data.images
        break

      case 'html':
      default:
        this.images    = new Images(this.options)
        this.animation = new Animation(this.options)
        this.style.add(this.animation.css)
        this.event     = new Event(this.options , this.animation , this.on)
        this.finish()
        break
    }
  }

  set_settings(){
   new FrameSetting(this.options , this.options.on , (()=>{
      this.animation      = this.options.animation
      this.loaded()
    }).bind(this))
  }

  loaded(){
    this.finish()
  }

  finish(){
    if(!this.callback){return}
    this.callback(this)
  }

  get_url2filename(url){
    if(!url){return null}
    const sp1 = url.split('#')
    const sp2 = sp1[0].split('/')
    return sp2[sp2.length-1]
  }


  // ----------
  // アニメーション再生の設定（外部実行用）

  action(name){
    this.options.root.setAttribute('data-action' , name)
  }

}





