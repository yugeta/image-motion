import { Options }      from '../options.js'
import * as ImageCommon from '../images/common.js'
// import { Active  } from './active.js'
// import { Shape   } from '../shape/shape.js'

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

  // image-mode(hash)以外は移動しない
  if(Options.common.get_hash() !== 'upload'){return}

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
        const uuid = img.getAttribute('data-uuid')
        ImageCommon.img_select(uuid)
      }
  }
  // 選択解除
  else{
    ImageCommon.img_unselect()
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

// function img_select(img){
//   const uuid = img.getAttribute('data-uuid')
//   if(!uuid){return}
//   // // 選択されているimageは再度選択処理をしない
//   // if(this.cache.pic.getAttribute('data-status') === 'active'){return}
//   new Active('active' , uuid)
//   Options.shape = new Shape(uuid)
// }

// function img_unselect(){
//   new Active('all_passive')
//   if(Options.shape){
//     Options.shape.clear()
//     delete Options.shape
//   }
// }



function image_mousemove(e){
  const data = get_cache({
    x : ~~(e.pageX),
    y : ~~(e.pageY),
  })
  Options.move.current_pos = data
  image_move({
    uuid : Options.move.uuid,
    elm : Options.move.img.elm , 
    pos : data,
  })
  
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

function image_move(options){
  cache_save(options.uuid , options.pos)
  Options.property.update(options.pos)
  options.elm.style.setProperty('top'  , `${options.pos.y}px` , '')
  options.elm.style.setProperty('left' , `${options.pos.x}px` , '')
}

function cache_save(uuid , data){
  if(!uuid){return}
  for(let i in data){
    Options.datas.set_data(uuid , i , data[i])
  }
}

function image_mouseup(e){
  Options.undo.add_history({
    mode : 'image_move',
    call : image_move.bind(null , {
      uuid : Options.move.uuid,
      elm  : Options.move.img.elm,
      pos  : Options.move.img.pos,
    })
  })

  Options.undo.set_current({
    mode : 'image_move',
    call : image_move.bind(null , {
      uuid : Options.move.uuid,
      elm  : Options.move.img.elm,
      pos  : Options.move.current_pos,
    })
  })

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
    pic   : pic,
    uuid  : pic.getAttribute('data-uuid'),
    scale : Options.common.get_scale(),
    mouse : {
      x : mx,
      y : my,
    },
    pointer : {
      elm : center,
      pos : {
        cx : cx,
        cy : cy,
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
  const px      = Options.image_center.pointer.pos.cx
  const py      = Options.image_center.pointer.pos.cy
  const cx      = ~~((ex - mx) / scale + px)
  const cy      = ~~((ey - my) / scale + py)
  const pointer = Options.image_center.pointer.elm
  const pos     = {cx : cx, cy : cy}
  Options.image_center.current_pos = pos
  center_move({
    uuid : Options.image_center.uuid,
    pic  : Options.image_center.pic,
    elm  : pointer, 
    pos  : pos,
  })
}

function center_move(options){
  cache_save(options.uuid , options.pos)
  Options.property.update(options.pos)
  options.elm.style.setProperty('top'  , `${options.pos.cy}px` , '')
  options.elm.style.setProperty('left' , `${options.pos.cx}px` , '')
  options.pic.style.setProperty('transform-origin' , `${options.pos.cx}px ${options.pos.cy}px` , '')
}

function center_mouseup(e){
  Options.undo.add_history({
    mode : 'center_move',
    call : center_move.bind(null , {
      uuid : Options.image_center.uuid,
      pic  : Options.image_center.pic,
      elm  : Options.image_center.pointer.elm,
      pos  : Options.image_center.pointer.pos,
    })
  })

  Options.undo.set_current({
    mode : 'center_move',
    call : center_move.bind(null , {
      uuid : Options.image_center.uuid,
      pic  : Options.image_center.pic,
      elm  : Options.image_center.pointer.elm,
      pos  : Options.image_center.current_pos,
    })
  })
  delete Options.image_center
}


