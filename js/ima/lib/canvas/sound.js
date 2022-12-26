/**
 * this.datas : animation_name / image_uuid / per -> sound-data
 * sound-data : audio-elm
 */

export class Sound{
  constructor(options){
    // console.log(animations , sounds)
    if(!options){return}
    this.options = options || {}
    if(!options.data.animations || !Object.keys(options.data.animations).length){return}
    if(!options.data.sounds || !options.data.sounds.length){return}
    this.animations = options.data.animations
    this.sounds     = options.data.sounds
    this.datas      = this.init_datas()
  }

  init_datas(){
    const animations = this.animations
    const datas      = {}
    for(let animation_name in animations){
      const items = animations[animation_name].items
      if(!items || !Object.keys(items).length){continue}
      const data = this.get_data_items(items)
      if(!data || !Object.keys(data).length){continue}
      datas[animation_name] = data
    }
    return datas
  }

  get_data_items(items){
    const datas = {}
    for(let image_uuid in items){
      const keyframes = items[image_uuid].keyframes
      if(!keyframes || !Object.keys(keyframes).length){continue}
      for(let per in keyframes){
        const sound = keyframes[per].sound
        if(!sound){continue}
        const audio = this.make_audio(sound)
        if(!audio){continue}
        datas[per] = datas[per] || {}
        datas[per][image_uuid] = audio
      }
    }
    return datas
  }

  get_sound_data(sound_uuid){
    return this.sounds.find(e => e.uuid === sound_uuid)
  }

  make_audio(sound_uuid){
    const sound  = this.get_sound_data(sound_uuid)
    if(!sound){return}
    const audio = new Audio()
    audio.src = sound.data
    return audio
  }

  get_datas(animation_name , per){
    if(!this.datas
    || !this.datas[animation_name]
    || !this.datas[animation_name][per]
    || !Object.keys(this.datas[animation_name][per]).length){return}
    return this.datas[animation_name][per]
  }

  is_data(animation_name){
    if(this.datas
    && this.datas[animation_name]){
      return true
    }
    else{
      return false
    }
  }

  stop_all(){
    if(!this.datas){return}
    for(let anim_name in this.datas){
      const anim_data = this.datas[anim_name]
      if(!anim_data){continue}
      for(let per in anim_data){
        this.stop(anim_name , per)
      }
    }
  }

  play(animation_name , per){
    const datas = this.get_datas(animation_name , per)
    if(!datas){return}
    for(let img_uuid in datas){
      datas[img_uuid].play()
    }
  }

  stop(animation_name , per){
    const datas = this.get_datas(animation_name , per)
    if(!datas){return}
    for(let img_uuid in datas){
      if(!datas[img_uuid]){continue}
      if(!datas[img_uuid].currentTime && datas[img_uuid].paused){continue}
      datas[img_uuid].pause()
      datas[img_uuid].currentTime = 0
    }
  }

}
