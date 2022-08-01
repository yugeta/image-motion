import { Options }      from '../options.js'

export class View{
  constructor(){
    this.scale = Options.elements.get_area_view()
    this.move_cursor = Options.elements.get_view_move_cursor()
  }

  mousedown(e){
    const move = Options.elements.upper_selector(e.target , `[name='view'] > .move`)
    // reset
    if(this.check_double_click(e)){
      this.move_reset()
    }
    // move
    else if(move){
      const pos = {
        x : e.pageX,
        y : e.pageY,
      }
      const offset = {
        x : this.scale.offsetLeft,
        y : this.scale.offsetTop,
      }
      this.move_flg = {
        move : move,
        pos  : pos,
        offset : offset,
      }
      this.move_on()

      this.set_double_click(e)
      
      
    }
  }

  mousemove(e){
    if(this.move_flg){
      const pos = {
        x : this.move_flg.offset.x + e.pageX - this.move_flg.pos.x,
        y : this.move_flg.offset.y + e.pageY - this.move_flg.pos.y,
      }
      this.scale.style.setProperty('left' , `${pos.x}px`,'')
      this.scale.style.setProperty('top'  , `${pos.y}px`,'')
    }
  }

  mouseup(e){
    if(this.move_flg){
      delete this.move_flg
      this.move_off()
    }
  }

  move_on(){
    const move = Options.elements.get_view_move_cursor()
    if(!move){return}
    move.setAttribute('data-status','active')
  }
  move_off(){
    const move = Options.elements.get_view_move_cursor()
    if(!move){return}
    if(!move.hasAttribute('data-status')){return}
    move.removeAttribute('data-status')
  }

  // ダブルクリック設定
  set_double_click(e){
    this.flg_double_click = {
      posx : ~~(e.pageX),
      time : (+new Date()),
    }
  }
  // ダブルクリック判定
  check_double_click(e){
    if(!this.flg_double_click){return}
    const before_time = this.flg_double_click.time
    const before_posx = this.flg_double_click.posx
    delete this.flg_double_click
    const diff = (+new Date()) - before_time
    if(~~(e.pageX) !== before_posx){return}
    if(diff > 300){return}
    return true
  }


  move_reset(){
    const move = Options.elements.get_view_move_cursor()
    if(!move){return}
    this.scale.style.setProperty('left' , `0px`,'')
    this.scale.style.setProperty('top'  , `0px`,'')
  }
  
}