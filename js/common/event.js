import { Options }  from '../options.js'
import { Header }    from './header.js'


export class Event {
  constructor(){
    this.init()
    
  }

  init(){
    window.addEventListener('mousedown' , Options.control.mousedown.bind(Options.control))
    window.addEventListener('mousemove' , Options.control.mousemove.bind(Options.control))
    window.addEventListener('mouseup'   , Options.control.mouseup.bind(Options.control))
    document.getElementById('save').addEventListener('click' , Options.control.save)
    document.querySelector('.contents [name="images"]').addEventListener('click'  , Options.lists.click)
    Options.header = new Header()
  }



  // click_image_plus(){
  //   new Add()
  // }

}
