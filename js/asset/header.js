import { Options }       from '../options.js'
import * as ImageCommon  from '../images/common.js'

export class Header{
  constructor(){
    this.init()
  }
  init(){
    this.header = Options.elements.get_elm_header()
    this.view   = Options.elements.get_elm_contents_view()
    const hash = Options.common.get_hash()
    this.set_contents_hash(hash)
    this.rect_view = this.view.getBoundingClientRect()
    this.set_event()
  }

  
  set_event(){
    // 機能切り替え
    this.header.addEventListener('click' , this.click_header.bind(this))
  }

  click_header(e){
    const target = Options.elements.upper_selector(e.target , 'header > ul.view > li')
    if(!target){return}
    const hash = target.getAttribute('id') || ''
    this.set_contents_hash(hash)
  }

  set_contents_hash(hash){
    document.body.setAttribute('data-hash' , hash)
    ImageCommon.reset_transform()
  }
}
