import { Options }       from '../options.js'
import * as ActionEvent  from './event.js'
import * as ActionCommon from './common.js'
import * as ImageCommon  from '../images/common.js'

export class Timeline{
  constructor(name , uuid){
    this.name = name
    this.uuid = uuid
    this.view(name , uuid)
  }

  view(name , uuid){
    let template = Options.common.get_template('timeline')
    if(!template){return}
    const cache    = Options.datas.get_data(uuid)
    template       = Options.common.doubleBlancketConvert(template , cache)
    const area     = Options.elements.get_timeline_lists()
    area.innerHTML = template

    const datas    = Options.datas.get_animations() || {}
    this.datas     = datas[name] || {}
    this.set_value()
    Options.play.timeline_key_point_current()
  }
  hidden(){
    const target = Options.elements.get_timeline_lists()
    target.textContent = ''
  }

  // cursor移動 / point追加（ダブルクリック）
  click(e){

    // ダブルクリック判定
    if(this.flg_double_click && ~~(e.pageX) === this.flg_double_click.posx){
      const diff = (+new Date()) - this.flg_double_click.time
      delete this.flg_double_click
      if(diff > 500){
        return
      }
      // point追加
      const parent = Options.elements.upper_selector(e.target , '.lists > li')
      const type   = parent.getAttribute('class')
      // const per = ActionCommon.get_timeline_per()
      const per    = ActionCommon.set_timeline_pos2per(e.target , e.pageX)
      this.add_point(per , type)

      // カーソル移動
      ActionEvent.move_timeline_cursor(e)
    }
    else{
      this.flg_double_click = {
        posx : ~~(e.pageX),
        time : (+new Date()),
      }
    }
  }

  set_value(){
    if(!this.datas.items
    || !this.datas.items[this.uuid]
    || !this.datas.items[this.uuid].keyframes){return}
    const keyframes = this.datas.items[this.uuid].keyframes
    for(let per in keyframes){
      for(let name in keyframes[per]){
        this.set_keyframes(per , name , keyframes[per][name])
      }
    }
  }

  set_keyframes(per , name , value){
    const frame = Options.elements.get_timeline_data_frame(name)
    if(!frame){return}
    const rate  = this.get_frame_rate(frame.offsetWidth)
    const posx  = ~~(Number(per) * rate)
    const point = document.createElement('div')
    point.className = 'point'
    point.setAttribute('data-num' , per)
    frame.appendChild(point)
    point.style.setProperty('left',`${posx}px`,'')
  }


  get_frame_rate(frame_size){
    return frame_size / 100
  }

  add_point(per , type){
    this.set_keyframes(per , type)
    const uuid = ImageCommon.get_current_uuid()
    if(!uuid){
      alert('Error ! no-uuid')
      return
    }
    const name = ActionCommon.get_animation_name()
    // keyframeデータの更新
    ActionCommon.get_type_value_of_view(name , uuid , type , per)
  }

  
}
