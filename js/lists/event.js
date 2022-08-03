import { Options }      from '../options.js'
import * as ImageCommon from '../images/common.js'

export function mousedown(e){
  // listsエリア以外のクリックは処理しない
  const item = Options.elements.upper_selector(e.target , `[name='images'] .lists .item[data-uuid]`)
  if(!item){return}

  // visibility
  const visibility = Options.elements.upper_selector(e.target , `.visibility`)
  if(!Options.list_drag && visibility){
    click_visibility(item , visibility)
    return
  }

  // folder
  const folder = Options.elements.upper_selector(e.target , `.folder`)
  if(!Options.list_drag && folder){
    click_folder(item , folder)
    return
  }

  const mouse = {
    x : ~~(e.pageX),
    y : ~~(e.pageY),
  }

  // sort
  if(Options.elements.upper_selector(e.target , `[name='images'] .drag`)){
    sert_mousedown(item , mouse)
  }
}

export function mousemove(e){
  const mouse = {
    x : ~~(e.pageX),
    y : ~~(e.pageY),
  }
  sort_mousemove(mouse , e.target)
  over_scroll(mouse)
}

export function mouseup(e){
  sort_mouseup(e)
}

function sert_mousedown(item , mouse){
  const itemRect = item.getBoundingClientRect()
  const pos = {
    x : itemRect.left,
    y : itemRect.top,
  }
  const offset = {
    x : pos.x - mouse.x,
    y : pos.y - mouse.y,
  }
  const size = {
    w : itemRect.width,
    h : item.querySelector(':scope > .info').offsetHeight,
  }
  const items  = Options.elements.get_image_lists()
  const area   = Options.elements.get_list_area()
  const scroll = area.scrollTop
  const uuid = item.getAttribute('data-uuid')

  // view-target
  const view_target = Options.elements.get_uuid_view(uuid)
  const view_rect   = view_target.getBoundingClientRect()
  const area_rect   = area.getBoundingClientRect()

  const data = {
    uuid        : uuid,
    item        : item,
    items       : items,
    mouse       : mouse,
    pos         : pos,
    offset      : offset,
    size        : size,
    scroll      : scroll,
    view_target : view_target,
    view_rect   : view_rect,
    area        : area,
    area_rect   : area_rect,
    before_pos  : {
      x : view_target.offsetLeft,
      y : view_target.offsetTop,
    }
  }

  // float作成
  data.elm = make_sort_float(data)

  // data-set
  Options.list_drag = data

  // status変更
  area.setAttribute('data-status' , 'sort')
  item.setAttribute('data-status' , 'sort')
  
}
function make_sort_float(data){
  const floatItem = document.createElement('div')
  floatItem.setAttribute('class','lists_sortItem')
  floatItem.style.setProperty('width' ,`${data.size.w}px`,'')
  floatItem.style.setProperty('height',`${data.size.h}px`,'')
  floatItem.style.setProperty('top'   ,`${data.pos.y}px`,'')
  floatItem.style.setProperty('left'  ,`${data.pos.x}px`,'')
  floatItem.innerHTML = data.item.innerHTML
  const contents = Options.elements.get_root()
  contents.appendChild(floatItem)
  return floatItem
}

function sort_mousemove(mouse , target){
  if(!Options.list_drag){return}
  const pos = {
    x : mouse.x - Options.list_drag.mouse.x + Options.list_drag.pos.x,
    y : mouse.y - Options.list_drag.mouse.y + Options.list_drag.pos.y,
  }
  Options.list_drag.elm.style.setProperty('top'   ,`${pos.y}px`,'')
  Options.list_drag.elm.style.setProperty('left'  ,`${pos.x}px`,'')

  clear_overlap_item()
  const overlap_target = Options.elements.upper_selector(target , '.item[data-uuid]')
  if(!overlap_target || overlap_target === Options.list_drag.item){return}
  set_flg_sort_target(Options.list_drag.item , overlap_target , mouse)
}

// item移動が枠の上（下）を超えて移動した場合、内部リストをスクロールさせる
function over_scroll(mouse){
  if(!Options.list_drag){return}
  const rect_area = Options.list_drag.area_rect
  const over_pos  = mouse.y - rect_area.top
  const under_pos = mouse.y - (rect_area.top + rect_area.height)

  // 上にスクロール
  if(over_pos < 0){
    scroll_lists(-1)
  }
  // 下にスクロール
  else if(under_pos > 0){
    scroll_lists(+1)
  }
  
}

function scroll_lists(direction){
  if(!Options.list_drag){return}
  // console.log(direction)
  Options.list_drag.area.scrollTop += direction
}

function set_flg_sort_target(current , target , mouse){
  const targetRect = target.querySelector(':scope > .info').getBoundingClientRect()
  // 上項目
  if(current.offsetTop > target.offsetTop){
    Options.list_drag.next = target
    if(mouse.y - targetRect.top > targetRect.height / 2){
      target.setAttribute('data-sort-target' , '0')
    }
    else{
      target.setAttribute('data-sort-target' , '-1')
    }
  }
  // 下項目
  else{
    Options.list_drag.next = target
    if(mouse.y - targetRect.top < targetRect.height / 2){
      target.setAttribute('data-sort-target' , '0')
    }
    else{
      target.setAttribute('data-sort-target' , '1')
    }
  }
}

function clear_overlap_item(){
  for(let item of Options.list_drag.items){
    if(item.hasAttribute('data-sort-target')){
      item.removeAttribute('data-sort-target')
    }
  }
}

