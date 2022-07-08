import { Options }  from '../options.js'

export class Control{
  save(){
    console.log('save')
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