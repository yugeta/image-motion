import { Options }       from '../options.js'
import * as ActionCommon from '../action/common.js'

export class HashChange{
  constructor(){
    this.hash = Options.common.get_hash()
    this.animation_name_clear()
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
  }
}