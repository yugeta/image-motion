import { Play }       from './play.js'

export class Event{
  constructor(options , on){
    this.options = options || {}
    this.on      = on
    this.init()
    this.set_mutations()
  }
  init(){
    this.view = new Play(this.options , this.on)
  }

  set_mutations(){
    if(!this.options.root){return}
    new MutationObserver(this.change_animation_name.bind(this))
    .observe(this.options.root , {
      attributes : true, 
      childList  : false,
      subtree    : false,
    })
  }

  get_animation_name(){
    return this.options.root.getAttribute(this.options.animation_name_attribute)
  }

  change_animation_name(e){
    // const root = e[0].target
    const animation_name = this.get_animation_name()

    this.view.change_animation_name(animation_name)
    // new View(this.options , animation_name)

    // if(this.animation_name){
    //   this.start_view()
    // }
    // else{
    //   this.default_view()
    // }
  }




  // default_view(){
  //   // new View(this.options,{
  //   //   animation_name : ``,
  //   //   keyframe       : 0,
  //   //   canvas         : this.options.canvas.images.canvas,
  //   //   ctx            : this.options.canvas.images.ctx,
  //   // })
  // }

  // start_view(e){
  //   // this.stop()
  //   // if(!this.animation_name || !this.is_animation(this.animation_name)){return}
  //   const duration = this.get_duration()
  //   this.cache = {
  //     animation_name : this.animation_name,
  //     current_count  : 0,
  //     start_time     : (+new Date()),
  //     keyframe       : null,
  //     prev_keyframe  : null,
  //     max_count      : this.get_max_count(),
  //     duration       : duration,
  //     count          : 0,
  //     animation_sec  : duration / 100,
  //   }
  //   this.on.start(this.options , this.cache)
  //   this.set_root_inner_image_scale()
  //   this.play()
  // }

  // is_animation(){
  //   return this.options.data.animations && this.options.data.animations[this.animation_name] !== undefined ? true : false
  // }

  // get_anim_data(){
  //   return this.options.data.find(e => e.name === this.animation_name)
  // }

  // get_duration(){
  //   let duration = null
  //   const data = this.get_anim_data()
  //   if(data){
  //     duration = data.duration
  //   }
  //   return duration || 1
  // }

  // get_max_count(){
  //   let count = null
  //   const data = this.get_anim_data()
  //   if(data.count !== undefined){
  //     const reg = /^\d+?$/.exec(data.count)
  //     if(reg){
  //       count = reg[0]
  //     }
  //   }
  //   return Number(count || 0)
  // }

  // check_keyframe(keyframe){
  //   switch(keyframe){
  //     case 'end':
  //       return true
  //   }
  // }

  // get_image_data(animation_name){
  //   // console.log(this.options.data,animation_name)
  //   return this.options.data.find(e => e.name === animation_name)
  // }

  // rootサイズに応じて、表示するimageのscale値をセットする
  // set_root_inner_image_scale(){
  //   const root_size = {
  //     width  : this.options.root.offsetWidth,
  //     height : this.options.root.offsetHeight,
  //   }
  //   const data = this.get_image_data(this.animation_name)
  //   // console.log(data)
  //   if(!data){return}
  //   const image_element = data.images[0].element
  //   const image_size = {
  //     width  : image_element.naturalWidth,
  //     height : image_element.naturalHeight,
  //   }
  //   const rate = {
  //     w : image_size.width  / data.size.width,
  //     h : image_size.height / data.size.height,
  //   }

  //   // // console.log(rate,image_size,data.size)
  //   // this.options.root.style.setProperty('--scale',`${rate.w}`,'')
    
  //   // // gap
  //   // this.options.root.style.setProperty('--gap-x',`${data.gap.min.x}px`,'')
  //   // this.options.root.style.setProperty('--gap-y',`${data.gap.min.y}px`,'')
  //   // this.options.root.style.setProperty('padding',`${data.gap.min.y}px 0 0 ${data.gap.min.x}px`,'')
  // }

  // play(){
  //   if(!this.cache || !this.animation_name){return}
  //   // if(!animation_datas){return}
  //   const keyframe = this.get_keyframe_number()
  //   // if(this.check_keyframe(keyframe)){return}
  //   // タイミングが早いkeyframe表示は1回のみの表示に限定する。
  //   if(this.cache.keyframe !== keyframe){
  //     this.cache.prev_keyframe = this.cache.keyframe
  //     this.cache.keyframe = keyframe
  //     // this.options.canvas.images.play(this.animation_name , keyframe)
  //     this.view_image(this.animation_name , keyframe)
  //     this.play_sound(keyframe)
  //   }
  //   requestAnimationFrame(this.play.bind(this))
  // }

  // // keyframe_number
  // get_keyframe_number(){
  //   if(!this.cache){return}
  //   const start_time = this.cache.start_time
  //   const duration   = this.cache.duration
  //   const progress   = ((+new Date()) - start_time) / 1000
  //   const rate       = progress / duration
  //   const num        = Math.round(rate * 100)
  //   if(num > 100){
  //     this.cache.count++
      
  //     // count-max 終了処理
  //     if(this.cache.max_count && this.cache.count >= this.cache.max_count){
  //       this.on.end(this.options , this.cache)
  //       return 'end'
  //     }
  //     else{
  //       this.on.loop(this.options , this.cache)
  //       this.cache.start_time = (+new Date())
  //       return 0
  //     }
  //   }
  //   else{
  //     return num
  //   }
  // }

  // view_image(animation_name , keyframe){
  //   // console.log(this.options)
  //   new View(this.options , {
  //     animation_name : animation_name,
  //     keyframe       : keyframe,
  //     // canvas         : this.options.canvas.images.canvas,
  //     // ctx            : this.options.canvas.images.ctx,
  //   })
  // }

  // ----------
  // Stop
  // stop(){
  //   if(this.cache){
  //     delete this.cache
  //   }
  //   // this.stop_canvas()
  // }

  // stop_canvas(){
  //   // this.options.canvas.images.play(null , 0)
  //   // this.devault_view()
  // }


  // ----------
  // Sound

  get_sound_datas(){
    if(!this.options.sound_data
    || !this.options.sound_data.datas){return}
    return this.options.sound_data.datas[this.animation_name]
  }

  play_sound(){
    const sounds = this.get_still_sounds()
    if(!sounds || !sounds.length){return}
    for(let data of sounds){
      const sound = data.sound
      const keyframe = data.keyframe
      sound.play(this.animation_name , keyframe)
    }
  }

  get_still_sounds(){
    const sound_datas = this.get_sound_datas()
    if(!sound_datas){return}
    const prev = Number(this.cache.prev_keyframe || 0)
    const current = Number(this.cache.keyframe || 0)
    if(current - prev < 0){return}
    const datas = []
    for(let keyframe=prev; keyframe<=current; keyframe++){
      if(!sound_datas[keyframe]){continue}
      for(let sound_uuid in sound_datas[keyframe]){
        datas.push({
          keyframe : keyframe,
          sound    : sound_datas[keyframe][sound_uuid],
        })
      }
    }
    return datas
  }

  stop_sound(){
    const sound_data = this.options.sound_data
    if(sound_data){
      sound_data.stop_all()
    }
  }

}