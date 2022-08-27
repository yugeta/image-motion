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
  loaded(){
    this.options.data = this.fileReader.result
    this.set_elms()
    const data = {
      uuid : this.options.uuid,
      data : this.options.data,
      name : this.options.name,
      size : this.options.size,
      type : this.options.type,
      lastModified : this.options.lastModified,
    }
    Options.sounds.push(data)
    new Lists(data)
  }

  set_elms(){
    const audio = document.createElement('audio')
    audio.src = this.options.data
    Options.elms[this.options.uuid] = audio
  }
}
