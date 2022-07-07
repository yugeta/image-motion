import { Options } from './options.js'
import { Common }  from './common/common.js'
import { Event }   from './common/event.js'
import { Images }  from './images/images.js'
import { Lists }   from './lists/lists.js'
import { SvgEmbed } from '../plugin/svgEmbed/src/svgEmbed.js'


export class Main{
  constructor(){
    this.init()
    this.set_svg()
  }

  init(){
    Options.common = new Common()
    Options.event  = new Event()
    Options.images = new Images()
    Options.lists  = new Lists()
  }

  set_svg(){
    new SvgEmbed()
  }

}