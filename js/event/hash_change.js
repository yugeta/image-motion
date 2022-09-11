import { Options }       from '../options.js'
import * as ActionCommon from '../action/common.js'

export class HashChange{
  constructor(){
    this.hash = Options.common.get_hash()
    this.animation_name_clear()
    this.animation_setting_list_clear()
    this.timeline_list_clear()
    this.property_sound_clear()
    this.property_shape_clear()
    this.change()
  }
  change(){
    const dt = (+new Date())
    const iframe = this.get_iframe()
    switch(this.hash){
      case 'upload':
      case 'action':
      // case 'sound':
        break

      case '':
        iframe.src = `page/index.html?dt=${dt}`
        break
      case 'help':
      default:
        iframe.src = `page/${this.hash}.html?dt=${dt}`
        break
    }
    
  }
  get_iframe(){
    return Options.elements.get_iframe()
  }

  // animation-nameがセットされている場合は、クリアする
  animation_name_clear(){
    ActionCommon.animation_name_clear()
    const root = Options.elements.get_root()
    root.setAttribute('data-animation-name' , '')
  }
  // animation設定値のリストをクリアする
  animation_setting_list_clear(){
    if(!Options.animation){return}
    Options.animation.hidden()
  }
  // 上記と合わせてタイムラインもクリアする
  timeline_list_clear(){
    if(!Options.timeline){return}
    Options.timeline.hidden()
  }
  // ヘッダ切替時にproperty(sound)表示をクリアする。
  property_sound_clear(){
    if(!Options.property){return}
    Options.property.hidden()
  }
  // ヘッダ切替時にproperty(設定）表示をクリアする。
  property_shape_clear(){
    if(!Options.shape){return}
    Options.shape.clear_property()
  }


}