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

export function get_table2pointDatas(uuid , datas){
  const table = Options.datas.get_shape_table(uuid)
  const point_datas = []

  // 上段 & 中段
  for(let y=0; y<table.y; y++){
    for(let x=0; x<table.x; x++){
      const img_num = table.x * y + x
      point_datas.push({
        x : datas[img_num][0].x,
        y : datas[img_num][0].y,
      })
    }
    const img_num = table.x * y + table.x -1
    point_datas.push({
      x : datas[img_num][1].x,
      y : datas[img_num][1].y,
    })
  }
  // 下段
  for(let x=0; x<table.x; x++){
    const img_num = table.x * (table.y -1) + x
    point_datas.push({
      x : datas[img_num][2].x,
      y : datas[img_num][2].y,
    })
  }
  const img_num = table.x * (table.y-1) + table.x-1
  point_datas.push({
    x : datas[img_num][3].x,
    y : datas[img_num][3].y,
  })

  return point_datas
}
