import { Options }       from '../options.js'
// import * as ImageShape   from '../images/shape.js'
// import * as ImageCommon  from '../images/common.js'
import * as ActionCommon from '../action/common.js'
import * as ShapeDeform  from '../shape/deformation.js'
import { M_Points }      from '../shape/m_points.js'
import { M_Matrix }      from '../shape/m_matrix.js'
import { Corner  }       from '../shape/corner.js'

export class Shape{

  constructor(uuid){
    if(!uuid){return}
    this.uuid  = uuid

    this.pic = Options.elements.get_uuid_view(uuid)
    if(!this.pic){return}

    const shape_use = Options.datas.get_shape_use(uuid)
    if(!shape_use){return}

    this.corner = new Corner(this.uuid)
  }

  // ----------
  // init

  set_event(){
    Options.event.set(
      Options.elements.get_shape_property_use() ,
      'click' , 
      this.click_shape_use_event.bind(this)
    )

    Options.event.set(
      Options.elements.get_shape_property_x_plus() ,
      'click' , 
      this.click_shape_segment.bind(this , 'x' , '+')
    )

    Options.event.set(
      Options.elements.get_shape_property_x_minus() , 
      'click' , 
      this.click_shape_segment.bind(this , 'x' , '-')
    )

    Options.event.set(
      Options.elements.get_shape_property_y_plus() , 
      'click' , 
      this.click_shape_segment.bind(this , 'y' , '+')
    )

    Options.event.set(
      Options.elements.get_shape_property_y_minus() , 
      'click' , 
      this.click_shape_segment.bind(this , 'y' , '-')
    )

    Options.event.set(
      Options.elements.get_shape_reset(),
      'click',
      this.click_reset.bind(this),
    )
  }


  // ----------
  // Property

  view_property(){
    const target = Options.elements.get_shape_property_info()
    if(!target){return}
    const template = Options.common.get_template('shape')
    target.innerHTML = template
    this.set_table()
    this.set_event()
    this.set_use()
  }

  clear_property(){
    const target = Options.elements.get_shape_property_info()
    target.innerHTML = ''
  }

  set_table(){
    const matrix = this.get_table()
    const table_data = Options.datas.get_shape_table(this.uuid)
    const shape_x = table_data.x || 1
    const shape_y = table_data.y || 1
    for(let y=0; y<shape_y; y++){
      const tr = document.createElement('tr')
      for(let x=0; x<shape_x; x++){
        const td = document.createElement('td')
        tr.appendChild(td)
      }
      matrix.appendChild(tr)
    }
  }

  get_table(){
    if(!this.table){
      this.table = Options.elements.get_shape_property_matrix()
    }
    return this.table
  }

  clear_table(){
    this.get_table().innerHTML = '<tr><td></td></tr>'
  }

  click_shape_use_event(e){
    this.set_shape_use(e.target.checked)
  }

  set_shape_use(check_flg){
    // shape-use on
    if(check_flg){
      this.set_shape_use_on()
    }
    // shape-use off
    else{
      if(this.is_animation_datas()
      && !confirm('Shapeアニメーションデータが削除されます。よろしいですか？')){
        // チェックをもとに戻す
        const checkbox = Options.elements.get_shape_property_use()
        checkbox.checked = true
        return
      }
      this.set_shape_use_off()
    }
    // viewのflgセット
    this.set_pic_shape_mode()
  }
  set_shape_use_on(){
    const preview = Options.elements.get_shape_property_preview()
    preview.setAttribute('data-status' , 'active')
    Options.datas.set_shape_use(this.uuid , 1)
    Options.datas.set_shape_table(this.uuid , {x:1,y:1})
    this.set_view()
  }
  set_shape_use_off(){
    const preview = Options.elements.get_shape_property_preview()
    preview.setAttribute('data-status' , '')
    Options.datas.set_shape_use(this.uuid , 0)
    Options.datas.set_shape_table(this.uuid , {x:1,y:1})
    this.clear_view()
    this.clear_shape_animation()
  }

  clear_shape_use(){
    this.set_shape_use(false)
    Options.datas.set_shape_table(this.uuid , {x:1,y:1})
    this.clear_table()
  }

  click_shape_segment(name , mode){
    const matrix_table = this.get_property_matrix()
    switch(name){
      case 'x':
        if(mode === '+'){
          this.click_shape_segment_table_add_x()
          matrix_table.x++
        }
        else if(mode === '-'){
          if(matrix_table.x <= 1){return}
          this.click_shape_segment_table_del_x()
          matrix_table.x--
        }
        break
      case 'y':
        if(mode === '+'){
          this.click_shape_segment_table_add_y()
          matrix_table.y++
        }
        else if(mode === '-'){
          if(matrix_table.y <= 1){return}
          this.click_shape_segment_table_del_y()
          matrix_table.y--
        }
        break
    }
    this.set_martix_data(matrix_table)
    this.set_view()
  }

