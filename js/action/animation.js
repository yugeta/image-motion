import { Options }         from '../options.js'
import * as ActionCommon   from './common.js'

export class Animation{
  constructor(name , uuid){
    this.uuid = uuid
    this.name = name
    this.area = Options.elements.get_animation_lists()
    this.view()
    this.set_event()
  }

  view(){
    let template = Options.common.get_template('animation')
    if(!template){return}
    const cache    = Options.datas.get_data(this.uuid)
    template       = Options.common.doubleBlancketConvert(template , cache)
    this.area.innerHTML = template
  }
  
  hidden(){
    this.area.textContent = ''
  }

  set_event(){
    // ranges
    const ranges = this.area.querySelectorAll(`input[data-mode='range']`)
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
    const inputs = this.area.querySelectorAll(`input[data-mode='input']`)
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
    return this.get_type_value(elm.value , this.get_type(elm))
  }
  get_type_value(value , type){
    switch(type){
      case 'opacity':
        return Number(value || 0).toFixed(2)

      default:
        return value || 0
    }
  }
  set_value(elm , value , mode){
    const parent  = this.get_parent(elm)
    if(!parent){return}
    const input   = parent.querySelector(`input[data-mode='${mode}']`)
    if(!input){return}
    input.value   = value
  }

  focus_range(e){
    const elm = e.target
    const value = this.get_value(e.target)
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.add_history({
      name : 'animation_range',
      call : this.set_input.bind(this , animation_name , value , elm)
    })
  }
  blur_range(e){
    const elm = e.target
    elm.blur()
    const value = this.get_value(e.target)
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.set_current({
      name : 'animation_range',
      call : this.set_input.bind(this , animation_name , value , elm)
    })
  }

  input_range(e){
    this.update_value(e.target)
  }
  change_input(e){
    this.update_value(e.target)
  }
  update_value(elm){
    const mode = elm.getAttribute('data-mode') !== 'range' ? 'range' : 'input'
    const value = this.get_value(elm)
    this.set_value(elm , value , mode)
    this.transform_img()
    this.set_data(this.get_type(elm) , value)
  }

  focus_input(e){
    const elm = e.target
    const value = this.get_value(e.target)
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.add_history({
      name : 'animation_input',
      call : this.set_input(this , animation_name , value , elm),
    })
  }
  blur_input(e){
    const elm = e.target
    const value = this.get_value(e.target)
    const animation_name = ActionCommon.get_animation_name()
    Options.undo.set_current({
      name : 'animation_input',
      call : this.set_input(this , animation_name , value , elm),
    })
  }
  set_input(animation_name , value , elm){
    if(ActionCommon.get_animation_name() !== animation_name){return}
    const parent = Options.elements.upper_selector(elm , '.flex')
    elm.value = this.get_type_value(value , parent.getAttribute('data-type'))
    this.update_value(elm)
  }

  


  change_timeline(){
    ActionCommon.set_current_num(this.name , this.uuid)
    Options.play.transform_img_all()
  }

  // uuid対象のimg全体を動かす
  transform_img(){
    const pic = Options.elements.get_uuid_view(this.uuid)
    const transforms = this.get_transform_css()
    const styles     = this.get_style_css()
    pic.style.setProperty('transform',transforms,'')
    if(styles.length){
      for(let style of styles){
        pic.style.setProperty(style.property , style.value,'')
      }
    }
  }
  get_transform_css(){
    const area   = Options.elements.get_animation_lists()
    const inputs = area.querySelectorAll(`input[data-mode='input']`)
    const transforms = []
    for(let input of inputs){
      const value  = input.value || 0
      switch(this.get_type(input)){
        case 'rotate':
          transforms.push(`rotate(${value}deg)`)
          break

        case 'posx':
          transforms.unshift(`translateX(${value}px)`)
          break

        case 'posy':
          transforms.unshift(`translateY(${value}px)`)
          break

        case 'posz':
          transforms.unshift(`translateZ(${value}px)`)
          break

        case 'scalex':
          transforms.unshift(`scaleX(${value})`)
          break

        case 'scaley':
          transforms.unshift(`scaleY(${value})`)
          break
      }
    }
    return transforms.join(' ')
  }

  get_style_css(){
    const area   = Options.elements.get_animation_lists()
    const inputs = area.querySelectorAll(`input[data-mode='input']`)
    const styles     = []
    for(let input of inputs){
      const value  = input.value || 0
      switch(this.get_type(input)){
        case 'opacity':
          styles.unshift({property : '' , value: `${value}`})
          break
      }
    }
    return styles
  }

  // timelineのkey-frameにkey-pointがセットされているかどうか（type指定必須） [keyアリ : true , keyナシ : false]
  is_type_per(type , current_per){
    current_per = current_per !== undefined ? current_per : ActionCommon.get_timeline_per()
    const data = Options.datas.get_animation_name_data(this.name , this.uuid , current_per , type)
    console.log(data)
    return typeof data !== 'undefined' ? true : false
  }

  set_data(type , value){
    const per  = ActionCommon.get_timeline_per()

    // timeline-pointの存在確認
    if(!Options.timeline.is_point(per , type)){return}

    Options.datas.set_animation_data_value(this.name , this.uuid , per , type , value)
  }
  
  

}