function sort_mouseup(e){
  if(!Options.list_drag){return}
  
  const floatItem = document.querySelector('.lists_sortItem')
  if(floatItem){
    floatItem.parentNode.removeChild(floatItem)
  }

  // status変更
  const area = Options.elements.get_list_area()
  if(area && area.hasAttribute('data-status')){
    area.removeAttribute('data-status')
  }
  const item = Options.list_drag.item
  if(item && item.hasAttribute('data-status')){
    item.removeAttribute('data-status')
  }

  set_overlap()
  clear_overlap_item()
  ImageCommon.set_level(Options.list_drag.view_target)
  set_view_image_pos_correction()

  // // undo : sort処理が複雑なので、今の所搭載しない予定
  // Options.undo.add_history({
  //   mode : 'lists_sort',
  //   call : image_move.bind(null , {
  //     uuid : Options.move.uuid,
  //     elm  : Options.move.img.elm,
  //     pos  : Options.move.img.pos,
  //   })
  // })
  // Options.undo.set_current({
  //   mode : 'lists_sort',
  //   call : image_move.bind(null , {
  //     uuid : Options.move.uuid,
  //     elm  : Options.move.img.elm,
  //     pos  : Options.move.current_pos,
  //   })
  // })

  delete Options.list_drag

}

function set_overlap(){
  if(!Options.list_drag.next){return}
  const current = Options.list_drag.item
  const target  = Options.list_drag.next
  const flg = target.getAttribute('data-sort-target')
  if(!flg){return}
  switch(flg){
    // 下に追加
    case '1':
      sort_down(current , target)
      break
    // 上に追加
    case '-1':
      sort_up(current , target)
      break
    // 階層に挿入
    case '0':
      insert_level(current ,target)
      break
    default:
      console.log(flg)
  }
}
function sort_up(current , target){
  target.parentNode.insertBefore(current , target)
  set_sibling(current , target)
}

function sort_down(current , target){
  if(!target){return}
  if(target.nextSibling){
    target.parentNode.insertBefore(current , target.nextSibling)
  }
  else{
    target.parentNode.appendChild(current)
  }
  set_sibling(current , target)
}
function set_sibling(current , target){
  const current_uuid = current.getAttribute('data-uuid')
  const current_data = Options.datas.get_data(current_uuid)
  const target_uuid  = target.getAttribute('data-uuid')
  const target_data  = Options.datas.get_data(target_uuid)
  if(target_data.parent){
    current_data.parent = target_data.parent
  }
  else if(current_data.parent){
    delete current_data.parent
  }
}
function set_parent(current ,target){
  const current_uuid  = current.getAttribute('data-uuid')
  const current_data  = Options.datas.get_data(current_uuid)
  const target_uuid   = target.getAttribute('data-uuid')
  current_data.parent = target_uuid
}

function insert_level(current ,target){
  try{
    const sub_lists = target.querySelector(':scope > .sub-lists')
    if(sub_lists){
      sub_lists.appendChild(current)
    }
    set_parent(current ,target)
  }
  catch(err){
    console.warn(err)
  }
}


// ----------
// Level set
// view-imageの座標を階層が切り替わったタイミングでずれないように補正する
function set_view_image_pos_correction(){
  const area_elm  = Options.elements.get_area_view()
  const area_rect = area_elm.getBoundingClientRect()
  const next_rect = Options.list_drag.view_target.getBoundingClientRect()
  
  const next_pos = {
    x : next_rect.left - area_rect.left,
    y : next_rect.top  - area_rect.top,
  }
  const prev_pos = {
    x : Options.list_drag.view_rect.left - area_rect.left,
    y : Options.list_drag.view_rect.top  - area_rect.top,
  }
  // const next_pos = {
  //   x : Options.list_drag.view_target.offsetLeft,
  //   y : Options.list_drag.view_target.offsetTop,
  // }
  // const prev_pos = {
  //   x : Options.list_drag.before_pos.x,
  //   y : Options.list_drag.before_pos.y,
  // }
  const scale = Options.common.get_scale()
  const diff  = {
    x : (next_pos.x - prev_pos.x) / scale,
    y : (next_pos.y - prev_pos.y) / scale,
    // base_x : next_pos.x - curerent_pos.x,
    // base_y : next_pos.y - curerent_pos.y,
    // scale  : scale,
    prev_x : prev_pos.x,
    prev_y : prev_pos.y,
    next_x : next_pos.x,
    next_y : next_pos.y,
  }
  // console.log(diff)
  ImageCommon.set_offset_pic(Options.list_drag.uuid , diff)
}

// ----------
// Visibility
function click_visibility(item , visibility){
  const status = visibility.getAttribute('data-status')
  const uuid   = item.getAttribute('data-uuid')
  const image  = Options.elements.get_uuid_view(uuid)
  // hidden -> visible
  if(status === 'hidden'){
    visibility.removeAttribute('data-status')
    image.classList.remove('hidden')
    Options.datas.set_data(uuid , 'hidden' , 0)
    // ImageCommon.img_unselect()
  }
  // visible -> hidden
  else{
    visibility.setAttribute('data-status' , 'hidden')
    image.classList.add('hidden')
    Options.datas.set_data(uuid , 'hidden' , 1)
    // ImageCommon.img_select(uuid)
  }
  
}

// ----------
// Folder
function click_folder(item , folder){
  switch(folder.getAttribute('data-status')){
    case 'open':
      folder.setAttribute('data-status' , 'close')
      item.setAttribute('data-folder-status' , 'close')
      break
    case 'close':
      folder.setAttribute('data-status' , 'open')
      item.setAttribute('data-folder-status' , 'open')
      break
  }
}



