import { Options }  from '../options.js'
import { Add }     from '../images/add.js'
import { Header }    from './header.js'


export class Event {
  constructor(){
    this.init()
    
  }

  init(){
    document.querySelector('.contents [name="images"] .plus').addEventListener('click' , this.click_image_plus.bind(this))
    document.querySelector('.contents [name="images"] > ul').addEventListener('click' , this.click_image_plus.bind(this))
    Options.header = new Header()
  }



  click_image_plus(){
    new Add()
  }

}
