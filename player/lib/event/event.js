import { Matrix }   from '../animation/matrix.js'
import { Mutation } from './mutation.js'

export class Event{
  constructor(options , animation , on){
    this.datas = {}
    this.on = on
    this.options = options
    this.animation = animation
    this.set_mutations()
  }

  set_mutations(){
    new Mutation(this.animation , this.on)
  }

  // ----------
  // Library
  get_anim_data(anim_name){
    return this.options.data.animations[anim_name]
  }

  get_duration(anim_name){
    let duration = null
    const data = this.get_anim_data(anim_name)
    if(data){
      duration = data.duration
    }
    return duration || 1
  }
  get_max_count(anim_name){
    let count = null
    const data = this.get_anim_data(anim_name)
    if(data.count !== undefined){
      const reg = /^\d+?$/.exec(data.count)
      if(reg){
        count = reg[0]
      }
    }
    return count || null
  }

  // ----------
  // Sound
  set_sound_mutation(){
    new MutationObserver(((e)=>{
      this.update_sound_mutation(e)
    }).bind(this))
    .observe(this.options.root , {
      attributes : true, 
      childList  : false,
      subtree    : false,
    })
  }

  update_sound_mutation(e){
    if(!e || !e.length){return}
    const anim_name = e[0].target.getAttribute('data-action')
    if(anim_name && this.is_sound(anim_name)){
      this.sound_play_mutation(anim_name)
    }
    else{
      this.sound_stop_all()
    }
  }

  is_sound(anim_name){
    return this.animation.sound_data.is_data(anim_name)
  }
  sound_play_mutation(anim_name){
    this.sound_stop_all()
    const duration = this.get_duration(anim_name)
    this.sound_options = {
      anim_name : anim_name,
      start     : (+new Date()),
      duration  : duration,
      per_time  : duration / 100,
      per       : null,
      max_count : this.get_max_count(anim_name),
      current_count : 0,
    }
    this.sound_play()
  }
  sound_play(){
    const data = this.sound_options
    if(!data){return}
    const progress = ((+new Date()) - data.start) / 1000
    const rate = progress / data.duration
    const per = Math.round(rate * 100)
    // タイミングが早くて同じper(key-number)の場合は処理しない
    if(per !== data.per){
      data.per = per
      this.animation.sound_data.play(data.anim_name , per)
    }
    if(per >= 100){
      data.start = (+new Date())
      this.animation.sound_data.stop_all()
      // 回数指定がある場合は処理を停止する
      data.current_count++
      if(data.max_count !== null
      && data.max_count <= data.current_count){return}
    }
    setTimeout(this.sound_play.bind(this) , data.per_time * 1000)
  }
  sound_stop_all(){
    if(this.sound_options){
      delete this.sound_options
    }
    if(this.animation && this.animation.sound_data){
      this.animation.sound_data.stop_all()
    }
  }

}