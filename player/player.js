import { SettingInit as Init } from './lib/setting/init.js'
import { Ajax }                from './lib/setting/ajax.js'

import { Images }              from './lib/image/images.js'
import { Animation }           from './lib/animation/animation.js'
import { Style }               from './lib/setting/style.js'
import { Event }               from './lib/event/event.js'
import { On }                  from './lib/event/on.js'

import { CanvasSet }           from './lib/canvas/set.js'

export class Player{
  constructor(options){
    this.options    = new Init(options).options
    this.callback   = this.options.callback || null

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
    // init()
    console.log(this)
  }

  init(){
    switch(this.options.type){
      case 'html':
        this.init_html()
        break
      case 'canvas':
      default:
        this.init_canvas()
        break
    }
  }

  init_canvas(){
    this.set_data()
  }

  init_html(){
    this.css        = this.get_css()
    this.style      = new Style(this.options , this.css)
    this.on         = new On()
    this.set_data()
  }

  // view-type = html の時のみ基本cssを読み込む
  get_css(){
    if(this.options.type !== 'html'){return}
    const base = import.meta
    const path = base.url.replace(/player.js$/ , 'main.css')
    return path
  }

  set_data(){
    if(this.options.file){
      this.load_data(this.options.file)
    }
    else if(this.options.data){
      this.set_setting()
    }
  }

  // アニメーション再生の設定（外部実行用）
  action(name){
    this.options.root.setAttribute('data-action' , name)
  }

  // 設定ファイルのload処理 : json-data
  load_data(file){
    new Ajax({
      url : file,
      method : 'get',
      callback : (e =>{
        const json = e.target.response
        this.options.data = JSON.parse(json)
        this.set_setting()
      }).bind(this) 
    })
  }

  // 基本設定処理
  set_setting(){
    switch(this.options.type){
      case 'html':
        this.set_setting_html()
        break
      case 'canvas':
      default:
        this.set_setting_canvas()
        break
    }
  }
  set_setting_html(){
    this.images    = new Images(this.options)
    this.animation = new Animation(this.options)
    this.style.add(this.animation.css)
    this.event     = new Event(this.options , this.animation , this.on)
    this.finish()
  }
  set_setting_canvas(){
    // this.images    = new Images(this.options)
    // this.animation = new Animation(this.options)
    // this.style.add(this.animation.css)
    // this.event     = new Event(this.options , this.animation , this.on)
    const canvas = new CanvasSet(this.options)
    this.options.canvas = canvas
    this.animation = canvas.animation
    // this.options.animations = this.animation.options.data.animations
    // this.options.shapes     = this.animation.options.data.shape
    this.finish()
  }

  finish(){
    // console.log(this.animation)
    if(!this.callback){return}
    this.callback(this)
  }
}





