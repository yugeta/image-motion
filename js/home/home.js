import { Options } from '../options.js'

export class Home{
  constructor(){
    this.set()
  }

  set(){
    const elm = Options.elements.get_home()
    if(!elm){return}
    elm.innerHTML = Options.common.get_template('home')
  }
}