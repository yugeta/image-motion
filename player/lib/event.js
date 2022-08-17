import { Options } from '../options.js'
import { Matrix }  from './matrix.js'

export class Event{
  constructor(options){
    this.datas = {}
    this.options = options
    this.set_images()
  }

  set_images(){
    for(let data of this.options.data.images){
      if(data.shape_use === 1){
        this.set_mutation(data)
      }
    }
  }

  is_shape(keyframes){
    if(!keyframes){return}
    for(let per in keyframes){
      if(keyframes[per].shape){
        return true
      }
    }
  }

  // ----------
  // mutation
  set_mutation(data){
    const pic = this.options.root.querySelector(`[data-uuid='${data.uuid}']`)
    if(!pic){return}
    if(!pic.querySelector(':scope > .shape')){return}
    Options.shapes[data.uuid] = {
      root        : this.options.root,
      uuid        : data.uuid,
      image_num   : data.num,
      options     : this.options,
      animations  : JSON.parse(JSON.stringify(this.options.data.animations)),
      splits      : pic.querySelectorAll(':scope > .shape > .shape-item'),
      base_points : JSON.parse(JSON.stringify(this.options.data.images[data.num].shape_points)),
    }
    const anim_name = this.options.root.getAttribute('data-action')
    new MutationObserver(((uuid , e)=>{
      this.update_mutation(uuid , e)
    }).bind(this , data.uuid))
    .observe(this.options.root , {
      attributes : true, 
      childList  : false,
      subtree    : false,
    })
    this.shape_play_mutation(data.uuid , anim_name , pic)
  }

  update_mutation(uuid , e){
    const root = e[0].target
    const anim_name = root.getAttribute('data-action')
    const pic = root.querySelector(`.pic[data-uuid='${uuid}']`)
    if(anim_name && this.is_animetion(uuid , anim_name)){
      this.shape_play_mutation(uuid , anim_name , pic)
    }
    else{
      this.shape_stop_mutation(uuid)
    }
  }

  is_animetion(uuid , anim_name){
    const anim_data = Options.shapes[uuid].animations[anim_name]
    if(anim_data
    && anim_data.items
    && anim_data.items[uuid]
    && this.is_shape(anim_data.items[uuid].keyframes)){
      return true
    }
    else{
      return false
    }
  }

  shape_play_mutation(uuid , anim_name , pic){
    if(!pic.querySelector(':scope > .shape')){return}
    if(!uuid){return}
    const datas     = Options.shapes[uuid]
    const anim_data = datas.animations[anim_name]
    if(!anim_data
    || !anim_data.items
    || !anim_data.items[uuid]
    || !anim_data.items[uuid].keyframes){return}
    if(this.is_shape(anim_data.items[uuid].keyframes) !== true){return}
    const start            = (+new Date())
    this.datas[uuid]             = anim_data
    this.datas[uuid].max_count   = this.get_max_count(anim_data)
    this.datas[uuid].current_count = 0
    this.datas[uuid].start       = start
    this.datas[uuid].per         = null
    this.datas[uuid].splits      = datas.splits
    this.datas[uuid].keyframes   = anim_data.items[uuid].keyframes
    this.datas[uuid].base_points = datas.base_points
    this.datas[uuid].duration    = this.get_duration(uuid,anim_name)
    this.datas[uuid].time        = this.datas[uuid].duration / 100
    this.shape_view_mutation(start , uuid)
  }
  get_max_count(anim_data){
    if(anim_data.count === undefined){return null}
    const reg = /^\d+?$/.exec(anim_data.count)
    if(!reg){return null}
    return reg[0]
  }
  get_duration(uuid , anim_name){
    return Options.shapes[uuid].animations[anim_name].duration || 1
  }

  shape_view_mutation(flg , uuid){
    const data = this.datas[uuid]
    if(!data){return}
    if(flg !== data.start){return}
    const progress = ((+new Date()) - data.start) / 1000
    const rate = progress / data.duration
    const per = Math.round(rate * 100)
    if(per !== data.per){
      data.per = per
      for(let num=0; num<data.splits.length; num++){
        const matrix_data = this.get_martix(num , uuid)
        
        if(!matrix_data){continue}
        data.splits[num].style.setProperty('transform', matrix_data.transform, '')
      }
    }
    if(per >= 100){
      data.start = (+new Date())
      // 回数指定がある場合は処理を停止する
      this.datas[uuid].current_count++
      if(this.datas[uuid].max_count !== null
      && this.datas[uuid].max_count <= this.datas[uuid].current_count){return}
    }
    setTimeout(this.shape_view_mutation.bind(this , data.start , uuid) , data.time * 1000)
  }
  get_martix(num , uuid){
    const data = this.datas[uuid]
    if(data.keyframes[data.per]){
      if(!data.keyframes[data.per].shape){return}
      return data.keyframes[data.per].shape.matrix[num]
    }
    else{
      const next_positions = this.get_shape_next_points(num , data.keyframes , data.per)
      if(!next_positions){return}
      return new Matrix(data.base_points[num] , next_positions)
    }
  }

  shape_stop_mutation(uuid){
    if(!this.datas[uuid]){return}
    for(let split of this.datas[uuid].splits){
      split.style.setProperty('transform','','')
    }
    delete this.datas[uuid]
  }

  // ----------
  // shape animation play
  get_shape_next_points(num , keyframes , per){
    const res = this.get_shape_between_keyframes(per , keyframes)
    if(!res){return}
    if(!keyframes[res.start].shape
    || !keyframes[res.end].shape
    || !keyframes[res.start].shape.points
    || !keyframes[res.end].shape.points){
      return
    }
    // 
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
    const frames = this.get_shape_frames(keyframes)
    // keyがあるフレームの処理
    if(keyframes[per]){
      return {
        start : per, 
        end   : per,
        rate  : 1.0,
      }
    }
    // keyが無いブレームの処理
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

  // shapeのみのkey-frameをピックアップする
  get_shape_frames(keyframes){
    const arr = []
    for(let i in keyframes){
      if(keyframes[i].shape === undefined){continue}
      arr.push(i)
    }
    return arr
  }


}