import { Options } from '../options.js'
import { Upload }  from './upload.js'

export class Images{
  add(){
    let input_file = document.createElement("input")
    input_file.type     = 'file'
    input_file.multiple = 'multiple'
    input_file.name     = 'images[]'
    input_file.addEventListener('change' , this.pick_imgs_upload.bind(this))
    document.querySelector("form[name='upload']").appendChild(input_file)
    input_file.click()
  }
  pick_imgs_upload(e){
    if(!e.target.files.length){return}
    for(let file of e.target.files){
      new Upload(file)
    }
  }

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
    this.all_passive()
    this.view_active(uuid)
    this.list_active(uuid)
  }
  view_active(uuid){
    if(!uuid){return}
    const view_target = this.get_uuid_view(uuid)
    if(!view_target){return}
    view_target.setAttribute('data-status' , 'active')
  }
  list_active(uuid){
    if(!uuid){return}
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


  mousedown(e){
    if(!Options.common.upper_selector(e.target , `[name='view']`)){return}
    const area = this.get_area_view()
    const img  = Options.common.upper_selector(e.target , `[name='view'] [data-uuid][data-status='active']`)
    if(!img){return}
    const scale    = Options.common.get_scale()
    const areaRect = area.getBoundingClientRect()
    const imgRect  = img.getBoundingClientRect()
    const mx = e.pageX
    const my = e.pageY
    this.move = {
      uuid  : img.getAttribute('data-uuid'),
      scale : scale,
      mouse : {
        x : mx,
        y : my,
      },
      area : {
        offset : {
          x : areaRect.left,
          y : areaRect.top,
        }
      },
      img : {
        elm : img,
        pos : {
          x : (imgRect.left - areaRect.left) / scale,
          y : (imgRect.top  - areaRect.top)  / scale,
        },
        offset : {
          x : mx - imgRect.left,
          y : my - imgRect.top,
        },
      },
    }
  }
  mousemove(e){
    if(!this.move){return}
    const img = this.move.img.elm
    const mx  = e.pageX
    const my  = e.pageY
    const tx  = (mx - this.move.mouse.x) / this.move.scale + this.move.img.pos.x
    const ty  = (my - this.move.mouse.y) / this.move.scale + this.move.img.pos.y
    img.style.setProperty('top'  , `${ty}px` , '')
    img.style.setProperty('left' , `${tx}px` , '')
    Options.property.update({x:tx , y:ty})
  }
  mouseup(e){
    if(!this.move){return}
    delete this.move
  }


}