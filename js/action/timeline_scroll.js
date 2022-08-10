import { Options }        from '../options.js'

export class TimelineScroll{
  constructor(){
    this.under     = Options.elements.get_under()
    this.timeline  = Options.elements.get_timeline_lists()
    this.animation = Options.elements.get_animation_lists()
    this.area      = Options.elements.get_timeline_scroll_area()
    this.bar       = Options.elements.get_timeline_scroll_bar()
    this.set_size()
  }

  mousedown(e){
    if(!Options.elements.upper_selector(e.target , '.timeline-scroll-bar')){return}
    this.cache = {
      pos : {
        x : e.pageX,
        y : e.pageY,
      },
      top : this.bar.offsetTop,
    }
  }

  mousemove(e){
    if(!this.cache){return}
    const rate = this.get_rate()
    let move_y  = (this.cache.top + (e.pageY - this.cache.pos.y))
    move_y = move_y
    const max_y = (this.area.offsetHeight - this.bar.offsetHeight)
    if(move_y < 0){
      move_y = 0
    }
    else if(move_y > max_y){
      move_y = max_y
    }
    this.bar.style.setProperty('top' , `${move_y}px` , '')
    const move_y_rate = move_y / rate
    this.scroll_timeline(move_y_rate)
    this.scroll_animation(move_y_rate)
  }

  mouseup(e){
    if(!this.cache){return}
    delete this.cache
  }

  get_base_height(){
    return this.under.offsetHeight - this.timeline.offsetTop
  }

  get_inner_height(){
    return this.timeline.scrollHeight
  }

  get_rate(){
    const base_height  = this.get_base_height()
    const inner_height = this.get_inner_height()
    // console.log(base_height +" / "+ inner_height)
    return base_height / inner_height
  }

  set_size(){
    // console.log(this.get_base_height() +" * "+ this.get_inner_height() +" / "+ this.get_base_height())
    const base_height  = this.get_base_height()
    const rate = this.get_rate()
    // console.log(rate)
    const bar_size = base_height * rate
    this.bar.style.setProperty('height',`${bar_size}px`,'')
  }

  scroll_timeline(move_y){
    this.timeline.scrollTop = move_y
  }

  scroll_animation(move_y){
    this.animation.scrollTop = move_y
  }


}