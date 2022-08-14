import { Options }  from './options.js'
import { Init    }  from './common/init.js'
// import { SvgEmbed } from '../plugin/svgEmbed/src/svgEmbed.js'
import { SvgEmbed } from './svgEmbed/src/svgEmbed.js'

export class Main{
  constructor(){
    this.init()
    this.set_svg()
    this.options = Options
  }

  init(){
    new Init()
  }

  // svg調整
  set_svg(){
    new SvgEmbed()
  }
}

switch(document.readyState){
  case 'complete': 
    window.main = new Main(); 
    break
  default: 
    window.addEventListener('load' , (function(){
      window.main = new Main()
    })); 
    break
}
