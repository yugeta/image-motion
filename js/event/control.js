import { Options     }   from '../options.js'
import { Save        }   from '../data/save.js'
import { Load        }   from '../data/load.js'
import { New         }   from '../data/new.js'
import * as ImageEvent   from '../images/event.js'
import * as ListsEvent   from '../lists/event.js'
import * as PropEvent    from '../property/event.js'
import * as ActionEvent  from '../action/event.js'
import * as ActionCommon from '../action/common.js'
// import * as ImageShape   from '../images/shape.js'
import { Key }           from '../event/key.js'

export class Control{
  save(){
    new Save()
  }
  load(){
    new Load()
  }
  new(){
    new New()
  }

  resize(e){
    ActionEvent.resize(e)
  }

  // 右クリック
  contextmenu(e){

    // timeline/point メニュー表示
    if(this.is_timeline_point(e.target , e.pageX)){
      ActionEvent.contextmenu(e , 'timeline/point')
    }
    // timeline/lists メニュー表示
    else if(Options.elements.upper_selector(e.target , `[name='timeline'] .lists`)){
      ActionEvent.contextmenu(e , 'timeline/lists')
    }

    return false
  }

  is_timeline_point(elm , x){
    if(!Options.elements.upper_selector(elm , `[name='timeline'] .lists .point`)){
      return false
    }
    const parent = Options.elements.upper_selector(elm , '.lists > li')
    const type   = parent.getAttribute('class')
    const per   = ActionCommon.set_timeline_pos2per(elm , x)
    if(Options.timeline
    && Options.timeline.is_point(per , type)){
      return true
    }
    else{
      return false
    }
  }

  mousedown(e){
    ImageEvent.mousedown(e)
    ListsEvent.mousedown(e)
    PropEvent.mousedown(e)
    ActionEvent.mousedown(e)
    if(Options.shape){Options.shape.mousedown(e)}
    // ImageShape.mousedown(e)
    Options.view.mousedown(e)
  }
  mousemove(e){
    ImageEvent.mousemove(e)
    ListsEvent.mousemove(e)
    PropEvent.mousemove(e)
    ActionEvent.mousemove(e)
    if(Options.shape){Options.shape.mousemove(e)}
    // ImageShape.mousemove(e)
    Options.view.mousemove(e)
  }
  mouseup(e){
    ImageEvent.mouseup(e)
    ListsEvent.mouseup(e)
    PropEvent.mouseup(e)
    ActionEvent.mouseup(e)
    if(Options.shape){Options.shape.mouseup(e)}
    // ImageShape.mouseup(e)
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