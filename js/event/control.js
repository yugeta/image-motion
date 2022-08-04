import { Options     }  from '../options.js'
import { Save        }  from '../data/save.js'
import { Load        }  from '../data/load.js'
import * as ImageEvent  from '../images/event.js'
import * as ListsEvent  from '../lists/event.js'
import * as PropEvent   from '../property/event.js'
import * as ActionEvent from '../action/event.js'
import * as ImageShape  from '../images/shape.js'
import { Key }          from '../event/key.js'

export class Control{
  save(){
    new Save()
  }
  load(){
    new Load()
  }

  resize(e){
    ActionEvent.resize(e)
  }

  mousedown(e){
    ImageEvent.mousedown(e)
    ListsEvent.mousedown(e)
    PropEvent.mousedown(e)
    ActionEvent.mousedown(e)
    ImageShape.mousedown(e)
    Options.view.mousedown(e)
  }
  mousemove(e){
    ImageEvent.mousemove(e)
    ListsEvent.mousemove(e)
    PropEvent.mousemove(e)
    ActionEvent.mousemove(e)
    ImageShape.mousemove(e)
    Options.view.mousemove(e)
  }
  mouseup(e){
    ImageEvent.mouseup(e)
    ListsEvent.mouseup(e)
    PropEvent.mouseup(e)
    ActionEvent.mouseup(e)
    ImageShape.mouseup(e)
    Options.view.mouseup(e)
  }

  keydown(e){
    Options.undo.keydown(e)
    new Key(e).keydown(e)
  }
  keyup(e){
    Options.undo.keyup(e)
    new Key(e).keyup(e)
  }

}