  click_shape_segment_table_add_x(){
    let tr_arr = this.table.querySelectorAll('tr') || []
    if(!tr_arr.length){
      const tr = document.createElement('tr')
      this.table.appendChild(tr)
      tr_arr = this.table.querySelectorAll('tr')
    }
    for(let tr of tr_arr){
      const td = document.createElement('td')
      tr.appendChild(td)
    }
  }

  click_shape_segment_table_del_x(){
    const tr_arr = this.table.querySelectorAll('tr') || []
    if(!tr_arr.length){return}
    for(let tr of tr_arr){
      const td = tr.querySelector('td:last-child')
      if(!td){continue}
      tr.removeChild(td)
      if(!tr.querySelectorAll('td').length){
        tr.parentNode.removeChild(tr)
      }
    }
  }

  click_shape_segment_table_add_y(){
    let tr_arr = this.table.querySelectorAll('tr') || []
    const tr = document.createElement('tr')
    if(!tr_arr.length){
      const td = document.createElement('td')
      tr.appendChild(td)
    }
    else{
      tr.innerHTML = tr_arr[0].innerHTML
    }
    this.table.appendChild(tr)
  }

  click_shape_segment_table_del_y(){
    const tr_arr = this.table.querySelectorAll('tr') || []
    if(!tr_arr.length){return}
    this.table.removeChild(tr_arr[tr_arr.length-1])
  }

  get_property_matrix(){
    return {
      x : this.table.querySelectorAll('tr:first-child td').length,
      y : this.table.querySelectorAll('tr').length,
    }
  }


  // ----------
  // Use

  // shape-use-checkbox -> on
  set_use(){
    const shape_use = Options.datas.get_shape_use(this.uuid)
    if(!shape_use){return}

    // use
    const checkbox = Options.elements.get_shape_property_use()
    checkbox.checked = true

    // table-matrix-preview
    const preview = Options.elements.get_shape_property_preview()
    preview.setAttribute('data-status' , 'active')
  }

  // tableデータのセット
  set_martix_data(matrix){
    matrix = matrix || {}
    matrix.x = matrix.x || 1
    matrix.y = matrix.y || 1
    Options.datas.set_shape_table(this.uuid , matrix)
  }

  set_view(){
    this.clear_shape_split()
    this.set_shape_split()
    this.corner = new Corner(this.uuid)
    this.set_shape_points()
  }

  clear_view(){
    this.clear_shape_split()
    this.clear_table()
  }

  // pointを定位置に戻す
  click_reset(){
    if(!this.corner){return}
    this.corner.reset()
    const images = Options.elements.get_shape_images(this.uuid)
    for(let img of images){
      img.style.setProperty('transform' , '' , '')
    }
  }

  // データ更新(keyframe)の為のpoint座標の取得
  get_point_datas(uuid){
    uuid = uuid || this.uuid
    const images = Options.elements.get_shape_images(uuid)
    const datas = []
    for(let img of images){
      const image_num = Number(img.getAttribute('data-num'))
      const point_positions = new M_Points(uuid , image_num).points
      const image_data = []
      for(let pos of point_positions){
        image_data.push(pos)
      }
      datas.push(image_data)
    }
    return datas
  }

  // データ更新(keyframe)matrix計算結果の取得
  get_matrix_datas(uuid){
    uuid = uuid || this.uuid
    const images = Options.elements.get_shape_images(uuid)
    const datas = []
    for(let img of images){
      const image_num = Number(img.getAttribute('data-num'))
      const prev_points = Options.datas.get_shape_image(uuid , image_num).corners
      const next_points = new M_Points(uuid , image_num).points
      const matrix_data = new M_Matrix(prev_points , next_points)
      datas.push(matrix_data)
    }
    return datas
  }

  // ----------
  // Data

  set_data(){
    // Options.datas.set_shape_data(this.uuid)
    
    // animation-nameの取得
    const name = ActionCommon.get_animation_name()

    // 現在timeline値(%)の取得
    const per = ActionCommon.get_timeline_per()

    // timeline-pointの存在確認（存在しない場合は処理しない）
    if(!Options.timeline.is_point(per , 'shape')){return}

    // データ保存
    ActionCommon.set_type_value_of_view(name , this.uuid , 'shape' , per)
  }


  // ----------
  // Event

