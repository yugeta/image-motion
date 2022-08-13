import { Options } from './options.js'
import { Files }   from './files.js'
import { Lists }   from './lists.js'

export class Event{
  constructor(){
    this.set_event()
  }
  set_event(){
    const add_button = document.querySelector(`button[name='add']`)
    add_button.addEventListener('click' , this.click_add.bind(this))
  }

  click_add(e){
    let input_file = document.createElement("input")
    input_file.type     = 'file'
    input_file.multiple = 'multiple'
    input_file.accept   = 'audio/mp3'
    input_file.addEventListener('change' , this.upload_files.bind(this))
    document.querySelector("form[name='upload']").appendChild(input_file)
    input_file.click()
  }
  upload_files(e){
    if(!e.target.files.length){return}
    for(let file of e.target.files){
      const name = file.name
      Options.sounds[name] = new Files({file:file})
      new Lists(name)
    }
  }
}