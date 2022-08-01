import { Options     }  from '../options.js'
import { Save        }  from '../data/save.js'
import { Load        }  from '../data/load.js'
// import { Upload      }  from '../images/upload.js'
// import { Renew       }  from '../images/renew.js'
import { Active      }  from '../images/active.js'
import * as ImageEvent  from '../images/event.js'
import * as ListsEvent  from '../lists/event.js'
import * as PropEvent   from '../property/event.js'
import * as ActionEvent from '../action/event.js'
import * as ImageShape  from '../images/shape.js'
// import * as ImageCommon from '../images/common.js'

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

  // image_upload(e){
  //   // image-add-button
  //   if(Options.elements.upper_selector(e.target , '.plus')){
  //     new Upload()
  //   }

  //   // image-renew
  //   else if(Options.elements.upper_selector(e.target , '.renew')){
  //     new Renew()
  //   }

  //   // 除外
  //   else if(Options.elements.upper_selector(e.target , '.visibility')){
  //     return
  //   }

  //   // list-click
  //   else{
  //     const list = Options.elements.upper_selector(e.target , '.item[data-uuid]')
  //     const uuid = list ? list.getAttribute('data-uuid') : null
  //     ImageCommon.img_select(uuid)
  //     // new Active('active' , uuid)
  //     // new Transform(uuid)
  //   }
  // }

}