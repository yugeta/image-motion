import { Options }       from '../options.js'

/**
 * Undo specification
 * - undo対象
 *   - [name='view']の、移動操作（img移動、point移動）
 *   - [name='lists']の、名前変更、順番入れ替え、
 * - actionのキャッシュ保持
 *   - 操作でredo上書き処理
 * - undo操作で各種パラメータやpeopertyの書き換え処理
 * - データ保存は、session-storage
 */

export class Undo{
  constructor(e){
    this.session_name = 'history'
    this.clear_history()
    this.history = []
    this.set_num()
  }

  keydown(e){
    this.flow(e)
  }

  keyup(e){

  }

  flow(e){
    switch(this.get_mode(e)){
      case 'undo':
        this.undo()
        break
      case 'redo':
        this.redo()
        break
    }
  }

  // z(90)
  // mac:command , win:control
  is_undo(e){
    return e.metaKey === true && e.keyCode === 90 && e.shiftKey !== true ? true : false
  }

  is_redo(e){
    return e.metaKey === true && e.keyCode === 90 && e.shiftKey === true ? true : false
  }

  get_mode(e){
    if(this.is_undo(e) === true){
      return 'undo'
    }
    if(this.is_redo(e) === true){
      return 'redo'
    }
  }


  undo(){
    const data = this.get_history()
    if(!data){return}
    data.call()
    this.num-=1
    this.del_history()
    // console.log(this.num +"/"+ this.history.length)
  }

  redo(){
    // this.num+=1
    // console.log(this.num +"/"+ this.history.length)
    // if(this.history.length <= this.num){
    //   this.set_num()
    //   return
    // }
    // const data = this.get_history()
    // if(!data){return}
    // data.call()
  }


  get_history(){
    return this.history[this.num-1]
  }

  add_history(data){
    this.history.push(data)
    // console.log(this.history.length)
    this.set_num()
  }

  // 現在numより後ろのhistoryを削除する。
  del_history(){
    // this.history = this.history.splice(0, this.num-1)
    this.history.pop()
    this.set_num()
  }

  clear_history(){
    this.history = []
    this.set_num()
  }

  set_num(){
    this.num = this.history.length
  }
  
}