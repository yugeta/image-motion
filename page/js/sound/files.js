import { Options } from './options.js'

export class Files{
  constructor(data){
    this.convert_url(data.file)
  }
  convert_url(file){
    // console.log(file)
    this.file = file
    this.fileReader  = new FileReader()
    this.fileReader.onload = this.loaded.bind(this)
		this.fileReader.readAsDataURL(file)
  }
  loaded(){
    // console.log(data,src)
    // console.log(this.fileReader.result)
    this.data = this.fileReader.result
    // const audio = document.createElement('audio')
    // audio.src = this.data
    // audio_elm.autoplay = true
    // Options.sounds[this.file.name] = audio
  }
  set_context(){
    this.context = new (window.AudioContext || window.webkitAudioContext)()
  }
}
