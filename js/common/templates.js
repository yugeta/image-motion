// import { Options  }  from '../options.js'
import { Ajax     }  from './ajax.js'

export class Templates{
  constructor(options){
    this.options = options || {}
    this.lists = [
      'image_list',
      'image_pic',
      'image_property',
      'transform',
      'animation',
      'animation_name_lists',
      'animation_name_list',
      'timeline',
      // 'animation_header_tools',
      'shape',
    ]
    this.load()
  }

  load(){
    // load終了
    if(!this.lists.length){
      delete this.lists
      if(this.options.callback){
        this.options.callback()
      }
      return
    }
    // load継続
    const name = this.lists.shift()
    const path = `template/${name}.html`
    new Ajax({
    url      : path,
    method   : 'get',
    callback : ((name , e) => {
      this[name] = e.target.response
      this.load()
    }).bind(this , name)
  })
  }
  
}