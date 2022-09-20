import { Options } from '../options.js'
import { Active  } from './active.js'
import { Shape   } from '../shape/shape.js'
import { ShapePointsReset } from '../shape/points_reset.js'
import { Property } from '../property/property.js'

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
  // shapeリセット
  new ShapePointsReset()
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

function get_current_image_uuid(){
  const active_list = document.querySelector(`.over-left .lists [data-status='active']`)
  return active_list.getAttribute('data-uuid')
}


export function image_reset(){
  if(!confirm('画像情報をリセットしてもよろしいですか？（shapeデータが失われます。）')){return}
  const current_uuid = get_current_image_uuid()
  Options.img_datas[current_uuid].set_renew_img_resize()

  // // size reset
  // 
  // const target_image = Options.elements.get_view_img(current_uuid)
  // Options.img_datas[current_uuid].cache.x = 0
  // Options.img_datas[current_uuid].cache.y = 0
  // Options.img_datas[current_uuid].cache.w = target_image.naturalWidth
  // Options.img_datas[current_uuid].cache.h = target_image.naturalHeight
  // Options.img_datas[current_uuid].set_image_size()
  // Options.img_datas[current_uuid].cache.cx = 0
  // Options.img_datas[current_uuid].cache.cy = 0
  // Options.img_datas[current_uuid].set_center_pos()
  
  // // property反映
  // Options.property.update(Options.img_datas[current_uuid].cache)

  // // shape reset
  // if(Options.shape){
  //   Options.shape.click_reset()
  // }
  // new ShapePointsReset()

  // // shape data delete

}

