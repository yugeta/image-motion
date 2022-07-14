import { Options } from '../options.js'
import { Active  } from './active.js'

export function mousedown(e){
  // viewエリア以外のクリックは処理しない
  if(!Options.elements.upper_selector(e.target , `[name='view']`)){return}

  // centerポイントの移動
  if(Options.elements.upper_selector(e.target , `[name='view'] .center-scale`)){
    center_mousedown(e)
  }
  else{
    image_mousedown(e)
  }
}

export function mousemove(e){
  if(Options.move){
    image_mousemove(e)
  }
  else if(Options.image_center){
    center_mousemove(e)
  }
}

export function mouseup(e){
  if(Options.move){
    image_mouseup(e)
  }
  else if(Options.image_center){
    center_mouseup(e)
  }
}

// ----------
// Image

function image_mousedown(e){
  const img  = Options.elements.upper_selector(e.target , `[name='view'] [data-uuid]`)
  // 画像の移動または選択
  if(img){
      // drag開始処理
      if(img.getAttribute('data-status') === 'active'){
        set_drag_start(img , ~~(e.pageX) , ~~(e.pageY))
      }
      // 選択
      else{
        img_select(img)
      }
  }
  // 選択解除
  else{
    img_unselect()
  }
}

function set_drag_start(img , mx , my){
  const area       = Options.elements.get_area_view()
  const scale      = Options.common.get_scale()
  const areaRect   = area.getBoundingClientRect()
  const imgRect    = img.getBoundingClientRect()
  const uuid       = img.getAttribute('data-uuid')
  const parent_pos = get_parent_pos(uuid)
  Options.move   = {
    uuid  : uuid,
    scale : scale,
    mouse : {
      x : mx,
      y : my,
    },
    area : {
      offset : {
        x : ~~(areaRect.left),
        y : ~~(areaRect.top),
      }
    },
    img : {
      elm : img,
      pos : {
        x : ~~((imgRect.left - areaRect.left) / scale - parent_pos.x),
        y : ~~((imgRect.top  - areaRect.top)  / scale - parent_pos.y),
      },
      offset : {
        x : ~~(mx - imgRect.left),
        y : ~~(my - imgRect.top),
      },
    },
  }
}
function get_parent_pos(uuid){
  const pos = {
    x : 0,
    y : 0,
  }
  const current_data = Options.datas.get_data(uuid)
  if(current_data && current_data.parent){
    const parent_pos = Options.common.get_pos(
      Options.elements.get_uuid_view(current_data.parent),
      Options.elements.get_area_view(),
    )
    if(parent_pos){
      pos.x = parent_pos.x
      pos.y = parent_pos.y
    }
  }
  return pos
}

function img_select(img){
  const uuid = img.getAttribute('data-uuid')
  if(!uuid){return}
  // // 選択されているimageは再度選択処理をしない
  // if(this.cache.pic.getAttribute('data-status') === 'active'){return}
  new Active('active' , uuid)
}

function img_unselect(){
  new Active('all_passive')
}



function image_mousemove(e){
  const data = get_cache({
    x : ~~(e.pageX),
    y : ~~(e.pageY),
  })
  image_move(data)
  cache_save(Options.move.uuid , data)
  Options.property.update(data)
  Options.move.cache = data
}

function get_cache(option){
  const mx  = option.x
  const my  = option.y
  return {
    x : ~~((mx - Options.move.mouse.x) / Options.move.scale + Options.move.img.pos.x),
    y : ~~((my - Options.move.mouse.y) / Options.move.scale + Options.move.img.pos.y),
  }
}

function image_move(data){
  const img = Options.move.img.elm
  img.style.setProperty('top'  , `${data.y}px` , '')
  img.style.setProperty('left' , `${data.x}px` , '')
}

function cache_save(uuid , data){
  if(!uuid){return}
  for(let i in data){
    Options.datas.set_data(uuid , i , data[i])
  }
}

function image_mouseup(e){
  delete Options.move
}

// ----------
// Center

function center_mousedown(e){
  const pic    = Options.elements.upper_selector(e.target , `[name='view'] [data-uuid]`)
  const center = Options.elements.upper_selector(e.target , `[name='view'] [data-uuid] .center`)
  const cRect  = center.getBoundingClientRect()
  const cx     = center.offsetLeft
  const cy     = center.offsetTop
  const mx     = ~~(e.pageX)
  const my     = ~~(e.pageY)
  Options.image_center = {
    uuid  : pic.getAttribute('data-uuid'),
    scale : Options.common.get_scale(),
    mouse : {
      x : mx,
      y : my,
    },
    pointer : {
      elm : center,
      pos : {
        x : cx,
        y : cy,
      },
      offset : {
        x : ~~(mx - cRect.left),
        y : ~~(my - cRect.top),
      },
    },
  }
}

function center_mousemove(e){
  const ex      = ~~(e.pageX)
  const ey      = ~~(e.pageY)
  const mx      = Options.image_center.mouse.x
  const my      = Options.image_center.mouse.y
  const scale   = Options.image_center.scale
  const px      = Options.image_center.pointer.pos.x
  const py      = Options.image_center.pointer.pos.y
  const cx      = ~~((ex - mx) / scale + px)
  const cy      = ~~((ey - my) / scale + py)
  const pointer = Options.image_center.pointer.elm
  const data    = {cx : cx, cy : cy}

  cache_save(Options.image_center.uuid , data)
  Options.property.update(data)
  pointer.style.setProperty('top'  , `${cy}px` , '')
  pointer.style.setProperty('left' , `${cx}px` , '')
}

function center_mouseup(e){
  delete Options.image_center
}


