
export class Gap{
  constructor(options , animation_name){
    this.options = options
    this.animation_name = animation_name
    this.gap_tmp = {min:{x:0,y:0},max:{x:0,y:0}}
    this.set()
    // console.log(this.datas[0]['B3ED585C-CF15-48AA-8D21-F07CB5974E32'])
  }
  get datas(){
    return this.options.data.transform_animation[this.animation_name]
  }

  set(){
    for(let keyframe in this.datas){
      for(let uuid in this.datas[keyframe]){
        const data = this.datas[keyframe][uuid]
        if(data.shape_data && data.shape_data.gap){
          data.gap.min.x += data.shape_data.gap.min.x
          data.gap.min.y += data.shape_data.gap.min.y
          data.gap.max.x += data.shape_data.gap.max.x
          data.gap.max.y += data.shape_data.gap.max.y
        }
        this.set_image_gap(data)
      }
    }
  }
  set_image_gap(data){
    if(!data || !data.gap || !data.gap.min || !data.gap.max){return}
    if(this.gap_tmp.min.x > data.gap.min.x){
      this.gap_tmp.min.x = data.gap.min.x
    }
    if(this.gap_tmp.min.y > data.gap.min.y){
      this.gap_tmp.min.y = data.gap.min.y
    }
    if(this.gap_tmp.max.x < data.gap.max.x){
      this.gap_tmp.max.x = data.gap.max.x
    }
    if(this.gap_tmp.max.y < data.gap.max.y){
      this.gap_tmp.max.y = data.gap.max.y
    }
  }

  get min(){
    return this.gap_tmp.min
  }

  get max(){
    return this.gap_tmp.max
  }
}