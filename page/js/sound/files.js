import { Options } from './options.js'

export class Files{
  constructor(options){
    this.options = options
    if(this.options.data){
      this.set_elms(this.options.data)
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
    const data = this.fileReader.result
    this.set_elms(data)
    this.set_data({
      uuid : this.options.uuid,
      data : data,
      name : this.options.name,
      size : this.options.size,
      type : this.options.type,
      lastModified : this.options.lastModified,
    })
  }


  set_elms(data){
    const audio = document.createElement('audio')
    audio.src = data
    Options.elms[this.options.uuid] = audio
  }
  set_data(data){
    Options.sounds.push(data)
  }

  // set_context(){
  //   this.context = new (window.AudioContext || window.webkitAudioContext)()
  // }
}
