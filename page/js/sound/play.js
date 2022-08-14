import { Options } from './options.js'

export class Play{
  constructor(uuid){
    this.uuid = uuid
    this.set_status(true)
    this.play()
    this.stop_others()
  }
  play(){
    const elm = Options.elms[this.uuid]
    if(!elm){return}
    switch(this.status){
      case 'play':
        elm.play()
        break

      case 'pause':
      default:
        elm.pause()
        break
    }
    
  }
  set_status(flg){
    const item = document.querySelector(`.contents-sound .lists ul li[data-uuid='${this.uuid}']`)
    if(!item){return}
    switch(item.getAttribute('data-status')){
      // on -> off
      case 'play':
        item.removeAttribute('data-status')
        this.status = 'pause'
        break

      // off -> on
      default:
        item.setAttribute('data-status' , 'play')
        this.status = 'play'
        break
    }
  }

  // 対象uuid以外をstopする。
  stop_others(){
    const items = document.querySelectorAll(`.contents-sound .lists ul li[data-uuid]`)
    for(let item of items){
      const uuid = item.getAttribute('data-uuid')
      if(uuid === this.uuid){continue}
      if(item.getAttribute('data-status') !== 'play'){return}
      item.removeAttribute('data-status')
      const elm = Options.elms[uuid]
      if(!elm){continue}
      elm.pause()
    }
  }
}