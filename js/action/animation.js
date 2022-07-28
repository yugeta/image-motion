import { Options }       from '../options.js'
import * as ActionCommon from './common.js'

export class Animation{
  constructor(name , uuid){
    this.uuid = uuid
    this.name = name
    this.view()
    // this.set_tools()
    this.set_event()
  }

  view(){
    // this.init_data()
    let template = Options.common.get_template('animation')
    if(!template){return}
    const cache    = Options.datas.get_data(this.uuid)
    template       = Options.common.doubleBlancketConvert(template , cache)
    const area     = Options.elements.get_animation_lists()
    area.innerHTML = template
  }
  

  hidden(){
    const target = Options.elements.get_animation_lists()
    target.textContent = ''
  }

  set_event(){
    const area   = Options.elements.get_animation_lists()

    // ranges
    const ranges = area.querySelectorAll(`input[type='range']`)
    for(let range of ranges){
      Options.event.set(
        range,
        'input',
        this.input_range.bind(this)
      )
      Options.event.set(
        range,
        'focus',
        this.focus_range.bind(this)
      )
      Options.event.set(
        range,
        'change',
        this.blur_range.bind(this)
      )
    }

    // inputs
    const inputs = area.querySelectorAll(`input[type='text']`)
    for(let input of inputs){
      Options.event.set(
        input,
        'input',
        this.change_input.bind(this)
      )
      Options.event.set(
        input,
        'focus',
        this.focus_input.bind(this)
      )
      Options.event.set(
        input,
        'blur',
        this.blur_input.bind(this)
      )
    }
  }


  get_parent(elm){
    return Options.elements.upper_selector(elm , 'li .flex')
  }
  get_type(elm){
    return Options.elements.upper_selector(elm , 'li .flex').getAttribute('data-type')
  }
  get_value(elm){
    return Number(elm.value || 0)
  }
  set_value(elm , value , type){
    const parent  = this.get_parent(elm)
    if(!parent){return}
    const input   = parent.querySelector(`input[type='${type}']`)
    if(!input){return}
    input.value   = value
  }

  focus_range(e){
    const elm = e.target
    const value = this.get_value(e.target)
    const type = 'text'
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.add_history({
      name : 'animation_range',
      call : ((animation_name , value , type , elm)=>{
        if(ActionCommon.get_animation_name() !== animation_name){return}
        elm.value = value
        this.update_range(elm,type)
      }).bind(this , animation_name , value , type , elm)
    })
  }
  blur_range(e){
    const elm = e.target
    elm.blur()
    const value = this.get_value(e.target)
    const type = 'text'
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.set_current({
      name : 'animation_range',
      call : ((animation_name , value , type , elm)=>{
        if(ActionCommon.get_animation_name() !== animation_name){return}
        elm.value = value
        this.update_range(elm,type)
      }).bind(this , animation_name , value , type , elm)
    })
  }

  input_range(e){
    this.update_range(e.target , 'text')
  }
  change_input(e){
    this.update_range(e.target , 'range')
  }
  update_range(elm , type){
    const value = this.get_value(elm)
    this.set_value(elm , value , type)
    this.transform_img()
    this.set_data(this.get_type(elm) , value)
  }

  focus_input(e){
    const elm = e.target
    const value = this.get_value(e.target)
    const type = 'tange'
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.add_history({
      name : 'animation_input',
      call : ((animation_name , value , type , elm)=>{
        if(ActionCommon.get_animation_name() !== animation_name){return}
        elm.value = value
        this.update_range(elm,type)
      }).bind(this , animation_name , value , type , elm)
    })
  }
  blur_input(e){
    const elm = e.target
    const value = this.get_value(e.target)
    const type = 'range'
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.set_current({
      name : 'animation_input',
      call : ((animation_name , value , type , elm)=>{
        if(ActionCommon.get_animation_name() !== animation_name){return}
        elm.value = value
        this.update_range(elm,type)
      }).bind(this , animation_name , value , type , elm)
    })
  }


  change_timeline(){
    // console.log('--1')
    // const per = ActionCommon.get_timeline_per()
    ActionCommon.set_current_num(this.name , this.uuid)
    // this.transform_img()
    Options.play.transform_img_all()
  }

  // uuid対象のimg全体を動かす
  transform_img(){
    const pic = Options.elements.get_uuid_view(this.uuid)
    const transforms = this.get_transform_css()
    pic.style.setProperty('transform',transforms,'')
  }
  get_transform_css(){
    const area   = Options.elements.get_animation_lists()
    const inputs = area.querySelectorAll(`input[type='text']`)
    const transforms = []
    for(let input of inputs){
      const value  = input.value || 0
      switch(this.get_type(input)){
        case 'rotate':
          transforms.push(`rotate(${value}deg)`)
          break

        case 'posx':
          transforms.push(`translateX(${value}px)`)
          break

        case 'posy':
          transforms.push(`translateY(${value}px)`)
          break

        case 'posz':
          transforms.push(`translateZ(${value}px)`)
          break
      }
    }
    return transforms.join(' ')
  }

  // timelineのkey-frameにkey-pointがセットされているかどうか（type指定必須） [keyアリ : true , keyナシ : false]
  is_type_per(type , current_per){
    current_per = current_per !== undefined ? current_per : ActionCommon.get_timeline_per()
    const data = Options.datas.get_animation_name_data(this.name , this.uuid , current_per , type)
    // const elm = document.querySelector(`.contents [name='timeline'] .lists li.${type} .point[data-per='${current_per}']`)
    // console.log(type+":"+current_per , elm)
    return typeof data !== 'undefined' ? true : false
  }

  set_data(type , value){
    const per  = ActionCommon.get_timeline_per()
    if(this.is_type_per(type , per) !== true){return}
    Options.datas.set_animation_data_value(this.name , this.uuid , per , type , value)
  }
  
  

}
