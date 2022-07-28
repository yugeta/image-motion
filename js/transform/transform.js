import { Options } from '../options.js'

export class Transform{

  constructor(uuid){
    this.view(uuid)
  }

  view(uuid){
    this.uuid = uuid
    this.init_data()
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

  init_data(){
    Options.trans_datas[this.uuid] = Options.trans_datas[this.uuid] || {}
    this.trans_data = Options.trans_datas[this.uuid]
  }

  hidden(){
    const area = Options.elements.get_transform_area()
    area.textContent = ''
  }

  set_value(){
    // switch(Options.common.get_hash()){
    //   case 'upload':
    //     break

    //   case 'action':
    //     this.trans_data = Options.datas.get_data(this.uuid)
    //     break
    // }
    if(this.trans_data.rotate){
      this.range_rotate({target:{value:this.trans_data.rotate}})
    }
    if(this.trans_data.posx){
      this.range_posx({target:{value:this.trans_data.posx}})
    }
    if(this.trans_data.posy){
      this.range_posy({target:{value:this.trans_data.posy}})
    }
  }

  // Event
  set_event(){
    Options.event.set(
      Options.elements.get_transform_rotate_range(), 
      'input', 
      this.range_rotate.bind(this)
    )
    Options.event.set(
      Options.elements.get_transform_posx_range(), 
      'input', 
      this.range_posx.bind(this),
    )
    Options.event.set(
      Options.elements.get_transform_posy_range(), 
      'input', 
      this.range_posy.bind(this)
    )
    Options.event.set(
      Options.elements.get_transform_rotate_input(), 
      'input', 
      this.input_rotate.bind(this)
    )
    Options.event.set(
      Options.elements.get_transform_posx_input(), 
      'input', 
      this.input_posx.bind(this)
    )
    Options.event.set(
      Options.elements.get_transform_posy_input(), 
      'input', 
      this.input_posy.bind(this)
    )
    Options.event.set(
      Options.elements.get_transform_posz_input(), 
      'input', 
      this.input_posz.bind(this)
    )
  }

  range_rotate(e){
    const elm = Options.elements.get_transform_rotate_input()
    if(!elm){return}
    elm.value = e.target.value
    this.set_data('rotate' , Number(e.target.value))
    this.set_transform()
  }
  range_posx(e){
    const elm = Options.elements.get_transform_posx_input()
    if(!elm){return}
    elm.value = e.target.value
    this.set_data('posx' , Number(e.target.value))
    this.set_transform()
  }
  range_posy(e){
    const elm = Options.elements.get_transform_posy_input()
    if(!elm){return}
    elm.value = e.target.value
    this.set_data('posy' , Number(e.target.value))
    this.set_transform()
  }

  input_rotate(e){
    const elm = Options.elements.get_transform_rotate_range()
    if(elm){
      elm.value = e.target.value
    }
    this.set_data('rotate' , Number(e.target.value))
    this.set_transform()
  }
  input_posx(e){
    const elm = Options.elements.get_transform_posx_range()
    if(elm){
      elm.value = e.target.value
    }
    this.set_data('posx' , Number(e.target.value))
    this.set_transform()
  }
  input_posy(e){
    const elm = Options.elements.get_transform_posy_range()
    if(elm){
      elm.value = e.target.value
    }
    this.set_data('posy' , Number(e.target.value))
    this.set_transform()
  }
  input_posz(e){
    const key = 'posz'
    const num = Number(e.target.value) || 0
    this.set_data(key , num)
    Options.datas.set_data(this.uuid , key , num)
    this.set_transform()
  }

  set_data(key , value){
    // switch(Options.common.get_hash()){
    //   case 'upload':
        this.trans_data[key] = value
    //     break

    //   case 'action':
    //     Options.datas.set_data(this.uuid , key , value)
    //     break
    // }
    
  }

  set_transform(){
    if(!Options.img_datas[this.uuid]){return}
    // switch(Options.common.get_hash()){
    //   case 'upload':
        Options.img_datas[this.uuid].set_transform(this.trans_data)
    //     break

    //   case 'action':
    //     Options.img_datas[this.uuid].set_transform(this.trans_data)
    //     break
    // }
  }

}