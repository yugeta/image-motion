import { Options }  from '../options.js'

export class Event {
  constructor(){
    this.init()
  }

  init(){
    this.mouse()
    this.file()
    this.upload()
    this.header()
  }

  set(elm , key , func , flg){
    if(!elm || !key || !func){return}
    elm.addEventListener(key ,func , flg)
  }

  mouse(){
    this.set(
      window , 
      'mousedown',
      Options.control.mousedown.bind(Options.control),
    )
    this.set(
      window,
      'mousemove',
      Options.control.mousemove.bind(Options.control),
    )
    this.set(
      window , 
      'mouseup',
      Options.control.mouseup.bind(Options.control),
    )
  }

  file(){
    this.set(
      document.getElementById('save') , 
      'click',
     Options.control.save,
    )
    this.set(
      document.getElementById('load') , 
      'click',
      Options.control.load,
    )
  }

  upload(){
    this.set(
      document.querySelector('.contents [name="images"]'),
      'click',
      Options.control.image_upload,
    )
  }

  header(){
    this.set(
      Options.elements.get_elm_header(),
      'click',
      Options.header.click_header.bind(Options.header),
    )
    this.set(
      Options.elements.get_elm_input_scale(),
      'input',
      Options.header.change_scale.bind(Options.header),
    )
  }

}
