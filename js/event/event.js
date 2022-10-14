import { Options }       from '../options.js'
import * as ActionCommon from '../action/common.js'
import { About }         from '../asset/about.js'
import { HashChange }    from '../event/hash_change.js'

export class Event {
  constructor(){
    this.init()
    this.hashchange()
  }

  init(){
    this.default()
    this.mouse()
    this.file()
    this.animation()
    this.key()
  }

  set(elm , key , func , flg){
    if(!elm || !key || !func){return}
    elm.addEventListener(key ,func , flg)
  }

  default(){
    this.set(
      window , 
      'resize',
      Options.control.resize.bind(Options.control),
    )
    this.set(
      window,
      'hashchange',
      this.hashchange.bind(this)
    )
  }
  mouse(){
    // 右クリック
    window.oncontextmenu =  Options.control.contextmenu.bind(Options.control)

    this.set(
      window , 
      'mousedown',
      Options.control.mousedown.bind(Options.control),
    )
    this.set(
      window,
      'mousemove',
      Options.control.mousemove.bind(Options.control),
    )
    this.set(
      window , 
      'mouseup',
      Options.control.mouseup.bind(Options.control),
    )
    this.set(
      window , 
      'wheel',
      Options.control.wheel.bind(Options.control),
    )
  }

  file(){
    this.set(
      document.getElementById('save') , 
      'click',
     Options.control.save,
    )
    this.set(
      document.getElementById('load') , 
      'click',
      Options.control.load,
    )
    this.set(
      document.querySelector(`header .text-menu .lists .item[data-mode='save']`) , 
      'click',
     Options.control.save,
    )
    this.set(
      document.querySelector(`header .text-menu .lists .item[data-mode='image_animation_save']`) , 
      'click',
     Options.control.image_animation_save,
    )
    this.set(
      document.querySelector(`header .text-menu .lists .item[data-mode='load']`) , 
      'click',
      Options.control.load,
    )
    this.set(
      document.querySelector(`header .text-menu .lists .item[data-mode='new']`) , 
      'click',
      Options.control.new,
    )
    this.set(
      document.querySelector(`header .text-menu .lists .item[data-mode='about']`) , 
      'click',
      (()=>{
        new About()
      }).bind(this),
    )
  }

  animation(){
    // animation-nameリストの選択イベント
    const elm = Options.elements.get_animation_name_list_input()
    if(!elm){return}
    this.set(
      elm,
      'click',
      ActionCommon.animation_name_list_click.bind(Options.header),
    )
    this.set(
      elm,
      'input',
      ActionCommon.animation_name_list_input.bind(Options.header),
    )
    this.set(
      elm,
      'change',
      ActionCommon.animation_name_list_decide.bind(Options.header),
    )

    // toolsイベント
    const tools_area = Options.elements.get_animation_tools()
    this.set(tools_area.querySelector('.play') , 'click' , ActionCommon.click_play.bind(this))
    // this.set(tools_area.querySelector('.stop') , 'click' , ActionCommon.click_stop.bind(this))
    this.set(tools_area.querySelector('.next') , 'click' , ActionCommon.click_next.bind(this))
    this.set(tools_area.querySelector('.prev') , 'click' , ActionCommon.click_prev.bind(this))

    // animation-name-list delete
    this.set(Options.elements.get_animation_header_add()   , 'click' , ActionCommon.click_animation_name_list_add.bind(this))
    this.set(Options.elements.get_animation_header_edit()  , 'click' , ActionCommon.click_animation_name_list_edit.bind(this))
    this.set(Options.elements.get_animation_header_copy()  , 'click' , ActionCommon.click_animation_name_list_copy.bind(this))
    this.set(Options.elements.get_animation_header_trash() , 'click' , ActionCommon.click_animation_name_list_trash.bind(this))

    // ----------
    // headerイベント
    const timeline_header = Options.elements.get_timeline_header()
    this.set(timeline_header.querySelector(`input[name='duration']`) , 'input' , ActionCommon.timeline_duration.bind(this))
    this.set(timeline_header.querySelector(`input[name='count']`)    , 'change' , ActionCommon.timeline_count.bind(this))
    this.set(timeline_header.querySelector(`select[name='timing']`)  , 'change' , ActionCommon.timeline_timing.bind(this))
  }

  key(){
    this.set(
      window , 
      'keydown',
      Options.control.keydown.bind(Options.control),
    )
    this.set(
      window,
      'keyup',
      Options.control.keyup.bind(Options.control),
    )
  }

  hashchange(){
    new HashChange()
  }

}
