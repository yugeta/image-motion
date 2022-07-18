import { Options }   from '../options.js'
import { Transform } from '../transform/transform.js'
import { Action }    from '../action/action.js'

export class Active{
  constructor(type , uuid){
    if(!uuid || type === 'all_passive'){
      this.all_passive()
      if(Options.transform){
        Options.transform.hidden()
      }
    }
    else if(type === 'passive'){
      this.passive(uuid)
      if(Options.transform){
        Options.transform.hidden()
      }
    }
    else if(type === 'active'){
      this.active(uuid)
      Options.transform = new Transform(uuid)
      Options.action    = new Action(uuid)
    }
  }

  active(uuid){
    this.all_passive()
    this.view_active(uuid)
    this.list_active(uuid)
    Options.property.view(uuid)
    this.view_area_active()
  }
  view_active(uuid){
    if(!uuid){return}
    const view_target = Options.elements.get_uuid_view(uuid)
    if(!view_target){return}
    view_target.setAttribute('data-status' , 'active')
  }
  list_active(uuid){
    if(!uuid){return}
    const list_target = Options.elements.get_uuid_list(uuid)
    if(!list_target){return}
    list_target.setAttribute('data-status' , 'active')
  }

  passive(uuid){
    const target = Options.elements.get_uuid_view(uuid)
    if(!target || !target.hasAttribute('data-status')){return}
    target.removeAttribute('data-status')
    Options.property.hidden()
    this.view_area_passive()
    this.action_hidden()
  }
  action_hidden(){
    if(Options.action){
      Options.action.hidden()
    }
  }

  all_passive(){
    this.all_passive_view()
    this.all_passive_lists()
    Options.property.hidden()
    this.view_area_passive()
    this.action_hidden()
  }

  all_passive_view(){
    var area = Options.elements.get_area_view()
    if(!area){return}
    const items = area.querySelectorAll('[data-uuid]')
    for(let item of items){
      if(!item.hasAttribute('data-status')){continue}
      item.removeAttribute('data-status')
    }
  }

  all_passive_lists(){
    var area = Options.elements.get_area_lists()
    if(!area){return}
    const items = area.querySelectorAll('[data-uuid]')
    for(let item of items){
      if(!item.hasAttribute('data-status')){continue}
      item.removeAttribute('data-status')
    }
  }

  view_area_active(){
    const view_area = Options.elements.get_root()
    view_area.setAttribute('data-status' , 'active')
  }
  view_area_passive(){
    const view_area = Options.elements.get_root()
    if(view_area.hasAttribute('data-status')){
      view_area.removeAttribute('data-status')
    }
  }
}