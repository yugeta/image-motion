import { Options }       from '../options.js'

export class Scale{
  constructor(){
    this.init()
  }
  init(){
    this.view   = Options.elements.get_elm_contents_view()

    this.scale  = Options.elements.get_elm_contents_scale()
    this.scale_range = Options.elements.get_elm_input_scale()
    this.rate = null
    const hash = Options.common.get_hash()
    this.rect_view = this.view.getBoundingClientRect()
    this.set_scale()
    this.set_event()
    this.set_init_value()
  }

  // storage
  set_init_value(){
    // scale
    if(typeof Options.storage.cache.scale !== 'undefined'){
      this.scale_range.value = Options.storage.cache.scale
      this.set_scale()
      this.set_center_scale_value()
    }
  }
  
  set_event(){
    // スケール切り替え
    this.scale_range.addEventListener('input' , this.change_scale.bind(this))
  }

  
  set_scale(){
    const scale_value = Options.elements.get_header_scale_value()
    scale_value.textContent = this.get_scale_value()
    const scale_elm = Options.elements.get_elm_contents_scale()
    const rate = this.get_scale_rate()
    scale_elm.style.setProperty(`transform`,`scale(${rate})`,'')

    // 基点設定
    this.set_scale_center(rate)
  }

  get_scale_rate(){
    const num =this.get_scale_value()
    return num / 100
  }
  get_scale_value(){
    return Number(this.scale_range.value || 0)
  }

  change_scale(){
    this.change_flg = true
    this.set_scale()
    const scale = this.get_scale_value()
    Options.storage.set_data('scale' , scale)
    this.set_center_scale_value(scale)
  }

  // centerやshape-pointのためのscale値を計算してcss-property値に反映
  set_center_scale_value(scale){
    scale             = scale || this.get_scale_value()
    const view_area   = Options.elements.get_area_view()
    const max         = Number(this.scale_range.getAttribute('max') || 100)
    let center_scale  = ~~(max - scale) / 100 / 4
    if(center_scale < 0.5){
      center_scale = 0.5
    }
    view_area.style.setProperty('--scale' , center_scale)
  }

  set_scale_center(after_rate){
    if(this.rate !== null && this.rate === after_rate){return}
    const before_rate = this.rate !== null ? this.rate : 1
    const current_rate = after_rate / before_rate

    // scaleの中心値
    const view_center = {
      x : this.rect_view.width  / 2,
      y : this.rect_view.height / 2,
    }

    // beforeのbase中心座標を取得
    const before_base_center_pos = {
      x : view_center.x - this.scale.offsetLeft,
      y : view_center.y - this.scale.offsetTop,
    }

    // afterのbase中心座標を計算
    const after_baase_center_pos = {
      x : before_base_center_pos.x * current_rate,
      y : before_base_center_pos.y * current_rate,
    }

    const offset = {
      x : before_base_center_pos.x - after_baase_center_pos.x + this.scale.offsetLeft,
      y : before_base_center_pos.y - after_baase_center_pos.y + this.scale.offsetTop,
    }

    // 表示対応
    this.move(offset)

    // キャッシュとして値を保存する
    this.rate = after_rate
  }


  move(offset){
    this.scale.style.setProperty('left' , `${offset.x}px` , '')
    this.scale.style.setProperty('top'  , `${offset.y}px` , '')

    if(this.change_flg){
      Options.storage.set_data('posx' , offset.x)
      Options.storage.set_data('posy' , offset.y)
      delete this.change_flg
    }
  }
}
