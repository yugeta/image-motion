import { Options } from './options.js'
import { Files }   from './files.js'
import { Lists }   from './lists.js'
import { Uuid }    from './uuid.js'
import { Play }    from './play.js'

export class Event{
  constructor(){
    this.set_event()
  }
  set_event(){
    const add_button = document.querySelector(`button[name='add']`)
    add_button.addEventListener('click' , this.click_add.bind(this))
    const lists_area = document.querySelector(`.contents-sound .lists > ul`)
    lists_area.addEventListener('click' , this.click_lists_area.bind(this))
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
      file.uuid = new Uuid().id
      new Files(file)
      // new Lists(file)
    }
  }
  click_lists_area(e){
    const play = Options.common.upper_selector(e.target , '.contents-sound .lists ul li[data-uuid] .play')
    if(!play){return}
    const item = Options.common.upper_selector(e.target , '.contents-sound .lists ul li[data-uuid]')
    const uuid = item.getAttribute('data-uuid')
    new Play(uuid)
  }
}