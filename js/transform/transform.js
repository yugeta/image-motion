import { Options } from '../options.js'

export class Transform{

  constructor(uuid){
    this.view(uuid)
  }

  view(uuid){
    this.uuid = uuid
    let template = Options.common.get_template('transform')
    if(!template){return}
    const cache    = Options.datas.get_data(uuid)
    // cache.uuid     = uuid
    // cache.filename = this.get_filename(cache)
    template       = Options.common.doubleBlancketConvert(template , cache)
    const area     = Options.elements.get_transform_area()
    area.innerHTML = template
    this.set_value()
    this.set_event()
  }

  hidden(){
    const area = Options.elements.get_transform_area()
    area.textContent = ''
  }

  set_value(){
    // const cache = Options.datas.get_data(this.uuid)
    // if(cache.rotate){
    //   this.range_rotate({target:{value:cache.rotate}})
    // }
    // if(cache.posx){
    //   this.range_posx({target:{value:cache.posx}})
    // }
    // if(cache.posy){
    //   this.range_posy({target:{value:cache.posy}})
    // }
  }

  // Event
  set_event(){
    const range_rotate = Options.elements.get_transform_rotate_range()
    if(range_rotate){
      Options.event.set(range_rotate, 'input', this.range_rotate.bind(this))
    }
    const range_posx = Options.elements.get_transform_posx_range()
    if(range_posx){
      Options.event.set(range_posx, 'input', this.range_posx.bind(this))
    }
    const range_posy = Options.elements.get_transform_posy_range()
    if(range_posy){
      Options.event.set(range_posy, 'input', this.range_posy.bind(this))
    }

    const input_rotate = Options.elements.get_transform_rotate_input()
    if(input_rotate){
      Options.event.set(input_rotate, 'input', this.input_rotate.bind(this))
    }
    const input_posx = Options.elements.get_transform_posx_input()
    if(input_posx){
      Options.event.set(input_posx, 'input', this.input_posx.bind(this))
    }
    const input_posy = Options.elements.get_transform_posy_input()
    if(input_posy){
      Options.event.set(input_posy, 'input', this.input_posy.bind(this))
    }
  }

  range_rotate(e){
    const elm = Options.elements.get_transform_rotate_input()
    if(!elm){return}
    elm.value = e.target.value
    Options.datas.set_data(this.uuid , 'rotate' , String(e.target.value))
    this.set_transform()
  }
  range_posx(e){
    const elm = Options.elements.get_transform_posx_input()
    if(!elm){return}
    elm.value = e.target.value
    Options.datas.set_data(this.uuid , 'posx' , String(e.target.value))
    this.set_transform()
  }
  range_posy(e){
    const elm = Options.elements.get_transform_posy_input()
    if(!elm){return}
    elm.value = e.target.value
    Options.datas.set_data(this.uuid , 'posy' , String(e.target.value))
    this.set_transform()
  }

  input_rotate(e){
    Options.datas.set_data(this.uuid , 'rotate' , String(e.target.value))
    const elm = Options.elements.get_transform_rotate_range()
    if(elm){
      elm.value = e.target.value
    }
    this.set_transform()
  }
  input_posx(e){
    Options.datas.set_data(this.uuid , 'posx' , String(e.target.value))
    const elm = Options.elements.get_transform_posx_range()
    if(elm){
      elm.value = e.target.value
    }
    this.set_transform()
  }
  input_posy(e){
    Options.datas.set_data(this.uuid , 'posy' , String(e.target.value))
    const elm = Options.elements.get_transform_posy_range()
    if(elm){
      elm.value = e.target.value
    }
    this.set_transform()
  }

  set_transform(){
    if(!Options.img_datas[this.uuid]){return}
    Options.img_datas[this.uuid].set_transform()
  }

}