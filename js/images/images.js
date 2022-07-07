import { Options } from '../options.js'

export class Images{
  get_area_view(){
    return document.querySelector(".contents [name='view'] .scale")
  }
  get_area_list(){
    return document.querySelector(".contents [name='images']")
  }

  get_uuid_view(uuid){
    if(!uuid){return}
    const area = this.get_area_view()
    return area.querySelector(`.pic[data-uuid='${uuid}']`)
  }
  get_uuid_list(uuid){
    if(!uuid){return}
    const area = this.get_area_list()
    return area.querySelector(`[data-uuid='${uuid}']`)
  }

  active(uuid){
    if(!uuid){return}
    this.all_passive()
    this.view_active(uuid)
    this.list_active(uuid)
  }
  view_active(uuid){
    const view_target = this.get_uuid_view(uuid)
    if(!view_target){return}
    view_target.setAttribute('data-status' , 'active')
  }
  list_active(uuid){
    const list_target = this.get_uuid_list(uuid)
    if(!list_target){return}
    list_target.setAttribute('data-status' , 'active')
  }

  passive(uuid){
    const target = this.get_uuid_view(uuid)
    if(!target || !target.hasAttribute('data-status')){return}
    target.removeAttribute('data-status')
  }


  all_passive(){
    this.all_passive_view()
    this.all_passive_lists()
  }
  all_passive_view(){
    var area = Options.images.get_area_view()
    if(!area){return}
    const items = area.querySelectorAll('[data-uuid]')
    for(let item of items){
      if(!item.hasAttribute('data-status')){continue}
      item.removeAttribute('data-status')
    }
  }
  all_passive_lists(){
    var area = Options.images.get_area_list()
    if(!area){return}
    const items = area.querySelectorAll('[data-uuid]')
    for(let item of items){
      if(!item.hasAttribute('data-status')){continue}
      item.removeAttribute('data-status')
    }
  }

}