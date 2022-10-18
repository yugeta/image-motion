import { Options } from './options.js'
import { Lists }   from './lists.js'

export class Files{
  constructor(options){
    this.options = options
    if(this.options.data){
      this.set_elms()
    }
    else{
      this.convert_url()
    }
  }

  convert_url(){
    this.fileReader = new FileReader()
    this.fileReader.onload = this.loaded.bind(this)
		this.fileReader.readAsDataURL(this.options)
  }

  get_sound_data(uuid){
    return Options.sounds.find(e => e.uuid === uuid)
  }

  loaded(){
    const sound_data = this.get_sound_data(this.options.uuid)
    if(sound_data){
      this.replace_data(sound_data)
    }
    else{
      this.new_data()
    }
    new Lists(this.options)
  }

  new_data(){
    this.options.data = this.fileReader.result
    this.set_elms(true)
    this.data = {
      uuid         : this.options.uuid,
      data         : this.options.data,
      name         : this.options.name,
      size         : this.options.size,
      type         : this.options.type,
      lastModified : this.options.lastModified,
    }
    Options.sounds.push(this.data)
  }

  replace_data(sound_data){
    this.options.data = this.fileReader.result
    this.set_elms(true)
    sound_data.data         = this.options.data
    sound_data.name         = this.options.name
    sound_data.size         = this.options.size
    sound_data.type         = this.options.type
    sound_data.lastModified = this.options.lastModified
    this.data = sound_data
  }


  set_elms(event_flg){
    const audio = document.createElement('audio')
    if(event_flg){
      audio.onloadedmetadata = this.set_time.bind(this , audio)
    }
    audio.src = this.options.data
    Options.elms[this.options.uuid] = audio
  }

  set_time(audio){
    const sec = audio.duration
    this.data.time = sec
  }
}
