import { Options }       from '../options.js'
import { Shape }         from './shape.js'

/**
 * keyframeデータが無い場合にshape-pointsを初期座標にリセットする処理
 */

export class ShapePointsReset{
  constructor(){
    this.items = Options.elements.get_image_lists()
    if(!this.items || !this.items.length){return}
    this.set_lists()
  }
  set_lists(){
    for(let item of this.items){
      const uuid = item.getAttribute('data-uuid')
      if(!Options.datas.get_shape_use(uuid)){continue}
      this.point_reset(uuid)
    }
  }
  point_reset(uuid){
    const shape = new Shape(uuid)
    shape.set_view()
  }
}