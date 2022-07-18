import { Init    }  from './common/init.js'
// import { SvgEmbed } from '../plugin/svgEmbed/src/svgEmbed.js'
import { SvgEmbed } from './plugin/svgEmbed.js'

export class Main{
  constructor(){
    this.init()
    this.set_svg()
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
  case 'complete': new Main(); break
  default: window.addEventListener('load' , (function(){new Main()})); break
}
