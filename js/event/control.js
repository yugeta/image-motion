import { Options   }    from '../options.js'
import { Save      }    from '../data/save.js'
import { Load      }    from '../data/load.js'
import { Upload    }    from '../images/upload.js'
import * as ImageEvent  from '../images/event.js'
import * as ListsEvent  from '../lists/event.js'
import * as PropEvent   from '../property/event.js'
// import { Transform }    from '../transform/transform.js'
import { Active    }    from '../images/active.js'

export class Control{
  save(){
    new Save()
  }
  load(){
    new Load()
  }

  mousedown(e){
    ImageEvent.mousedown(e)
    ListsEvent.mousedown(e)
    PropEvent.mousedown(e)
  }
  mousemove(e){
    ImageEvent.mousemove(e)
    ListsEvent.mousemove(e)
    PropEvent.mousemove(e)
  }
  mouseup(e){
    ImageEvent.mouseup(e)
    ListsEvent.mouseup(e)
    PropEvent.mouseup(e)
  }

  image_upload(e){
    // image-add-button
    if(Options.elements.upper_selector(e.target , '.plus')){
      new Upload()
    }

    // 除外
    else if(Options.elements.upper_selector(e.target , '.visibility')){
      return
    }

    // list-click
    else{
      const list = Options.elements.upper_selector(e.target , '.item[data-uuid]')
      const uuid = list ? list.getAttribute('data-uuid') : null
      new Active('active' , uuid)
      // new Transform(uuid)
    }
  }

}