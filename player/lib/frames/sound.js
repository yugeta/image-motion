/**
 * this.datas : animation_name / image_uuid / per -> sound-data
 * sound-data : audio-elm
 */

 export class Sound{
  constructor(options){
    // console.log(animations , sounds)
    // console.log(options.data)
    // console.log(options.data.images.find(e=>e.num === 10))

    if(!options){return}
    this.options = options || {}
    // if(!options.data.animations || !Object.keys(options.data.animations).length){return}
    // if(!options.data.sounds || !options.data.sounds.length){return}
    // this.animations = options.data.animations
    // this.sounds     = options.data.sounds
    // this.datas      = this.init_datas()
    this.audio_datas = []
    this.set_sound_datas()
    // this.set_sound_elements()
  }

  get datas(){
    return this.sound_datas
  }
  set_sound_datas(){
    const datas = []
    for(const data of this.options.datas){
      if(!data.sounds || !data.sounds.length){continue}
      for(const sound of data.sounds){
        if(datas.find(e => e.uuid === sound.uuid)){continue}
        datas.push(sound)
      }
    }
    this.sound_datas =  datas
  }

  get_sound_data(uuid){
    return this.datas.find(e => e.uuid === uuid)
  }
  get_element(uuid){
    let data = this.audio_datas.find(e => e.uuid === uuid)
    // if(!data){
    //   data = this.set_sound_element(uuid)
    // }
    // console.log(data)
    return data ? data.element : null
  }

  set_sound_elements(){
    // console.log(this.audio_datas , this.datas)
    for(const data of this.datas){
      if(!data.uuid || this.get_element(data.uuid)){continue}
      // this.audio_datas.push({
      //   uuid    : data.uuid,
      //   element : this.make_audio(data),
      // })
      this.set_sound_element(data.uuid , data)
    }
  }

  set_sound_element(uuid , data){
    // const data = this.get_sound_data(uuid)
    const audio_data = {
      uuid    : uuid,
      element : this.make_audio(data),
    }
    this.audio_datas.push(audio_data)
    return audio_data
  }

  make_audio(sound_data){
    if(!sound_data || !sound_data.data){return}
    const audio = new Audio()
    audio.src = sound_data.data
    audio.volume = sound_data.volume ?? 1
    return audio
  }



  // init_datas(){
  //   const animations = this.animations
  //   const datas      = {}
  //   for(let animation_name in animations){
  //     const items = animations[animation_name].items
  //     if(!items || !Object.keys(items).length){continue}
  //     const data = this.get_data_items(items)
  //     if(!data || !Object.keys(data).length){continue}
  //     datas[animation_name] = data
  //   }
  //   return datas
  // }

  // get_data_items(items){
  //   const datas = {}
  //   for(let image_uuid in items){
  //     const keyframes = items[image_uuid].keyframes
  //     if(!keyframes || !Object.keys(keyframes).length){continue}
  //     for(let per in keyframes){
  //       const sound = keyframes[per].sound
  //       if(!sound){continue}
  //       const audio = this.make_audio(sound)
  //       if(!audio){continue}
  //       datas[per] = datas[per] || {}
  //       datas[per][image_uuid] = audio
  //     }
  //   }
  //   return datas
  // }

  // get_sound_data(sound_uuid){
  //   return this.sounds.find(e => e.uuid === sound_uuid)
  // }

  

  // get_datas(animation_name , per){
  //   if(!this.datas
  //   || !this.datas[animation_name]
  //   || !this.datas[animation_name][per]
  //   || !Object.keys(this.datas[animation_name][per]).length){return}
  //   return this.datas[animation_name][per]
  // }

  // is_data(animation_name){
  //   if(this.datas
  //   && this.datas[animation_name]){
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }

  get_animation_data(animation_name){
    return this.options.datas.find(e => e.animation_name === animation_name)
  }

  get_keyframe_data(animation_name , keyframe){
    const datas = this.get_animation_data(animation_name)
    if(datas){
      return datas.images.find(e => e.num === keyframe)
    }
  }

  play(animation_name , keyframe){
    // this.flg = this.NotAllowedError_check()
    // console.log('play')
    const data = this.get_keyframe_data(animation_name , keyframe)
    // console.log(animation_name , keyframe , data)
    if(!data || !data.sound || !data.sound.length){return}

    // console.log('play1',animation_name,keyframe)
    for(const uuid of data.sound){
      let element = this.get_element(uuid , data)
      if(!element){
        const sound_data = this.get_sound_data(uuid)
        const audio = this.set_sound_element(uuid , sound_data)
        if(audio){
          element = audio.element
        }
        else{
          continue
        }
      }
      if(!element){continue}
      // console.log('play2',animation_name,keyframe)
      element.play()
    }
    
    // console.log(data)
    // const datas = this.get_datas(animation_name , keyframe)
    // if(!datas){return}
    // for(let img_uuid in datas){
    //   datas[img_uuid].play()
    // }
  }

  // NotAllowedError_check(){
  //   return this.options.NotAllowedError.flg
  // }

  stop(animation_name , keyframe){
    console.log('stop')
    // const datas = this.get_datas(animation_name , keyframe)
    // if(!datas){return}
    // for(let img_uuid in datas){
    //   if(!datas[img_uuid]){continue}
    //   if(!datas[img_uuid].currentTime && datas[img_uuid].paused){continue}
    //   datas[img_uuid].pause()
    //   datas[img_uuid].currentTime = 0
    // }
  }

  // stop_all(){
  //   if(!this.datas){return}
  //   for(let anim_name in this.datas){
  //     const anim_data = this.datas[anim_name]
  //     if(!anim_data){continue}
  //     for(let per in anim_data){
  //       this.stop(anim_name , per)
  //     }
  //   }
  // }

}
