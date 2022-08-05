import { Options }       from '../options.js'
import * as ActionEvent  from '../action/event.js'
import * as ActionCommon from '../action/common.js'
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
      if(diff > 300){
        return
      }

      // point追加
      const parent = Options.elements.upper_selector(e.target , '.lists > li')
      const type   = parent.getAttribute('class')
      const per    = ActionCommon.set_timeline_pos2per(e.target , e.pageX)

      // ポイントがあれば削除
      if(this.is_point(per , type)){
        this.del_point(per , type , e.target)
      }
      // ポイントが無ければ追加
      else{
        this.add_point(per , type)
      }

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
  is_point(per , type){
    const datas = Options.datas.get_animation_per_datas(this.name , this.uuid , per)
    if(!datas || typeof datas[type] === 'undefined'){
      return false
    }
    else{
      return true
    }
  }
  add_point(per , type){

    if(type === 'shape' && !this.is_shape_use()){return}

    // point追加
    this.set_keyframes(per , type)

    // keyframeデータの更新
    ActionCommon.set_type_value_of_view(this.name , this.uuid , type , per)
  }

  is_shape_use(){
    if(Options.datas.get_shape_use(this.uuid)){
      return true
    }
    else{
      return false
    }
  }

  del_point(per , type , elm){
    const point = Options.elements.upper_selector(elm , `[name='timeline'] .lists .point`)
    if(!point){return}
    
    // 表示element削除
    point.parentNode.removeChild(point)

    // keyframeデータ削除
    Options.datas.del_animation_name_data(this.name , this.uuid , per , type)

    // view表示処理
    Options.play.set_timeline_per(per)
  }

  copy_point(type , before_per , after_per){
    if(!type){return}
    const datas = Options.datas.get_animation_per_datas(this.name , this.uuid , before_per)
    if(!datas || typeof datas[type] === 'undefined'){return}
    // point追加
    this.set_keyframes(after_per , type)
    // keyframeデータの更新
    ActionCommon.set_type_value_of_view(this.name , this.uuid , type , after_per , datas[type])
    return true
  }

  clear_type_all(type){
    const type_points = Options.elements.get_timeline_type_points(type)
    if(!type_points || !type_points.length){return}
    for(let i=type_points.length-1; i>=0; i--){
      type_points[i].parentNode.removeChild(type_points[i])
    }
    return true
  }
  
}
