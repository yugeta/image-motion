import { Options }   from '../options.js'

export class New{
  constructor(mode){
    this.data()
    this.view()
    this.lists()
    this.animation()
    this.timeline()
    this.property()
    this.shape()
    
    this.mode(mode)
  }

  data(){
    Options.animations = {}
    Options.cache = {}

  }

  view(){
    const elm = Options.elements.get_area_view()
    elm.innerHTML = ''
  }

  lists(){
    const elm = Options.elements.get_list_area()
    elm.innerHTML = ''
  }

  animation(){
    const elm = Options.elements.get_animation_lists()
    elm.innerHTML = ''
    const input = Options.elements.get_animation_name_list_input()
    input.value = ''
  }

  timeline(){
    const elm = Options.elements.get_timeline_lists()
    elm.innerHTML = ''
  }

  property(){
    const elm = Options.elements.get_info_area()
    elm.innerHTML = ''
  }

  transform(){
    const elm = Options.elements.get_transform_area()
    elm.innerHTML = ''
  }

  shape(){
    const elm = Options.elements.get_shape_property_info()
    elm.innerHTML = ''
  }

  mode(mode){
    mode = mode || 'upload'
    location.href = `#${mode}`
    document.body.setAttribute('data-hash' , mode)
    // location.reload()
  }
}