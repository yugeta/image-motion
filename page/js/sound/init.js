import { Options } from './options.js'
import { Files }   from './files.js'
import { Lists }   from './lists.js'

export class Init{
  constructor(){
    this.set_current_sounds_lists()
  }
  set_current_sounds_lists(){
    if(!Options.sounds.length){return}
    for(let file of Options.sounds){
      const uuid = file.uuid
      if(!uuid){continue}
      new Files(file)
      new Lists(file)
    }
  }
}