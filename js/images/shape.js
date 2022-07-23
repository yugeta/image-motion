import { Options }      from '../options.js'
import * as ShapeCommon from '../shape/common.js'
import * as ShapeDeform from '../shape/deformation.js'
import * as ImageCommon from '../images/common.js'
// import { M_Matrix  }    from '../shape/m_matrix.js'
import { Corner  }      from '../shape/corner.js'

/* Event */
export function mousedown(e){
  const pic   = Options.elements.upper_selector(e.target , `[name='view'] .pic`)
  const point = Options.elements.upper_selector(e.target , `[name='view'] .pic > .shape > .shape-point`)
  if(!pic || !point){return}

  
  const area      = Options.elements.get_area_view()
  const rect      = area.getBoundingClientRect()
  const uuid      = pic.getAttribute('data-uuid')
  const image_num = point.getAttribute('data-image')

  Options.shape_point_move = {
    mx        : e.pageX,
    my        : e.pageY,
    x         : point.offsetLeft,
    y         : point.offsetTop,
    area      : area,
    rect      : rect,
    point     : point,
    uuid      : uuid,
    image_num : image_num,
  }
}
export function mousemove(e){
  if(!Options.shape_point_move){return}
  const scale = Options.common.get_scale()
  const diff = {
    x : e.pageX - Options.shape_point_move.mx,
    y : e.pageY - Options.shape_point_move.my,
  }
  const pos = {
    x : ~~(Options.shape_point_move.x + diff.x / scale),
    y : ~~(Options.shape_point_move.y + diff.y / scale),
  }
  const point = Options.shape_point_move.point
  point.style.setProperty('left' , `${pos.x}px` ,'')
  point.style.setProperty('top'  , `${pos.y}px` ,'')
  const point_num = point.getAttribute('data-num')
// console.log(point)

  // deformation
  const point_data = {
    num : point_num,
    x   : pos.x,
    y   : pos.y,
  }
  const uuid = ImageCommon.get_current_uuid()
  const target_shape_image_datas = Options.corner.get_adjacent_images(point_num)
  for(let target_shape_image_data of target_shape_image_datas){
    ShapeDeform.img(uuid , target_shape_image_data , point_data)
  }
  // const target_shape_images = ShapeCommon.get_shape_images(Options.shape_point_move)
  // console.log(point_num , target_shape_images)
  // return
  // const data        = Options.img_datas[Options.shape_point_move.uuid] 

  // const prev_points = data.shape_images[Options.shape_point_move.image_num]
  // console.log(prev_points)
  // const next_points = JSON.parse(JSON.stringifu(prev_points))
  // const matrix_data = new Matrix(prev_points , next_points)
}
export function mouseup(e){
  if(!Options.shape_point_move){return}
  delete Options.shape_point_move
}



// picのdata-shapeフラグの切り替え処理
export function set_pic_shape_mode(uuid){
  const use  = Options.datas.get_shape_use(uuid)
  const elm  = Options.elements.get_uuid_view(uuid)
  if(!elm){return}
  elm.setAttribute('data-shape' , use)
}

// view-shapeの内容をクリアする
export function clear_shape_split(uuid){
  const shape_elm = Options.elements.get_view_shape(uuid)
  if(!shape_elm){return}
  shape_elm.innerHTML = ''
}

// view-shapeをセットする。
export function set_shape_split(uuid){
  if(!Options.datas.get_shape_use(uuid)){return}
  const pic_img   = Options.elements.get_view_img(uuid)
  const shape_elm = Options.elements.get_view_shape(uuid)
  if(!pic_img || !shape_elm){return}
  const data      = Options.datas.get_data(uuid)
  const table     = Options.datas.get_shape_table(uuid)
  const w         = data.w / table.x
  const h         = data.h / table.y
  let num         = 0
  for(let i=0; i<table.y; i++){
    const y = i * h
    for(let j=0; j<table.x; j++){
      const x = j * w
      set_element(shape_elm,pic_img,x,y,w,h,data,num)
      num++
    }
  }
  set_shape_points(uuid)
}

export function set_element(shape_elm,pic_img,x,y,w,h,data,num){
  const div = document.createElement('div')
  div.className = 'shape-item'
  div.style.setProperty('width'  , `${w}px` , '')
  div.style.setProperty('height' , `${h}px` , '')
  div.style.setProperty('left'   , `${x}px` , '')
  div.style.setProperty('top'    , `${y}px` , '')
  const transform_origin = `-${x}px -${y}px`
  div.style.setProperty('transform-origin' , transform_origin , '')
  const img = document.createElement('img')
  img.src = pic_img.src
  img.style.setProperty('width'  , `${data.w}px` , '')
  img.style.setProperty('height' , `${data.h}px` , '')
  img.style.setProperty('left'   , `-${x}px` , '')
  img.style.setProperty('top'    , `-${y}px` , '')
  div.appendChild(img)
  shape_elm.appendChild(div)
  div.setAttribute('data-num' , num)
}

// shape-pointの設置
export function set_shape_points(uuid){
  const shape_elm = Options.elements.get_view_shape(uuid)
  if(!shape_elm){return}
  Options.corner = new Corner(uuid)
  const data     = Options.datas.get_data(uuid)
  const table    = Options.datas.get_shape_table(uuid)
  const w        = decimal_num(data.w / table.x)
  const h        = decimal_num(data.h / table.y)
  let image_num  = 0
  for(let i=0; i<table.y; i++){
    const y = i * h
    for(let j=0; j<table.x; j++){
      const x = j * w
      const pos = Options.corner.set_transform(x , y , w , h)
      Options.corner.add(pos , i , j)
      Options.datas.set_shape_corners(uuid , image_num , pos)
      image_num++
    }
  }
  Options.corner.create()
}

// 少数第二位で四捨五入
function decimal_num(num){
  return Math.round(Number(num) * 100) / 100
}

function set_point_property(elm , pos , image_num , point_num){
  elm.className = 'shape-point'
  elm.style.setProperty('left' , `${pos.x}px` , '')
  elm.style.setProperty('top'  , `${pos.y}px` , '')
  elm.setAttribute('data-point-num' , point_num)

  // image-nums
  elm.setAttribute('data-image-num-array' , image_num)
}



