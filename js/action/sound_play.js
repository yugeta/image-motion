import { Options } from '../options.js'

export class SoundPlay{
  constructor(){
    this.sounds = {}
  }

  get_audio(uuid){
    return this.sounds.find(e => e.uuid === uuid)
  }
  set_audio(audio){
    if(this.get_audio(audio.uuid)){return}
    this.sounds.push(audio)
  }

  make_audio(uuid){
    let audio = this.get_audio(uuid)
    if(!audio){
      audio = new Audio()
      audio.uuid = uuid
      if(this.data.time === undefined){
        audio.addEventListener('loadedmetadata' , this.property_time_view.bind(this , audio))
      }
      audio.src = this.data.data
      audio.onended = this.end_audio.bind(this,audio)
      this.set_audio(audio)
    }
    return audio
  }



  all_play(){return
    if(!this.sounds.length){return}
    for(let audio of Options.sound_elms){
      audio.play()
    }
  }
  all_pause(){return
    if(!this.sounds.length){return}
    for(let audio of this.sounds){
      this.pause(audio)
    }
  }
  
  all_stop(){return
    if(!this.sounds.length){return}
    for(let audio of this.sounds){
      this.stop(audio)
    }
    this.sounds = []
  }
  
  play(){
    if(!this.is_play()){return}
    const audio = this.get_audio(uuid)
    Options.sound_elms.push(audio)
    audio.play()
  }
  pause(audio){
    if(!audio){return}
    audio.pause()
  }
  stop(audio){
    if(!audio){return}
    audio.pause()
    audio.currentTime = 0
  }

  end_audio(audio){
    for(let i=0; i<this.sounds.length; i++){
      if(this.sounds[i].uuid !== audio.uuid){continue}
      delete this.sounds[i]
      break
    }
  }

  is_play(){
    const play = Options.elements.get_animation_tools_play()
    return play.getAttribute('data-status') ? true : false
  }
  

}