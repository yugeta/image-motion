import { Options }      from '../options.js'
import { M_Matrix }     from '../shape/m_matrix.js'
import { M_Points }     from '../shape/m_points.js'

export function img(uuid , image_data , point_data){
  const img = Options.elements.get_shape_image_num2split_image(uuid , image_data.num)
  if(!img){return}
  const prev_positions = get_prev_positions(uuid , image_data)
  // const next_positions = get_next_positions(uuid , image_data , point_data)
  const next_positions = new M_Points(uuid , image_data.num).points
  // console.log(prev_positions,next_positions)
  const matrix_data = new M_Matrix(prev_positions , next_positions)
  // Options.datas.set_shape_data(uuid , 'corners' , next_positions)
  if(!matrix_data){return}
  img.style.setProperty('transform', matrix_data.transform, '')
}

function get_prev_positions(uuid , image_data){
  const data = Options.datas.get_shape_image(uuid , image_data.num)
  return data.corners
}

function get_next_positions(uuid , image_data , point_data){
  const data = Options.datas.get_shape_image(uuid , image_data.num)
  const new_data = [
    data.corners[0],
    data.corners[1],
    data.corners[2],
    data.corners[3],
  ]
  switch(image_data.type){
    case 'top-left':
      new_data[0] = point_data
      break
    case 'top-right':
      new_data[1] = point_data
      break
    case 'bottom-left':
      new_data[2] = point_data
      break
    case 'bottom-right':
      new_data[3] = point_data
      break
  }
  return new_data
}

