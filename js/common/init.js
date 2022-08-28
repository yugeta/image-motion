import { Options   }  from '../options.js'
import { Version   }  from '../asset/version.js'
import { Templates }  from '../common/templates.js'
import { Common    }  from '../common/common.js'
import { Elements  }  from '../common/elements.js'
import { Control   }  from '../event/control.js'
import { Datas     }  from '../data/datas.js'
import { Property  }  from '../property/property.js'
import { Event     }  from '../event/event.js'
import { Lists     }  from '../lists/lists.js'
import { Play      }  from '../action/play.js'
import { Header    }  from '../asset/header.js'
import { Scale     }  from '../asset/scale.js'
import { Storage   }  from '../storage/storage.js'
import { Home      }  from '../home/home.js'
import { Undo      }  from '../event/undo.js'
import { View      }  from '../asset/view.js'
import { Footer    }  from '../asset/footer.js'
import { TimelineScroll } from '../action/timeline_scroll.js'
import { SoundPlay } from '../action/sound_play.js'

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
    Options.scale     = new Scale()
    Options.view      = new View()
    Options.play      = new Play()
    Options.undo      = new Undo()
    Options.event     = new Event()
    Options.footer    = new Footer()
    Options.version   = new Version()
    Options.timeline_scroll = new TimelineScroll()
    Options.sound_play = new SoundPlay()
    new Home()
  }
}