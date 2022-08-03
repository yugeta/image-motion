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
import { Home      }  from '../home/home.js'
import { Undo      }  from '../event/undo.js'
import { View      }  from '../asset/view.js'

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
    Options.storage   = new Storage()
    Options.elements  = new Elements()
    Options.datas     = new Datas()
    Options.control   = new Control()
    Options.lists     = new Lists()
    Options.property  = new Property()
    Options.header    = new Header()
    Options.view      = new View()
    Options.play      = new Play()
    Options.undo      = new Undo()
    Options.event     = new Event()
    
    
    new Home()
  }
}