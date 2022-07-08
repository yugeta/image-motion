import { Options }  from '../options.js'
import { Save }     from '../data/save.js'
import { Load }     from '../data/load.js'

export class Control{
  save(){
    new Save()
  }
  load(){
    new Load()
  }

  mousedown(e){
    Options.images.mousedown(e)
  }
  mousemove(e){
    Options.images.mousemove(e)
  }
  mouseup(e){
    Options.images.mouseup(e)
  }

}