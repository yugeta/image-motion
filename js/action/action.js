import { Options }       from '../options.js'
import { Animation }     from '../action/animation.js'
import { Timeline }      from '../action/timeline.js'
import * as ActionCommon from '../action/common.js'

export class Action{
  constructor(uuid){
    const name = ActionCommon.get_animation_name()
    this.view(name , uuid)
  }

  view(name , uuid){
    if(!name || !uuid){
      ActionCommon.hidden()
    }
    else{
      Options.animation = new Animation(name , uuid)
      Options.timeline  = new Timeline(name , uuid)
      
    }
    // ActionCommon.set_tools()
  }

  hidden(){
    if(Options.animation){
      Options.animation.hidden()
      delete Options.animation
    }
    if(Options.timeline){
      Options.timeline.hidden()
      delete Options.timeline
    }
  }

}
