export class Undo{
  constructor(e){
    this.session_name = 'history'
    this.clear_history()
    this.clear_history()
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
  }

  redo(){
    const data = this.get_future()
    if(!data){return}
    data.call()
  }


  get_history(){
    if(!this.historys.length){return}
    if(this.current){
      this.add_future(this.current)
    }
    this.current = this.historys.pop()
    return this.current
  }
  get_future(){
    if(!this.futures.length){return}
    if(this.current){
      this.add_history(this.current)
    }
    this.current = this.futures.shift()
    return this.current
  }

  add_history(data){
    this.historys.push(data)
  }
  add_future(data){
    this.futures.unshift(data)
  }

  set_current(data){
    this.current = data
    this.futures  = []
  }

  clear_history(){
    this.historys = []
    this.futures  = []
    this.current  = null
  }
}