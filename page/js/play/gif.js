/**
 * lib: GIFanime.js
 * reference: https://www.petitmonte.com/javascript/howto_gifanime_js.html
 */

export class Gif{
  constructor(){
    if(!main){return}
    this.load_filename = parent.main.options.load_filename || ''
    this.main   = main
    this.player = main.player
    this.width  = main.width
    this.height = main.height
    this.rate   = main.rate
    this.images = []
    if(!this.animation_name){return}
    if(!this.animation_data){return}
    this.datas = {
      type     : this.data_type,
      duration : 1,
      animation_name : this.animation_name,
      gap      : this.gap,
      images   : [],
    }
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

  get gap(){
    return this.get_default_gap(this.player.options.data.animations[this.animation_name].gap)
  }

  get git_trans_value(){
    const elm = document.querySelector(`input[name='gif_trans_color']`)
    return elm.value 
  }
  get git_trans_color(){
    const value = this.git_trans_value 
    return {
      r: this.conv_dig_16_10(value.substr(1,2)),
      g: this.conv_dig_16_10(value.substr(3,2)),
      b: this.conv_dig_16_10(value.substr(5,2)),
    }
  }
  conv_dig_16_10(dig16){
    return parseInt(dig16, 16)
  }
  

  get_default_gap(gap){
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

  // 1.0s を 30フレームとして間引き算出する（gifの限界値0.05msに限定する。）
  get interval(){
    return 5
  }

  get time(){
    return this.main.datas.animations[this.animation_name].duration
  }

  // 処理開始
  init(){
    // image-dataの作成
    let prev_num = null
    for(let i=0; i<=100; i=i+this.interval){
      const num = Math.floor(i)
      if(prev_num === num){continue}
      prev_num = num
      const img = this.keyframe_rendering(num) || null
      this.images.push(img)
    }
    const GIFWriter = new TGIFAnime(this.images, 0); // repeat-count [0:無限 or num(回数)]
    const col = this.git_trans_color
    GIFWriter.SaveToFile(this.get_filename() , col.r, col.g, col.b);
  }

  get_filename(){
    this.load_filename = this.load_filename || date(+new Date())
    return `${this.load_filename}-${this.animation_name}.gif`
  }

  calc_gap(){
    return {
      width  : this.width  - this.gap.min.x + this.gap.max.x,
      height : this.height - this.gap.min.y + this.gap.max.y,
    }
  }

  keyframe_rendering(keyframe){
    const view = this.player.options.canvas.view(this.animation_name , keyframe)
    const size = this.calc_gap()
    const canvas = document.createElement('canvas')
    canvas.width  = size.width
    canvas.height = size.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = this.git_trans_value;
    ctx.rect(0, 0, size.width, size.height);
    ctx.fill();
    ctx.drawImage(view.canvas, 0, 0, size.width, size.height)

    // GIFanime.js
    const img = ctx.getImageData(0,0, size.width, size.height)
    let MedianCut = null
    const colors = getColorInfo(img)
    if(colors.length > 256){   
      MedianCut = new TMedianCut(img, colors)
      MedianCut.run(256, true)
    }    
    img.transflg  = 1
    img.overlaid  = 2 // 1:フレーム画像を残す , 2:フレーム画像を残さない
    img.delaytime = 1
    img.colors    = MedianCut.rep_color

    return img
  }

  make_link(url , filename){
    const link    = document.createElement('a')
    link.href     = url
    link.download = filename
    link.style.display = 'none'
    return link
  }
}