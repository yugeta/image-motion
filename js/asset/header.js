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
    window.addEventListener('click' , this.click_file_menu.bind(this))
    window.addEventListener('click' , this.click_header.bind(this))
    // this.header.addEventListener('click' , this.click_header.bind(this))

    // this.set(
    //   window,
    //   'click',
    //   this.click_header.bind(this),
    // )
  }

  click_header(e){
    const target = Options.elements.upper_selector(e.target , 'header > ul.view > li')
    if(!target){return}
    const hash = target.getAttribute('id') || ''
    this.set_contents_hash(hash)
  }
  

  set_contents_hash(hash){
    document.body.setAttribute('data-hash' , hash)
    ImageCommon.reset_style()
  }

  // ----------
  // File menu
  click_file_menu(e){
    if(this.time && (+new Date) - this.time < 100){return}
    const menu_check = Options.elements.get_header_menu_file_check()
    // menu button
    if(Options.elements.upper_selector(e.target , `header .text-menu [data-name='file']`)){
      switch(menu_check.checked){
        case true:
          this.close_file_menu()
          break
        case false:
          this.open_file_menu()
          break
      }
    }
    // other-area
    else if(menu_check.checked === true){
      this.close_file_menu()
    }
    this.time = (+new Date())
  }
  open_file_menu(){
    const menu_check = Options.elements.get_header_menu_file_check()
    menu_check.checked = true
  }
  close_file_menu(){
    const menu_check = Options.elements.get_header_menu_file_check()
    menu_check.checked = false
  }
}
