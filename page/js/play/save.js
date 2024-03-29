import { Sound } from './sound.js'


export class Save{
  constructor(main){
    if(!main){return}
    // this.options = parent.options
    this.load_filename = parent.main.options.load_filename || ''
    this.main   = main
    // console.log(main)
    this.player = main.player
    this.width  = main.width
    this.height = main.height
    this.rate   = main.rate
    if(!this.animation_name){return}
    if(!this.animation_data){return}
    this.sound = new Sound(this.main , this.animation_name)
    this.set_datas()
    this.init()
  }

  get data_type(){
    return 'image-motion-animation'
  }

  get frame_sec(){
    return 30
  }

  get animation_select(){
    return document.querySelector('.control select.animation_name')
  }
  get animation_name(){
    return this.animation_select.value || ''
  }

  get animation_data(){
    const data = parent.main.options.animations
    if(!data[this.animation_name]){return}
    return data[this.animation_name]
  }

  get gap(){//console.log(this.main,this.player)
    // if(this.player.options.data.gap[this.animation_name]){
    //   return {
    //     min : this.player.options.data.gap[this.animation_name].min,
    //     max : this.player.options.data.gap[this.animation_name].max,
    //   }
    // }
    // else{
      return this.get_default_gap(this.player.options.data.animations[this.animation_name].gap)
    // }
  }

  get sounds(){
    return this.sound.datas
  }



  get_default_gap(gap){
    // const gap = this.player.options.canvas.gap
    const base_width  = Number(this.main.elm_width.getAttribute('data-default-size')  || 0)
    const rate = this.width / base_width
    return {
      min : {
        x : gap.min.x * rate,
        y : gap.min.y * rate,
      },
      max : {
        x : gap.max.x * rate,
        y : gap.max.y * rate,
      },
    }
  }

  get count(){
    return Number(this.animation_data.count || 0)
  }

  get size(){
    return {
      width  : this.width,
      height : this.height,
      rate   : this.rate,
    }
  }

  get duration(){
    return this.animation_data.duration || 1
  }

  // 1.0s を 30フレームとして間引き算出する
  get interval(){
    const duration = this.main.datas.animations[this.animation_name].duration || 1
    const frames   = duration * this.frame_sec
    // const interval = Math.round(duration * 100 / frames)
    const interval = 100 / frames
    return interval < 100 ? interval : 100
  }

  // get datas(){
  //   return {
  //     type   : this.data_type,
  //     gap    : null,
  //     images : [],
  //   }
  // }

  set_datas(){
    this.datas = {
      type     : this.data_type,
      duration : 1,
      animation_name : this.animation_name,
      gap      : this.gap,
      images   : [],
    }
  }

  async set_image_datas(){
    let prev_num = null
    for(let i=0; i<=100; i=i+this.interval){
      const num = Math.floor(i)
      if(prev_num === num){continue}
      prev_num = num
      const data = await this.keyframe_rendering(num) || null
      this.datas.images.push({
        num   : num,
        image : data,
      })
    }
  }
  set_sound_datas(){
    if(!this.sound.animation_datas || !this.sound.animation_datas.length){return}
    for(let sound_animation_data of this.sound.animation_datas){
      const image_data = this.datas.images.find(e => e.num === sound_animation_data.keyframe)
      if(image_data){
        image_data.sound = image_data.sound || []
        image_data.sound.push(sound_animation_data.sound)
      }
      else{
        this.datas.images.push({
          num : sound_animation_data.keyframe,
          sound : [sound_animation_data.sound],
        })
      }
    }
    this.datas.images.sort((a,b) => {
      if(a.num < b.num) return -1
      if(a.num > b.num) return +1
      return 0
    })
  }

  async init(){
    // image-dataの作成
    await this.set_image_datas()

    // sound-dataを追加
    this.set_sound_datas()

    // save-data
    this.datas.size = this.size
    this.datas.gap  = this.gap
    this.datas.duration = this.duration
    this.datas.count = this.count
    this.datas.sounds = this.sounds
    const link = this.make_link(this.get_url(this.datas) , this.get_filename())
    // console.log(this.datas.images.length , this.interval)
    link.click()
  }

  get_filename(){
    this.load_filename = this.load_filename || date(+new Date())
    return `${this.load_filename}-${this.animation_name}.ima`
  }

  calc_gap(){
    return {
      width  : this.width  - this.gap.min.x + this.gap.max.x,
      height : this.height - this.gap.min.y + this.gap.max.y,
    }
  }


  async keyframe_rendering(keyframe){
    const view = this.player.options.canvas.view(this.animation_name , keyframe)
    const size = this.calc_gap()
    const canvas = document.createElement('canvas')
    canvas.width  = size.width
    canvas.height = size.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(view.canvas,0,0,size.width,size.height)
    // return canvas.toDataURL('image/png')
    return canvas.toDataURL('image/webp' , 0.5)
    // const imagedata = ctx.getImageData(0,0,canvas.width,canvas.height); 
    // const data = await new TPNGWriter(imagedata).getData()
    // return data
  }

  get_url(data){
    const blob    = new Blob(
      [JSON.stringify(data, null, '  ')],
      {type: 'application\/json'}
    )
    return URL.createObjectURL(blob)
  }
  make_link(url , filename){
    const link    = document.createElement('a')
    link.href     = url
    link.download = filename
    link.style.display = 'none'
    return link
  }

}