import { Options }     from '../options.js'

export function get_shape_images(options){
  if(!options){return}
  const uuid        = options.uuid
  const point_num   = options.point.getAttribute('data-point-num')
  const shape_table = Options.datas.get_shape_table(uuid)
  if(!shape_table){return}
  
}

export function get_split_image2positions(uuid , image_num){

}

export function get_current_per_data(name , uuid , type , per){
  return {
    points : Options.shape.get_point_datas(uuid),
    matrix : Options.shape.get_matrix_datas(uuid),
  }
}
