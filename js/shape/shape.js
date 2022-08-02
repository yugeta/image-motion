import { Options }     from '../options.js'
import * as ImageShape from '../images/shape.js'
import { M_Points }    from './m_points.js'
import { M_Matrix }    from './m_matrix.js'

export class Shape{
  constructor(uuid){
    if(!uuid){return}
    const view_elm = Options.elements.get_uuid_view(uuid)
    if(!view_elm){return}
    this.uuid = uuid
    this.view = view_elm
    this.view_property()
    this.set_event()
    this.set_use()
    this.set_data()
  }

  clear(){
    this.clear_property()
  }
  clear_property(){
    const target = Options.elements.get_shape_property_info()
    target.innerHTML = ''
  }

  view_property(){
    const target = Options.elements.get_shape_property_info()
    if(!target){return}
    const template = Options.common.get_template('shape')
    target.innerHTML = template
    this.set_matrix()
  }
  set_matrix(){
    const matrix_table = Options.elements.get_shape_property_matrix()
    if(!matrix_table){return}
    const table = Options.datas.get_shape_table(this.uuid)
    const shape_x = table.x || 1
    const shape_y = table.y || 1
    for(let y=0; y<shape_y; y++){
      const tr = document.createElement('tr')
      for(let x=0; x<shape_x; x++){
        const td = document.createElement('td')
        tr.appendChild(td)
      }
      matrix_table.appendChild(tr)
    }
  }
  clear_matric(){
    const matrix_table = Options.elements.get_shape_property_matrix()
    matrix_table.innerHTML = ''
  }

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

  click_shape_use_event(e){
    this.click_shape_use(e.target)
  }
  click_shape_use(target){
    const preview = Options.elements.get_shape_property_preview()
    switch(target.checked){
      case true:
        preview.setAttribute('data-status' , 'active')
        Options.datas.set_shape_use(this.uuid , 1)
        Options.datas.set_shape_table(this.uuid , {x:1,y:1})
        this.set_view()
        break

      case false:
      default:
        preview.setAttribute('data-status' , '')
        Options.datas.set_shape_use(this.uuid , 0)
        this.clear_view()
        break
    }
    
    // viewのflgセット
    ImageShape.set_pic_shape_mode(this.uuid)
  }
  clear_shape_use(){
    const checkbox = Options.elements.get_shape_property_use()
    checkbox.checked = false
    this.click_shape_use(checkbox)
    Options.datas.set_shape_table(this.uuid , {x:1,y:1})
    this.clear_matric()
  }

  click_shape_segment(name , mode){
    const matrix_table = this.get_property_matrix()
    // let add = 0
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
    const matrix = Options.elements.get_shape_property_matrix()
    let tr_arr = matrix.querySelectorAll('tr') || []
    if(!tr_arr.length){
      const tr = document.createElement('tr')
      matrix.appendChild(tr)
      tr_arr = matrix.querySelectorAll('tr')
    }
    for(let tr of tr_arr){
      const td = document.createElement('td')
      tr.appendChild(td)
    }
  }
  click_shape_segment_table_del_x(){
    const matrix = Options.elements.get_shape_property_matrix()
    const tr_arr = matrix.querySelectorAll('tr') || []
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
    const matrix = Options.elements.get_shape_property_matrix()
    let tr_arr = matrix.querySelectorAll('tr') || []
    const tr = document.createElement('tr')
    if(!tr_arr.length){
      const td = document.createElement('td')
      tr.appendChild(td)
    }
    else{
      tr.innerHTML = tr_arr[0].innerHTML
    }
    matrix.appendChild(tr)
  }

  click_shape_segment_table_del_y(){
    const matrix = Options.elements.get_shape_property_matrix()
    const tr_arr = matrix.querySelectorAll('tr') || []
    if(!tr_arr.length){return}
    matrix.removeChild(tr_arr[tr_arr.length-1])
  }

  get_property_matrix(){
    const elm = Options.elements.get_shape_property_matrix()
    if(!elm){return}
    return {
      x : elm.querySelectorAll('tr:first-child td').length,
      y : elm.querySelectorAll('tr').length,
    }
  }

  set_use(){
    const data = Options.datas.get_data(this.uuid)
    if(data && data.shape_use){
      // use
      const flg = Options.elements.get_shape_property_use()
      flg.checked = true
      // table-matrix-preview
      const preview = Options.elements.get_shape_property_preview()
      preview.setAttribute('data-status' , 'active')
    }
  }

  set_martix_data(matrix){
    matrix = matrix || {}
    matrix.x = matrix.x || 1
    matrix.y = matrix.y || 1
    Options.datas.set_shape_table(this.uuid , matrix)
  }

  set_view(){
    ImageShape.clear_shape_split(this.uuid)
    ImageShape.set_shape_split(this.uuid)
  }
  clear_view(){
    ImageShape.clear_shape_split(this.uuid)
  }

  set_data(){
    // Options.datas.set_shape_data(this.uuid)
  }

  click_reset(){
    if(!Options.shape){return}
    Options.shape.reset_points()
    Options.shape.reset_images()
  }

  reset_points(){
    const points = Options.elements.get_shape_points(this.uuid)
    const datas = Options.corner.points

    for(let i=0; i<points.length; i++){
      const point = points[i]
      const pos = {
        x: datas[i].x,
        y: datas[i].y,
      }
      point.style.setProperty('left' , `${pos.x}px` , '')
      point.style.setProperty('top'  , `${pos.y}px` , '')
    }

  }
  reset_images(){
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

}