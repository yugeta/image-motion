import { Options }      from '../options.js'
import * as ImageCommon from '../images/common.js'

export class Header{
  constructor(){
    this.scale_range
    this.set_contents_hash()
    this.scale_target = Options.elements.get_header_scale_input()
    this.set_scale()
    // this.set_center_scale_value()
  }

  click_header(e){
    const target = Options.elements.upper_selector(e.target , 'header > ul.view > li')
    if(!target){return}
    setTimeout(this.set_contents_hash , 0)
  }

  set_contents_hash(){
    const hash = Options.common.get_hash()
    document.body.setAttribute('data-hash' , hash)
    ImageCommon.reset_transform()
    // if(Options.undo){
    //   Options.undo.clear_history()
    // }
    // Options.play.transform_img_all()
  }

  
  set_scale(){
    const scale_value = Options.elements.get_header_scale_value()
    scale_value.textContent = this.get_scale_value()
    const rate = this.get_scale_rate()
    Options.elements.get_elm_contents_scale().style.setProperty(`transform`,`scale(${rate})`,'')
  }
  get_scale_rate(){
    const num =this.get_scale_value()
    return num / 100
  }
  get_scale_value(){
    return Number(this.scale_target.value || 0)
  }
  set_scale_value(value){
    this.scale_target.value = value
    this.set_scale()
    this.set_center_scale_value()
  }

  change_scale(){
    this.set_scale()
    const scale = this.get_scale_value()
    Options.storage.set_data('scale' , scale)
    this.set_center_scale_value(scale)
  }
  set_center_scale_value(scale){
    scale             = scale || this.get_scale_value()
    const view_area   = Options.elements.get_area_view()
    const scale_input = Options.elements.get_header_scale_input()
    const max         = Number(scale_input.getAttribute('max') || 100)
    let center_scale  = ~~(max - scale) / 100
    if(center_scale < 0.5){
      center_scale = 0.5
    }
    // console.log(max+"-"+scale+"="+center_scale)
    view_area.style.setProperty('--scale' , center_scale)
  }
}
