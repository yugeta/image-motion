import { Options }   from './options.js'
import { Animation } from './animation.js'
import { Images }    from './images.js'

export class Setting{
  constructor(datas){
    for(let i in datas){
      this[i] = datas[i]
    }
    new Animation(this.name , this.style , this.data)
    new Images(this.root , this.elm , this.data)
  }

}