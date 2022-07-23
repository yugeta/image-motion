import { Options }     from '../options.js'


/**
 * this : {
 *   {x ,y},  // top-left
 *   {x ,y},  // top-right
 *   {x ,y},  // bottom-left
 *   {x ,y},  // bottom-right
 * }
 */

export class M_Points{
  constructor(uuid ,image_num){
    this.table     = Options.datas.get_shape_table(uuid)
    this.calc = {
      x : this.table.x + 1,
      y : this.table.y + 1,
    }
    this.uuid = uuid
    this.image_num = image_num
    this.get_point_corners()
    this.get_points()
  }

  get_point_corners(){
    const image_num = this.image_num
    const x = this.calc.x
    const y = ~~(image_num / this.table.x)
    this.point_corners = []
    this.point_corners[0] = image_num + y
    this.point_corners[1] = image_num + y + 1
    this.point_corners[2] = image_num + y + x
    this.point_corners[3] = image_num + y + x + 1
  }

  get_points(){
    this.points = []
    for(let i=0; i<this.point_corners.length; i++){
      const point_num = this.point_corners[i]
      const elm = Options.elements.get_shape_point_num(this.uuid , point_num)
      const pos = {
        x : elm.offsetLeft,
        y : elm.offsetTop,
      }
      this.points.push(pos)
    }
  }

}
