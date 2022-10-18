import { Options } from './options.js'

export class Volume{
  constructor(uuid){
    if(!uuid){return}
    this.uuid = uuid
    this.set_init_value()
    this.set()
    this.event()
  }

  get area(){
    return document.querySelector('.contents-sound .lists > ul')
  }
  get list_item(){
    return this.area.querySelector(`[data-uuid='${this.uuid}']`)
  }

  get element(){
    return this.list_item.querySelector('.player audio')
  }

  get input(){
    return this.list_item.querySelector('.volume input')
  }

  get volume_value(){
    return Number(this.input.value || 0) ?? 1.0
  }

  set(){
    if(this.volume_value < 0){
      alert('minimum number is 0.0')
      this.input.value = 0.0
    }
    else if(this.volume_value > 1){
      alert('maximum number is 1.0')
      this.input.value = 1.0
    }
    this.element.volume = this.volume_value
    this.set_sound_data()
  }

  event(){
    this.input.addEventListener('change' , this.set.bind(this))
  }

  get sound_data(){
    return Options.sounds.find(e => e.uuid === this.uuid)
  }

  set_sound_data(){
    if(!this.sound_data){return}
    this.sound_data.volume = this.volume_value
  }

  set_init_value(){
    // console.log(this.sound_data.volume)
    this.input.value = this.sound_data.volume ?? 1.0
  }

}