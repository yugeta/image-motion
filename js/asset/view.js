import { Options }      from '../options.js'

export class View{
  constructor(){
    this.scale = Options.elements.get_area_view()
    // const rect = this.scale.getBoundingClientRect()
    // this.x = rect.left
    // this.margin = 0
    // this.set_move_event()
    this.move_cursor = Options.elements.get_view_move_cursor()
  }

  // // 左（マイナス値）へはみ出したオブジェクトの対応
  // set_margin(elm){
  //   const rect = elm.getBoundingClientRect()
  //   const x = (rect.left - this.x) * -1
  //   // console.log(x)
  //   if(x < 0){return}
  //   const margin = this.margin + x
  //   this.scale.style.setProperty('margin-left' , `${margin}px` , '')
  //   this.margin = margin
  // }

  mousedown(e){
    const move = Options.elements.upper_selector(e.target , `[name='view'] > .move`)
    if(move){
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
    }
  }
  
}