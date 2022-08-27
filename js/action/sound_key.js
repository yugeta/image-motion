import { Options } from '../options.js'

export class SoundKey{
  constructor(options){
    if(!options){return}
    this.options = options
    this.options.data = options.data !== undefined ? options.data : this.get_keyframe()
    if(this.options.data === undefined){return}
    this.elm_info = Options.elements.get_sound_info()
    this.datas = Options.datas.get_sounds()
    this.data  = Options.datas.get_sound(this.options.data) || {}
    this.uuid  = this.data.uuid
    this.name  = this.data.name
    this.audio = this.audio || this.make_audio()
    this.property_view()
    // playボタンが押された状態であれば、音声を再生する
    this.play()
  }
  get_keyframe(){
    const datas = Options.datas.get_animation_name_datas(this.options.name)
    if(datas
    && datas.items
    && datas.items[this.options.uuid]
    && datas.items[this.options.uuid].keyframes
    && datas.items[this.options.uuid].keyframes[this.options.per]
    && datas.items[this.options.uuid].keyframes[this.options.per].sound !== undefined){
      return datas.items[this.options.uuid].keyframes[this.options.per].sound
    }
  }
  
  property_view(){
    const temaplte = Options.common.get_template('property_sound')
    this.elm_info.innerHTML = Options.common.doubleBlancketConvert(temaplte , this.data)
    this.elm_name = Options.elements.get_sound_name()
    this.elm_name.textContent = this.data ? this.data.name : ''
    this.elm_uuid = Options.elements.get_sound_uuid()
    this.set_event()
  }
  property_time_view(audio){
    const elm = this.elm_info.querySelector('.time')
    if(!elm){return}
    const sec = audio.duration || 0
    elm.textContent = sec.toFixed(2)
  }

  set_event(){
    this.elm_name.addEventListener('click' , this.click_name.bind(this))
  }

  click_name(e){
    if(!this.datas.length){return}
    if(this.status === 'list_view'){
      this.close_lists()
      return
    }
    const target = Options.elements.upper_selector(e.target , '.sound-name')
    this.open_lists(target)
  }

  open_lists(target){
    const lists  = this.get_sound_lists()
    const target_pos = {
      x : target.offsetLeft,
      y : target.offsetTop,
      w : target.offsetWidth,
      h : target.offsetHeight,
    }
    const lists_pos = {
      x : target_pos.x,
      y : target_pos.y + target_pos.h + 5,
    }
    lists.style.setProperty('left' , `${lists_pos.x}px` , '')
    lists.style.setProperty('top'  , `${lists_pos.y}px` , '')
    target.parentNode.appendChild(lists)
    this.status = 'list_view'
  }

  get_sound_lists(){
    const div = document.createElement('div')
    div.className = 'select-lists'
    for(let data of this.datas){
      const item = document.createElement('div')
      item.className = 'item'
      item.textContent = data.name
      item.setAttribute('data-uuid' , data.uuid)
      div.appendChild(item)
      item.addEventListener('click' , this.click_item.bind(this))
    }
    return div
  }

  click_item(e){
    const target = e.currentTarget
    const uuid = target.getAttribute('data-uuid')
    const data = Options.datas.get_sound(uuid)
    this.set_name(data.name)
    this.set_uuid(data.uuid)
    this.set_data(data)
    this.close_lists()
  }
  close_lists(){
    if(this.status !== 'list_view'){return}
    const viewed_lists = document.querySelector(`[name='sound'] .select-lists`)
    viewed_lists.parentNode.removeChild(viewed_lists)
    this.status = null
  }
  set_name(name){
    this.elm_name.textContent = name
    this.name = name
  }
  set_uuid(uuid){
    this.elm_name.setAttribute('data-uuid' , uuid)
    this.uuid = uuid
  }
  set_data(data){
    Options.datas.set_animation_data_value(
      this.options.name , 
      this.options.uuid , 
      this.options.per , 
      'sound' , 
      data.uuid,
    )
  }

  property_hidden(){
    this.elm_info.innerHTML = ''
  }

  all_play(){
    if(!Options.sound_elms.length){return}
    for(let audio of Options.sound_elms){
      audio.play()
    }
  }
  play(){
    if(!this.is_play()){return}
    const audio = this.audio || this.make_audio()
    Options.sound_elms.push(audio)
    audio.play()
    // if(!Options.sound_elms[this.uuid]){
    //   Options.sound_elms[this.uuid] = this.make_audio()
    // }
    // Options.sound_elms[this.uuid].play()
  }

  make_audio(){
    const audio = new Audio()
    if(this.data.time === undefined){
      audio.addEventListener('loadedmetadata' , this.property_time_view.bind(this , audio))
    }
    audio.src = this.data.data
    this.audio = audio
    return audio
  }
  is_play(){
    const play = Options.elements.get_animation_tools_play()
    return play.getAttribute('data-status') ? true : false
  }
  all_pause(){
    if(!Options.sound_elms.length){return}
    for(let audio of Options.sound_elms){
      this.stop(audio)
    }
  }
  pause(audio){
    audio.pause()
  }
  all_stop(){
    if(!Options.sound_elms.length){return}
    for(let audio of Options.sound_elms){
      this.stop(audio)
    }
    Options.sound_elms = []
  }
  stop(audio){
    audio.pause()
    audio.currentTime = 0
  }
}
