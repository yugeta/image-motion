import { Options } from './options.js'

export class Lists{
  constructor(options){
    this.options = options
    this.uuid = this.options.uuid
    this.view_add()
    this.set_audio_tag()
  }

  // ファイル読み込みの場合dataがセットされていないため、別データから取得する
  set_options(options){
    if(options.data){
      return options
    }
    else{
      const data = Options.sounds.find(e => e.uuid === options.uuid)
      console.log(Options.sounds.length)
      return data
    }
  }
  
  get_area(){
    return document.querySelector('.contents-sound .lists > ul')
  }

  get_template(){
    const elm = document.querySelector(`.template > [data-name='sound-list']`)
    return Options.common.doubleBlancketConvert(elm.innerHTML , this.options)
  }

  get_item(){
    const area = this.get_area()
    return area.querySelector(`[data-uuid='${this.uuid}']`)
  }

  get_play(){
    const item = this.get_item()
    return item.querySelctor(`.play`)
  }

  view_add(){
    const area = this.get_area()
    const template = this.get_template()
    area.insertAdjacentHTML('beforeend' , template)
  }

  set_audio_tag(){
    const item = this.get_item()
    const player_area = item.querySelector(`.player`)
    const audio_elm = Options.elms[this.uuid]
    player_area.appendChild(audio_elm)
    audio_elm.setAttribute('controls' , '')
  }
}
