import { Options } from '../../options.js'

export class Mutation{
  constructor(animations , on){
    this.animations = animations || {}
    this.options    = this.animations.options || {}
    this.on         = on
    this.set_event()
  }

  set_event(){
    new MutationObserver(this.change.bind(this))
    .observe(this.options.root , {
    attributes : true, 
    childList  : false,
    subtree    : false,
    })
  }

  change(e){
    const root = e[0].target
    this.animation_name = this.get_animation_name()
    this.start_view()
  }

  start_view(){
    const animation_name = this.animation_name
    // 一旦全てをリセットする
    this.stop()
    if(animation_name && this.is_animation(animation_name)){
      this.play(animation_name)
    }
  }



  get_animation_name(){
    return this.options.root.getAttribute(Options.animation_name_attribute)
  }

  get_anim_data(){
    return this.options.data.animations[this.animation_name]
  }

  get_keyframe_datas(uuid){
    const data = this.get_anim_data()
    if(!data || !data.items || !data.items[uuid]){return}
    return data.items[uuid].keyframes
  }
  get_keyframe_data(uuid , keyframe_num){
    const datas = this.get_keyframe_datas(uuid)
    if(!datas){return}
    return datas[keyframe_num]
  }

  get_duration(){
    let duration = null
    const data = this.get_anim_data()
    if(data){
      duration = data.duration
    }
    return duration || 1
  }

  get_max_count(){
    let count = null
    const data = this.get_anim_data()
    if(data.count !== undefined){
      const reg = /^\d+?$/.exec(data.count)
      if(reg){
        count = reg[0]
      }
    }
    // return count || null
    return Number(count || 0)
  }

  get_pic(uuid){
    const root = this.get_root()
    return root.querySelector(`.pic[data-uuid='${uuid}']`)
  }

  get_root(){
    return document.querySelector(this.options.selector)
  }

  

  is_animation(){
    return this.options.data.animations && this.options.data.animations[this.animation_name] !== undefined ? true : false
  }


  play(){
    const duration = this.get_duration()
    // const count    = this.get_count()
    this.cache = {
      animation_name : this.animation_name,
      current_count  : 0,
      start_time     : (+new Date()),
      keyframe       : null,
      prev_keyframe  : null,
      max_count      : this.get_max_count(),
      duration       : duration,
      count          : 0,
      animation_sec  : duration / 100,
    }
    this.on.start(this.options , this.cache)
    this.view()
  }

  view(){
    if(!this.cache){
      this.stop()
      return
    }

    const keyframe = this.get_keyframe_number()
    
    if(this.check_keyframe(keyframe)){return}
    // タイミングが早いkeyframe表示は1回のみの表示に限定する。
    if(this.cache.keyframe !== keyframe){
      this.cache.prev_keyframe = this.cache.keyframe
      this.cache.keyframe = keyframe
      this.view_animation()
      this.play_sound()
    }

    // setTimeout(this.view , 1000)
    requestAnimationFrame(this.view.bind(this))
  }

  check_keyframe(keyframe){
    switch(keyframe){
      case 'end':
        return true
    }
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

  view_animation(){
    for(let data of this.options.data.images){
      const pic = this.get_pic(data.uuid)
      if(!pic){continue}

      const styles = this.get_styles(data.uuid)
      pic.style.setProperty('transform' , styles.transform || '' , '')
      pic.style.setProperty('opacity'   , styles.opacity , '')

      // shape
      const shapes = this.get_shape_elements(pic)
      if(data.shape_use && shapes.length){
        this.play_shape(shapes , data.uuid)
      }
    }
  }

  

  get_styles(uuid){
    return {
      transform : this.get_transform(uuid , this.cache.keyframe),
      opacity   : this.get_opacity(  uuid , this.cache.keyframe),
    }
  }

  get_transform(uuid , keyframe){
    const keyframe_data = this.get_keyframe_data(uuid , keyframe)
    if(keyframe_data === undefined){return}
    const transform_datas = []
    if(keyframe_data.posx !== undefined){
      transform_datas.push(`translateX(${keyframe_data.posx || 0}px)`)
    }
    if(keyframe_data.posy !== undefined){
      transform_datas.push(`translateY(${keyframe_data.posy || 0}px)`)
    }
    if(keyframe_data.posz !== undefined){
      transform_datas.push(`translateZ(${keyframe_data.posz || 0}px)`)
    }
    if(keyframe_data.scale !== undefined){
      transform_datas.push(`scale(${keyframe_data.scale || 0})`)
    }
    if(keyframe_data.rotate !== undefined){
      transform_datas.push(`rotate(${keyframe_data.rotate || 0}deg)`)
    }
    return transform_datas.join(' ')
  }

  get_opacity(uuid , keyframe){
    const keyframe_data = this.get_keyframe_data(uuid , keyframe)
    if(keyframe_data === undefined){return 1}
    if(keyframe_data.opacity === undefined){return 1}
    return keyframe_data.opacity || 0
  }

  get_shape_elements(pic){
    return pic.querySelectorAll(':scope > .shape .shape-item')
  }

  play_shape(shapes , uuid){
    const keyframe_data = this.get_keyframe_data(uuid , this.cache.keyframe)
    if(!keyframe_data || !keyframe_data.shape || !keyframe_data.shape.matrix){return}
    const matrix = keyframe_data.shape.matrix
    for(let i=0; i<shapes.length; i++){
      const elm = shapes[i]
      const css = matrix[i].transform
      elm.style.setProperty('transform' , css , '')
    }
  }

  // ----------
  // Stop
  stop(){
    if(!this.cache){return}
    delete this.cache
    this.stop_images()
  }

  stop_images(){
    for(let data of this.options.data.images){
      const pic = this.get_pic(data.uuid)
      if(!pic){continue}
      pic.style.removeProperty('transform')
      pic.style.removeProperty('opacity')

      const shapes = pic.querySelectorAll(':scope > .shape > .shape-item')
      if(shapes.length){
        for(let shape of shapes){
          shape.style.removeProperty('transform')
        }
      }
    }
  }


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
