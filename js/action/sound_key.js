import { Options } from '../options.js'
import * as ActionCommon from '../action/common.js'

/**
 * Sound-keyframeに関する情報（property含む）
 */

export class SoundKey{
  constructor(options){
    if(!options){return}

    // 対象のアニメーションが指定されていない場合は再生しない
    const name = ActionCommon.get_animation_name()
    if(!name){return}

    // 画像が選択されていない場合は再生しない
    // const current_select_image = Options.elements.get_active_view()
    // if(!current_select_image){return}

    this.options = options
    this.options.data = options.data !== undefined ? options.data : this.get_keyframe()
    if(this.options.data === undefined){return}
    this.elm_info = Options.elements.get_sound_info()
    this.datas = Options.datas.get_sounds()
    this.data  = Options.datas.get_sound(this.options.data) || {}
    this.uuid  = this.data.uuid
    this.name  = this.data.name
    // this.make_audio(this.uuid)

    this.property_view()
    // playボタンが押された状態であれば、音声を再生する
    if(this.is_play()){
      this.play()
    }
  }

  is_play(){
    const elm = Options.elements.get_animation_tools_play()
    if(!elm){return}
    return elm.getAttribute('data-status') === 'on' ? true : false
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
    const target_rect = target.getBoundingClientRect()
    const target_data = {
      x : target.offsetLeft,
      y : target.offsetTop,
      w : target.offsetWidth,
      h : target.offsetHeight,
    }
    const lists_data = {
      x : target_data.x,
      y : target_data.y + target_data.h + 5,
      w : lists.offsetWidth,
      h : lists.offsetHeight,
    }
    const lists_max_h = window.innerHeight - target_rect.top - lists_data.y
    console.log(window.offsetHeight , lists_data.y)
    lists.style.setProperty('left'   , `${lists_data.x}px` , '')
    lists.style.setProperty('top'    , `${lists_data.y}px` , '')
    lists.style.setProperty('height' , `${lists_max_h}px` , '')
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
    if(!this.elm_info){return}
    this.elm_info.innerHTML = ''
  }

  get_sound_data(animation_name , image_uuid , keyframe){
    const animation_data = Options.animations[animation_name]
    if(!animation_data
    || !animation_data.items
    || !animation_data.items[image_uuid]
    || !animation_data.items[image_uuid].keyframes
    || !animation_data.items[image_uuid].keyframes[keyframe]
    || !animation_data.items[image_uuid].keyframes[keyframe].sound){return}
    const sound_uuid = animation_data.items[image_uuid].keyframes[keyframe].sound
    return Options.sounds.find(e => e.uuid === sound_uuid)
  }

  play(){
    const sound_data = this.get_sound_data(this.options.name , this.options.uuid , this.options.per)
    if(!sound_data){return}
    const audio = new Audio()
    audio.src = sound_data.data
    audio.play()
  }
  // play(){
  //   if(!this.is_play()){return}
  //   const audio = Options.sound_elms.find(e => e.uuid === this.uuid)
  //   Options.sound_elms.push(audio)
  //   audio.play()
  // }
  // pause(audio){
  //   if(!audio){return}
  //   audio.pause()
  // }
  // stop(audio){
  //   if(!audio){return}
  //   audio.pause()
  //   audio.currentTime = 0
  // }

  // get_audio(uuid){
  //   return Options.sound_elms.find(e => e.uuid === uuid)
  // }
  // set_audio(audio){
  //   if(this.get_audio(audio.uuid)){return}
  //   Options.sound_elms.push(audio)
  // }

  // make_audio(uuid){
  //   let audio = this.get_audio(uuid)
  //   if(!audio){
  //     audio = new Audio()
  //     audio.uuid = uuid
  //     if(this.data.time === undefined){
  //       audio.addEventListener('loadedmetadata' , this.property_time_view.bind(this , audio))
  //     }
  //     audio.src = this.data.data
  //     audio.onended = this.end_audio.bind(this,audio)
  //     this.set_audio(audio)
  //   }
  //   return audio
  // }

  // end_audio(audio){
  //   for(let i=0; i<Options.sound_elms.length; i++){
  //     if(Options.sound_elms[i].uuid !== audio.uuid){continue}
  //     delete Options.sound_elms[i]
  //     break
  //   }
  // }

  // is_play(){
  //   const play = Options.elements.get_animation_tools_play()
  //   return play.getAttribute('data-status') ? true : false
  // }
  // all_pause(){
  //   if(!Options.sound_elms.length){return}
  //   for(let audio of Options.sound_elms){
  //     this.pause(audio)
  //   }
  // }
  
  // all_stop(){
  //   if(!Options.sound_elms.length){return}
  //   for(let audio of Options.sound_elms){
  //     this.stop(audio)
  //   }
  //   Options.sound_elms = []
  // }
  
}