  mousedown(e){
    // shape-pointの確認
    const pic   = Options.elements.upper_selector(e.target , `[name='view'] .pic`)
    const point = Options.elements.upper_selector(e.target , `[name='view'] .pic > .shape > .shape-point`)
    if(!pic || !point){return}
    
    const area      = Options.elements.get_area_view()
    const rect      = area.getBoundingClientRect()
    const uuid      = pic.getAttribute('data-uuid')
    const image_num = point.getAttribute('data-image')

    this.shape_point_move = {
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
  mousemove(e){
    if(!this.shape_point_move){return}
    const scale = Options.common.get_scale()
    const diff = {
      x : e.pageX - this.shape_point_move.mx,
      y : e.pageY - this.shape_point_move.my,
    }
    const pos = {
      x : ~~(this.shape_point_move.x + diff.x / scale),
      y : ~~(this.shape_point_move.y + diff.y / scale),
    }
    const point = this.shape_point_move.point
    point.style.setProperty('left' , `${pos.x}px` ,'')
    point.style.setProperty('top'  , `${pos.y}px` ,'')
    const point_num = point.getAttribute('data-num')

    // deformation
    const point_data = {
      num : point_num,
      x   : pos.x,
      y   : pos.y,
    }
    const target_shape_image_datas = this.corner.get_adjacent_images(point_num)
    for(let target_shape_image_data of target_shape_image_datas){
      ShapeDeform.img(this.uuid , target_shape_image_data , point_data)
    }
  }
  mouseup(e){
    if(!this.shape_point_move){return}
    this.set_data(this.shape_point_move)
    delete this.shape_point_move
  }

  // ----------
  // Set & Clear

  // shape-splitを表示する。
  set_shape_split(){
    if(!Options.datas.get_shape_use(this.uuid)){return}
    const pic    = Options.elements.get_view_img(this.uuid)
    const shape  = Options.elements.get_view_shape(this.uuid)
    if(!pic || !shape){return}
    const data   = Options.datas.get_data(this.uuid)
    const table  = Options.datas.get_shape_table(this.uuid)
    const w      = data.w / table.x
    const h      = data.h / table.y
    let num      = 0
    for(let i=0; i<table.y; i++){
      const y = i * h
      for(let j=0; j<table.x; j++){
        const x = j * w
        this.set_element(shape , pic , x , y , w , h , data , num)
        num++
      }
    }
  }

  set_element(shape , pic , x , y , w , h , data , num){
    const div = document.createElement('div')
    shape.appendChild(div)
    div.className = 'shape-item'
    div.style.setProperty('width'  , `${w}px` , '')
    div.style.setProperty('height' , `${h}px` , '')
    div.style.setProperty('left'   , `${x}px` , '')
    div.style.setProperty('top'    , `${y}px` , '')
    const transform_origin = `-${x}px -${y}px`
    div.style.setProperty('transform-origin' , transform_origin , '')
    const img = document.createElement('img')
    div.appendChild(img)
    img.src = pic.src
    img.style.setProperty('width'  , `${data.w}px` , '')
    img.style.setProperty('height' , `${data.h}px` , '')
    img.style.setProperty('left'   , `-${x}px` , '')
    img.style.setProperty('top'    , `-${y}px` , '')
    div.setAttribute('data-num' , num)
  }

  // shape-pointの設置
  set_shape_points(){
    if(!this.check_shape_exist()){return}
    this.get_shape_points()
    this.corner.create()
  }
  // pointsデータの構築
  get_shape_points(){
    if(!this.check_shape_exist()){return}
    const data     = Options.datas.get_data(this.uuid)
    const table    = Options.datas.get_shape_table(this.uuid)
    const w        = Number((data.w / table.x).toFixed(2))
    const h        = Number((data.h / table.y).toFixed(2))
    let image_num  = 0
    for(let i=0; i<table.y; i++){
      const y = i * h
      for(let j=0; j<table.x; j++){
        const x = j * w
        const transforms = this.corner.set_transform(x , y , w , h)
        // console.log(transforms,x,y,w,h)
        this.corner.add(transforms , i , j)
        Options.datas.set_shape_corners(this.uuid , image_num , transforms)
        image_num++
      }
    }
  }

  check_shape_exist(){
    const shape_elm = Options.elements.get_view_shape(this.uuid)
    if(!shape_elm){return}
    const shape_use = Options.datas.get_shape_use(this.uuid)
    if(!shape_use || !this.corner){return}
    return true
  }

  // view-shapeの内容をクリアする
  clear_shape_split(){
    const shape_elm = Options.elements.get_view_shape(this.uuid)
    if(!shape_elm){return}
    shape_elm.innerHTML = ''
  }

  // 任意のshape情報を削除する（画像入れ替え処理にて使用）
  clear_shape(){
    const shape_splits = Options.elements.get_shape_images(this.uuid)
    shape_splits.innerHTML = ''
    Options.datas.set_shape_use(this.uuid , 0)
    this.set_pic_shape_mode()
  }

  // 対象画像のshapeデータを削除する
  clear_shape_animation(){
    // データを削除する
    Options.datas.remove_animation_shape_data(this.uuid)

    // timeline上のkeyframeを削除する（表示）
    if(Options.timeline){
      Options.timeline.clear_type_all('shape')
    }
  }

  // picのdata-shapeフラグの切り替え処理
  set_pic_shape_mode(){
    const use  = Options.datas.get_shape_use(this.uuid)
    this.pic.setAttribute('data-shape' , use)
  }

  // shapeアニメが存在するかチェックする
  is_animation_datas(){
    const animation_datas = Options.datas.get_animations()
    if(!animation_datas){return}
    const uuid = this.uuid
    for(let animation_name in animation_datas){
      const animation_data = animation_datas[animation_name]
      if(!animation_data.items
      || !animation_data.items[uuid]
      || !animation_data.items[uuid].keyframes){continue}
      for(let key_num in animation_data.items[uuid].keyframes){
        const key_data = animation_data.items[uuid].keyframes[key_num]
        if(key_data.shape){
          return true
        }
      }
    }
  }


}