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
  const data  = Options.datas.get_data(uuid)
  const scale = Options.common.get_scale()
  Options.datas.set_data(uuid , 'x' , ~~((data.x - diff.x)))
  Options.datas.set_data(uuid , 'y' , ~~((data.y - diff.y)))
  Options.img_datas[uuid].set_image_pos()
}

export function reset_style(){
  const datas  = Options.datas.get_all()
  for(let uuid in datas){
    Options.img_datas[uuid].reset_style()
  }
}

export function get_current_uuid(){
  const elm = Options.elements.get_active_view()
  if(!elm){return null}
  return elm.getAttribute('data-uuid')
}

// イメージ選択
export function img_select(uuid){
  new Active('active' , uuid)
  Options.shape = new Shape(uuid)
  Options.shape.view_property()
  // Options.shape.set_shape_split()
  Options.shape.get_shape_points()
  // console.log('commonj',Options.shape)
}

// イメージ選択解除
export function img_unselect(){
  new Active('all_passive')
  if(Options.shape){
    Options.shape.clear_property()
    delete Options.shape
  }
}