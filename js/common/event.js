import { Options }  from '../options.js'
import { Plus }     from '../images/plus.js'
import { Header }    from './header.js'


export class Event {
  constructor(){
    this.init()
    
  }

  init(){
    document.querySelector('.contents [name="images"] .plus').addEventListener('click' , this.click_image_plus.bind(this))
    Options.header = new Header()
  }



  click_image_plus(){
    new Plus()
  }

}
