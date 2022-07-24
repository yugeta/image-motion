import { Options }       from '../options.js'

/**
 * Undo specification
 * - undo対象
 *   - [name='view']の、移動操作（img移動、point移動）
 *   - [name='llists']の、名前変更、順番入れ替え、
 */

export class Key{
  constructor(e){

  }

  keydown(e){
    this.flow(e)
  }

  keyup(e){

  }

  flow(e){
    switch(this.get_mode(e)){
      case 'save':
        this.undo()
        break
      case 'load':
        this.redo()
        break
    }
  }


  get_mode(e){
    if(e.metaKey === true && e.keyCode === 's'){
      return 'save'
    }
    if(e.metaKey === true && e.keyCode === 'o'){
      return 'load'
    }
  }



}