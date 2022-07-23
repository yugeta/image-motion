import { Options } from '../options.js'
import { Active  } from './active.js'
import { Shape   } from '../shape/shape.js'

export function set_level(elm){
  
  if(elm){
    set_z_single(elm)
    set_level_single(elm)
  }
  // all
  else{
    set_z_all()
    set_level_all()
  }
}

// view内のz-index値をまとめてセットする
export function set_z_all(){
  const lists = Options.elements.get_image_lists()
  if(!lists || !lists.length){return}
  for(let list of lists){
    set_z_single(list)
  }
}
export function set_z_single(elm){
  const uuid = elm.getAttribute('data-uuid')
  const data = Options.datas.get_data(uuid)
  const view_image = Options.elements.get_uuid_view(uuid)
  if(!data || !view_image){return}
  view_image.style.setProperty('z-index', data.order || 'auto' ,'')
}

export function set_level_all(){
  const lists = Options.elements.get_view_elms()
  for(let list of lists){
    set_level_single(list)
  }
}
export function set_level_single(elm){
    const uuid = elm.getAttribute('data-uuid')
    const data = Options.datas.get_data(uuid)
    const target  = data.parent ? Options.elements.get_uuid_view(data.parent) : Options.elements.get_area_view()
    if(target){
      target.appendChild(elm)
    }
}

export function set_offset_pic(uuid , diff){
  // const pic  = Options.elements.get_uuid_view(uuid)
  // const rect = pic.getBoundingClientRect()
  const data  = Options.datas.get_data(uuid)
  const scale = Options.common.get_scale()
  // console.log(data , diff , scale , {x : ~~((data.x - diff.x)) , y : ~~((data.y - diff.y))})
  // console.log(~~((data.x - diff.x) * scale) +" / "+ ~~((data.y - diff.y) * scale))
  Options.datas.set_data(uuid , 'x' , ~~((data.x - diff.x)))
  Options.datas.set_data(uuid , 'y' , ~~((data.y - diff.y)))
  Options.img_datas[uuid].set_image_pos()
}

export function reset_transform(){
  const datas  = Options.datas.get_all()
  for(let uuid in datas){
    Options.img_datas[uuid].reset_transform()
    // this.cache.pic.style.setProperty('transform' , `none` , '')
  }
}

export function get_current_uuid(){
  const elm = Options.elements.get_active_view()
  if(!elm){return null}
  return elm.getAttribute('data-uuid')
}


export function img_select(uuid){
  // const uuid = img.getAttribute('data-uuid')
  // if(!uuid){return}
  // // 選択されているimageは再度選択処理をしない
  // if(this.cache.pic.getAttribute('data-status') === 'active'){return}
  new Active('active' , uuid)
  Options.shape = new Shape(uuid)
}

export function img_unselect(){
  new Active('all_passive')
  if(Options.shape){
    Options.shape.clear()
    delete Options.shape
  }
}