import { Options }      from '../options.js'

export class Corner{
  constructor(uuid){
    this.uuid      = uuid
    this.points    = []
    this.shape_elm = Options.elements.get_view_shape(uuid)
    this.table     = Options.datas.get_shape_table(uuid)
    this.calc = {
      x : this.table.x + 1,
      y : this.table.y + 1,
    }
  }

  // top-left , top-right , bottom-left , bottom-right
  set_transform(x , y , w , h){
    const data = [
      {
        x : x,
        y : y, 
        w : w, 
        h : h,
      },
      {
        x : x + w,
        y : y, 
        w : w, 
        h : h,
      },
      {
        x : x, 
        y : y + h,
        w : w, 
        h : h,
      },
      {
        x : x + w,
        y : y + h,
        w : w,
        h : h,
      },
    ]
    return data
  }

  add(pos_arr , x , y){
    // top-left
    if(x === 0 && y === 0){
      this.points.push(pos_arr[0])
    }

    // top-right
    if(x === 0){
      this.points.push(pos_arr[1])
    }

    // bottom-left
    if(y === 0){
      this.points.push(pos_arr[2])
    }

    // bottom-right
    this.points.push(pos_arr[3])
  }

  xy_sort(){
    if(!this.points.length){return}
    this.points.sort((a,b)=>{
      if(a.y < b.y){
        return -1
      }
      else if(a.y > b.y){
        return +1
      }
      else{
        return 0
      }
    })
  }

  create(){
    // 順番に並び替える
    this.xy_sort()
    // 作成
    this.create_points()
    // this.set_point_datas()
  }

  create_points(){
    for(let i=0; i<this.points.length; i++){
      const point = this.points[i]
      const div  = document.createElement('div')
      this.shape_elm.appendChild(div)
      this.set_point_property(div , i)
    }
  }
  // set_point_datas(){
  //   Options.set_shape_points(this.points)
  // }

  set_point_property(elm , point_num){
    const data = this.points[point_num]
    elm.className = 'shape-point'
    elm.style.setProperty('left' , `${data.x}px` , '')
    elm.style.setProperty('top'  , `${data.y}px` , '')
    elm.setAttribute('data-num'       , point_num)
    // elm.setAttribute('data-image-num' , data.image_num)
  }

  // cornerポイントに隣接するimage-split番号を取得
  /**
   *  0 - 1 - 2 - 3
   *  | 0 | 1 | 2 |
   *  4 - 5 - 6 - 7
   *  | 3 | 4 | 5 |
   *  8 - 9 -10 -11
   *  | 6 | 7 | 8 |
   * 12 -13 -14 -15
   */
  get_adjacent_images(point_num){
    point_num = Number(point_num)

    // 左上
    if(point_num === 0){
      return [
        this.get_point2splitImage_bottom_right(point_num),
      ]
    }

    // 右上
    if(point_num === this.calc.x-1){
      return [
        this.get_point2splitImage_bottom_left(point_num),
      ]
    }

    // 左下
    if(point_num === this.calc.x * this.calc.y - this.calc.x){
      return [
        this.get_point2splitImage_top_right(point_num),
      ]
    }

    // 右下
    if(point_num === this.calc.x * this.calc.y -1){
      return [
        this.get_point2splitImage_top_left(point_num),
      ]
    }

    // 最上段
    if(point_num - this.calc.x < 0){
      return [
        this.get_point2splitImage_bottom_left(point_num),
        this.get_point2splitImage_bottom_right(point_num),
      ]
    }

    // 最下段
    else if(point_num >= this.calc.x * this.table.y){
      return [
        this.get_point2splitImage_top_left(point_num),
        this.get_point2splitImage_top_right(point_num),
      ]
    }

    // 中段左
    else if(point_num % this.calc.x === 0){
      return [
        this.get_point2splitImage_top_right(point_num),
        this.get_point2splitImage_bottom_right(point_num),
      ]
    }

    // 中段右
    else if(point_num % this.calc.x === this.table.x){
      return [
        this.get_point2splitImage_top_left(point_num),
        this.get_point2splitImage_bottom_left(point_num),
      ]
    }

    // 中段
    else{
      return [
        this.get_point2splitImage_top_left(point_num),
        this.get_point2splitImage_top_right(point_num),
        this.get_point2splitImage_bottom_left(point_num),
        this.get_point2splitImage_bottom_right(point_num),
      ]
    }
  }
  // 左上
  get_point2splitImage_top_left(point_num){
    const x = this.calc.x
    const y = ~~(point_num / this.calc.x)
    return {
      num  : point_num - (x + y),
      type : 'bottom-right',
    }
  }
  // 右上
  get_point2splitImage_top_right(point_num){
    const x = this.calc.x
    const y = ~~(point_num / this.calc.x)
    return {
      num  : point_num - (x + y) + 1,
      type : 'bottom-left',
    }
  }
  // 左下
  get_point2splitImage_bottom_left(point_num){
    const x = this.calc.x
    const y = ~~(point_num / this.calc.x)
    return {
      num  : point_num - (x + y) +this. table.x,
      type : 'top-right',
    }
  }
  // 右下
  get_point2splitImage_bottom_right(point_num){
    const x = this.calc.x
    const y = ~~(point_num / this.calc.x)
    return {
      num  : point_num - (x + y) + this.table.x + 1,
      type : 'top-left',
    }
  }

}
