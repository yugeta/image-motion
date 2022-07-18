import { Options   }  from '../options.js'
import { Templates }  from './templates.js'
import { Common    }  from './common.js'
import { Elements  }  from './elements.js'
import { Control   }  from '../event/control.js'
import { Datas     }  from '../data/datas.js'
import { Property  }  from '../property/property.js'
import { Event     }  from '../event/event.js'
import { Lists     }  from '../lists/lists.js'
import { Play      }  from '../action/play.js'
import { Header    }  from '../asset/header.js'
import { Storage   }  from '../storage/storage.js'

export class Init{
  constructor(){
    this.set_templates()
  }

  set_templates(){
    Options.templates = new Templates({
      callback : (()=>{
        this.set_modules()
      }).bind(this)
    })
  }

  set_modules(){
    Options.common    = new Common()
    Options.elements  = new Elements()
    Options.datas     = new Datas()
    Options.control   = new Control()
    Options.lists     = new Lists()
    // Options.transform = new Transform()
    Options.property  = new Property()
    Options.header    = new Header()
    Options.play      = new Play()
    Options.storage   = new Storage()
    Options.event     = new Event()
  }
}