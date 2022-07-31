import { Matrix } from './matrix.js'

export class Event{
  constructor(options){
    this.options = options
    this.set_images()
  }

  set_images(){
    for(let data of this.options.data.images){
      if(data.shape_use === 1){
        this.set_event_shape(data)
      }
    }
  }

  set_event_shape(data){
    const pic = this.options.root.querySelector(`[data-uuid='${data.uuid}']`)
    if(!pic){return}
    pic.addEventListener('animationstart'     , this.shape_play.bind(this , data.num))
    pic.addEventListener('animationiteration' , this.shape_play.bind(this , data.num))
    pic.addEventListener('animationcancel'    , this.shape_stop.bind(this , data.num))
  }

  shape_play(image_num , e){
    const elm = e.target
    const uuid = elm.getAttribute('data-uuid')
    if(!uuid){return}
    const anim_name = this.options.root.getAttribute('data-action')
    const anim = this.options.data.animations[anim_name]
    if(!anim
    || !anim.items
    || !anim.items[uuid]
    || !anim.items[uuid].keyframes){return}
    if(this.is_shape(anim.items[uuid].keyframes) !== true){return}
    const start            = (+new Date())
    this.cache             = anim
    this.cache.count       = 0
    this.cache.start       = start
    this.cache.per         = null
    this.cache.splits      = this.options.data.images[image_num].shape_splits
    this.cache.keyframes   = anim.items[uuid].keyframes
    this.cache.base_points = this.options.data.images[image_num].shape_points
    this.cache.duration    = this.options.data.images[image_num].duration || 1
    this.cache.time        = this.cache.duration / 100
    
    this.shape_view(start)
  }

  is_shape(keyframes){
    if(!keyframes){return}
    for(let per in keyframes){
      if(keyframes[per].shape){
        return true
      }
    }
  }

  shape_view(flg){
    if(!this.cache){return}
    
    if(flg !== this.cache.start){return}
    const progress = ((+new Date()) - this.cache.start) / 1000
    const rate = progress / this.cache.duration
    const per = Math.round(rate * 100)

    if(per !== this.cache.per){
      this.cache.per = per
      for(let num=0; num<this.cache.splits.length; num++){
        let matrix_data = ''
        if(this.cache.keyframes[this.cache.per]){
          if(!this.cache.keyframes[this.cache.per].shape){continue}
          matrix_data = this.cache.keyframes[this.cache.per].shape.matrix[num]
        }
        else{
          const next_positions = this.get_shape_next_points(num , this.cache.keyframes)
          if(!next_positions){continue}
          matrix_data = new Matrix(this.cache.base_points[num] , next_positions)
        }
        if(!matrix_data){continue}
        this.cache.splits[num].style.setProperty('transform', matrix_data.transform, '')
      }
    }
    if(per >= 100){return}
    setTimeout(this.shape_view.bind(this , this.cache.start) , this.cache.time * 1000)
  }

  shape_stop(e){
    // console.log('stop')
    if(!this.cache){return}
    delete this.cache
  }

  get_shape_next_points(num , keyframes){
    const res = this.get_shape_between_keyframes(this.cache.per , keyframes)
    if(!res){return}
    if(!keyframes[res.start].shape){return}
    const start_points = keyframes[res.start].shape.points
    const end_points   = keyframes[res.end].shape.points
    const points = []
    for(let j=0; j<start_points[num].length; j++){
      points.push({
        x : start_points[num][j].x + (end_points[num][j].x - start_points[num][j].x) * res.rate,
        y : start_points[num][j].y + (end_points[num][j].y - start_points[num][j].y) * res.rate,
      })
    }
    return points
  }

  get_shape_between_keyframes(per , keyframes){
    const frames = Object.keys(keyframes)
    // keyがあるフレームの場合
    if(keyframes[per]){
      return {
        start : per, 
        end   : per,
        rate  : 1.0,
      }
    }
    // keyが無いブレームの場合
    for(let i=0; i<frames.length-1; i++){
      const current = Number(per)
      const before  = Number(frames[i])
      const after   = Number(frames[i+1])
      if(before < current && current < after){
        return {
          start : before, 
          end   : after,
          rate  : (current - before) / (after - before),
        }
      }
    }
  }


}