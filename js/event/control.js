import { Options }  from '../options.js'
import { Save }     from '../data/save.js'

export class Control{
  save(){
    new Save()
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