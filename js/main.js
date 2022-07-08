import { Options }  from './options.js'
import { Common }   from './common/common.js'
import { Control }  from './event/control.js'
import { Datas }    from './data/datas.js'
import { Property } from './property/property.js'
import { Event }    from './event/event.js'
import { Images }   from './images/images.js'
import { Lists }    from './lists/lists.js'
import { SvgEmbed } from '../plugin/svgEmbed/src/svgEmbed.js'

export class Main{
  constructor(){
    this.init()
    this.set_svg()
  }

  init(){
    Options.common   = new Common()
    Options.datas    = new Datas()
    Options.control  = new Control()
    Options.images   = new Images()
    Options.lists    = new Lists()
    Options.property = new Property()

    Options.event    = new Event()
  }

  set_svg(){
    new SvgEmbed()
  }

}

switch(document.readyState){
  case 'complete': new Main(); break
  default: window.addEventListener('load' , (function(){new Main()})); break
}
