import { Options } from '../options.js'

export class Timeline{
  constructor(name , uuid){
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
  }
  hidden(){
    const target = Options.elements.get_timeline_lists()
    target.textContent = ''
  }

  click(e){
    // console.log(e.pageX)
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
    // console.log(per , name , value)
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
}
