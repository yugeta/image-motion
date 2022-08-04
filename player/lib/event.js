import { Options } from '../options.js'
import { Matrix }  from './matrix.js'

export class Event{
  constructor(options){
    this.options = options
    this.set_images()
  }

  set_images(){
    for(let data of this.options.data.images){
      if(data.shape_use === 1){
        // this.set_event_shape(data)
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
      duration    : this.options.data.images[data.num].duration || 1
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
    const anim_data = Options.shapes[uuid].animations[anim_name]
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
    this.cache             = anim_data
    this.cache.count       = 0
    this.cache.start       = start
    this.cache.per         = null
    this.cache.splits      = datas.splits
    this.cache.keyframes   = anim_data.items[uuid].keyframes
    this.cache.base_points = datas.base_points
    this.cache.duration    = datas.duration
    this.cache.time        = this.cache.duration / 100
    this.shape_view_mutation(start)
  }

  shape_view_mutation(flg){
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
          const next_positions = this.get_shape_next_points(num , this.cache.keyframes , this.cache.per)
          if(!next_positions){continue}
          matrix_data = new Matrix(this.cache.base_points[num] , next_positions)
        }
        if(!matrix_data){continue}
        this.cache.splits[num].style.setProperty('transform', matrix_data.transform, '')
      }
    }
    if(per >= 100){
      this.cache.start = (+new Date())
    }
    setTimeout(this.shape_view_mutation.bind(this , this.cache.start) , this.cache.time * 1000)
  }

  shape_stop_mutation(uuid){
//     const options   = elm.cache.options
// console.log(options.root)
    if(!this.cache){return}
    for(let split of this.cache.splits){
      split.style.setProperty('transform','','')
    }
    delete this.cache
  }





  // // ----------
  // // anim-event

  // set_event_shape(data){
  //   const pic = this.options.root.querySelector(`[data-uuid='${data.uuid}']`)
  //   if(!pic){return}
  //   if(!pic.querySelector(':scope > .shape')){return}
  //   // pic.cache = {
  //   //   image_num : data.num,
  //   //   options   : this.options,
  //   // }
  //   // console.log(this.options.root)
  //   // console.log(document.body)
  //   // if(document.body.hasAttribute('data-shape-animation')){return}
  //   const uuid = pic.getAttribute('data-uuid')
  //   Options.shapes[uuid] = {
  //     uuid         : uuid,
  //     image_num    : data.num,
  //     options      : this.options,
  //     shape_splits : this.options.data.images[data.num].shape_splits,
  //     animations   : this.options.data.animations,
  //     base_points  : this.options.data.images[data.num].shape_points,
  //     duration     : this.options.data.images[data.num].duration || 1,
  //   }
  //   // console.log(uuid,data)
  //   // console.log(pic)
  //   pic.addEventListener('animationstart'     , this.shape_play.bind(this))
  //   pic.addEventListener('animationiteration' , this.shape_play.bind(this))
  //   pic.addEventListener('animationcancel'    , this.shape_stop.bind(this))
  //   // document.body.setAtribute('data-shape-animation' , 1)

  //   // const observer = new MutationObserver(this.mutation.bind(this , pic))
  //   // observer.observe(this.options.root , {
  //   //   attributes : true, 
  //   //   childList  : false,
  //   //   subtree    : false,
  //   // })
  //   // this.shape_play(pic)
  // }
 

  // shape_play(e){
  //   const elm = e.target
  //   if(!elm.querySelector(':scope > .shape')){return}
  //   const uuid = elm.getAttribute('data-uuid')
  //   if(!uuid){return}
  //   // console.log(uuid)
  //   // console.log(this.options)
  //   // console.log(elm.cache)
  //   // console.log(uuid , Options.shapes)
  //   const datas     = Options.shapes[uuid]
  //   const options   = datas.options
  //   const image_num = datas.image_num

  //   // console.log(elm,image_num)
  //   // console.log(this.options.data.images[image_num])
  //   // console.log(options.root)

  //   const anim_name = options.root.getAttribute('data-action')
  //   const anim_data = options.data.animations[anim_name]
  //   if(!anim_data
  //   || !anim_data.items
  //   || !anim_data.items[uuid]
  //   || !anim_data.items[uuid].keyframes){return}
  //   if(this.is_shape(anim_data.items[uuid].keyframes) !== true){return}
  //   const start            = (+new Date())
  //   this.cache             = anim_data
  //   this.cache.count       = 0
  //   this.cache.start       = start
  //   this.cache.per         = null
  //   // this.cache.splits      = options.data.images[image_num].shape_splits
  //   this.cache.splits      = datas.shape_splits
  //   // this.cache.keyframes   = anim_data.items[uuid].keyframes
  //   this.cache.keyframes   = datas.animations[anim_name].items[uuid].keyframes
  //   // this.cache.base_points = options.data.images[image_num].shape_points
  //   this.cache.base_points = datas.base_points
  //   // this.cache.duration    = options.data.images[image_num].duration || 1
  //   this.cache.duration    = datas.duration
  //   this.cache.time        = this.cache.duration / 100
  //   this.cache.elm         = elm
    
  //   this.shape_view(start)
  // }

  // shape_view(flg){
  //   if(!this.cache){return}
    
  //   if(flg !== this.cache.start){return}
  //   const progress = ((+new Date()) - this.cache.start) / 1000
  //   const rate = progress / this.cache.duration
  //   const per = Math.round(rate * 100)
  //   if(per !== this.cache.per){
  //     this.cache.per = per
  //     for(let num=0; num<this.cache.splits.length; num++){
  //       let matrix_data = ''
  //       if(this.cache.keyframes[this.cache.per]){
  //         if(!this.cache.keyframes[this.cache.per].shape){continue}
  //         matrix_data = this.cache.keyframes[this.cache.per].shape.matrix[num]
  //       }
  //       else{
  //         const next_positions = this.get_shape_next_points(num , this.cache.keyframes , this.cache.per)
  //         if(!next_positions){continue}
  //         matrix_data = new Matrix(this.cache.base_points[num] , next_positions)
  //       }
  //       if(!matrix_data){continue}
  //       this.cache.splits[num].style.setProperty('transform', matrix_data.transform, '')
  //     }
  //   }
  //   if(per >= 100){return}
  //   setTimeout(this.shape_view.bind(this , this.cache.start) , this.cache.time * 1000)
  // }

  // shape_stop(e){
  //   // console.log('stop')
  //   if(!this.cache){return}
  //   delete this.cache
  // }


  // ----------
  // shape animation play

  get_shape_next_points(num , keyframes , per){
    const res = this.get_shape_between_keyframes(per , keyframes)
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