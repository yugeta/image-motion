

export class Play{
  constructor(options , on){
    this.options = options
    this.on      = on
    // this.animation_name = animation_name
    // this.keyframe       = setting.keyframe
    // this.view()
    // this.init()
  }

  init(){
    
  }

  change_animation_name(animation_name){
    if(animation_name){
      this.start_view(animation_name)
    }
    else{
      this.default_view()
    }
  }

  default_view(){console.log('default-view')
    this.stop()
    // this.clear()
    // new View(this.options,{
    //   animation_name : ``,
    //   keyframe       : 0,
    //   canvas         : this.options.canvas.images.canvas,
    //   ctx            : this.options.canvas.images.ctx,
    // })
  }

  start_view(animation_name){
    this.stop()
    // if(!this.animation_name || !this.is_animation(this.animation_name)){return}
    const duration = this.get_duration(animation_name)
    this.cache = {
      animation_name : animation_name,
      current_count  : 0,
      start_time     : (+new Date()),
      keyframe       : null,
      prev_keyframe  : null,
      max_count      : this.get_max_count(animation_name),
      duration       : duration,
      count          : 0,
      animation_sec  : duration / 100,
    }
    // this.on.start(this.options , this.cache)
    this.set_root_inner_image_scale(animation_name)
    this.play()
  }

  get_anim_data(animation_name){
    return this.options.data.find(e => e.name === animation_name)
  }

  get_duration(animation_name){
    let duration = null
    const data = this.get_anim_data(animation_name)
    if(data){
      duration = data.duration
    }
    return duration || 1
  }

  get_max_count(animation_name){
    let count = null
    const data = this.get_anim_data(animation_name)
    if(data.count !== undefined){
      const reg = /^\d+?$/.exec(data.count)
      if(reg){
        count = reg[0]
      }
    }
    return Number(count || 0)
  }

  set_root_inner_image_scale(animation_name){
    const root_size = {
      width  : this.options.root.offsetWidth,
      height : this.options.root.offsetHeight,
    }
    const data = this.get_anim_data(animation_name)
    if(!data){return}
    const rate = root_size.width / data.size.width
    const transform = {
      w : data.size.width  * rate,
      h : data.size.height * rate,
      x : data.gap.min.x   * rate,
      y : data.gap.min.y   * rate,
    }
    // console.log(transform)
    this.options.scale.style.setProperty('width'  , `${transform.w}px` ,'')
    this.options.scale.style.setProperty('height' , `${transform.h}px` ,'')
    this.options.scale.style.setProperty('left'   , `${transform.x}px` ,'')
    this.options.scale.style.setProperty('top'    , `${transform.y}px` ,'')
    this.options.scale.style.setProperty('transform-origin' , `top left` ,'')
    this.options.scale.style.setProperty('transform' , `scale(${rate})` ,'')
  }

  play(){
    if(!this.cache || !this.cache.animation_name){return}
    const animation_name = this.cache.animation_name
    const keyframe = this.get_keyframe_number()
    if(this.check_keyframe(keyframe)){return}
    // タイミングが早いkeyframe表示は1回のみの表示に限定する。
    if(this.cache.keyframe !== keyframe){
      this.cache.prev_keyframe = this.cache.keyframe
      this.cache.keyframe = keyframe
      this.view(animation_name , keyframe)
    }
    requestAnimationFrame(this.play.bind(this))
  }

  // keyframe_number
  get_keyframe_number(){
    if(!this.cache){return}
    const start_time = this.cache.start_time
    const duration   = this.cache.duration
    const progress   = ((+new Date()) - start_time) / 1000
    const rate       = progress / duration
    const num        = Math.round(rate * 100)
    if(num > 100){
      this.cache.count++
      // count-max 終了処理
      if(this.cache.max_count && this.cache.count >= this.cache.max_count){
        this.on.end(this.options , this.cache)
        return 'end'
      }
      else{
        this.on.loop(this.options , this.cache)
        this.cache.start_time = (+new Date())
        return 0
      }
    }
    else{
      return num
    }
  }

  check_keyframe(keyframe){
    switch(keyframe){
      case 'end':
        return true
    }
  }

  // view_image(animation_name , keyframe){
  //   // console.log(this.options)
  //   // new View(this.options , {
  //   //   animation_name : animation_name,
  //   //   keyframe       : keyframe,
  //   //   // canvas         : this.options.canvas.images.canvas,
  //   //   // ctx            : this.options.canvas.images.ctx,
  //   // })
  //   this.view()
  // }

  // get_animation_datas(){
  //   return this.options.data.find(e => e.name === this.animation_name)
  // }
  get_image_data(animation_data , keyframe){
    const datas = this.get_anim_data(animation_data)
    return datas.images.find(e => e.num === keyframe)
  }
  
  view(animation_name , keyframe){
    const data = this.get_image_data(animation_name , keyframe)
    if(!data){return}
    this.clear()
    this.options.scale.appendChild(data.element)
  }

  clear(){
    this.options.scale.innerHTML = ''
  }

  stop(){
    if(this.cache){
      delete this.cache
    }
    // this.clear()
  }




}