import { Options } from '../options.js'

export class Property{
  
  view(uuid){
    let template = Options.common.get_template('image_property')
    if(!template){return}
    const cache    = Options.datas.get_data(uuid)
    cache.uuid     = uuid
    cache.filename = this.get_filename(cache)
    template       = Options.common.doubleBlancketConvert(template , cache)
    const area     = Options.elements.get_info_area()
    area.innerHTML = template
    this.set_event()
  }

  hidden(){
    const area = Options.elements.get_info_area()
    area.textContent = ''
  }

  get_filename(cache){
    if(!cache){
      return ''
    }
    else if(cache.filename){
      return cache.filename
    }
    else if(cache.file){
      return cache.file.name
    }
    else {
      return ''
    }
  }

  update(data){
    for(let key in data){
      if(typeof data[key] === 'undefined'){continue}
      this.update_value(key , data)
    }
  }

  update_value(key , data){
    const input = Options.elements.get_info_form(key)
    switch(typeof data[key]){
      case 'number':
        input.value = this.number_format(data[key])
        break
      case 'string':
      default:
        input.value = data[key]
        break
    }
  }

  number_format(num){
    return ~~(num)
  }

  set_lists(uuid , val){
    Options.lists.update_name(uuid , val)
  }

  // Event
  set_event(){
    const area = Options.elements.get_info_area()
    Options.event.set(
      area.querySelector(`input[name='name']`) , 
      'input' , 
      this.chenge_name.bind(this)
    )
    Options.event.set(
      area.querySelector(`input[name='x']`) , 
      'input' , 
      this.chenge_num.bind(this , 'x')
    )
    Options.event.set(
      area.querySelector(`input[name='y']`) , 
      'input' , 
      this.chenge_num.bind(this , 'y')
    )
    Options.event.set(
      area.querySelector(`input[name='w']`) , 
      'input' , 
      this.chenge_num.bind(this , 'w')
    )
    Options.event.set(
      area.querySelector(`input[name='h']`) , 
      'input' , 
      this.chenge_num.bind(this , 'h')
    )
    Options.event.set(
      area.querySelector(`input[name='order']`) , 
      'input' , 
      this.chenge_num.bind(this , 'order')
    )
    // Options.event.set(
    //   area.querySelector(`input[name='posz']`) , 
    //   'input' , 
    //   this.chenge_num.bind(this , 'posz')
    // )
  }
  get_uuid(){
    const area = Options.elements.get_info_area()
    return area.querySelector(`input[name='uuid']`).value
  }
  chenge_name(e){
    const uuid = this.get_uuid()
    Options.datas.set_data(uuid , 'name' , String(e.target.value))
    this.set_lists(uuid , e.target.value)
  }
  chenge_num(key , e){
    const uuid = this.get_uuid()
    const num  = e.target.value || 0
    // if(!String(num).match(/^[\-\.\d].+$/)){return}
    if(Number(num) === NaN){return}
    Options.datas.set_data(uuid , key , Number(num))
    this.image_move(uuid , key)
    Options.img_datas[uuid].set_image_order()
    Options.img_datas[uuid].set_image_transform()
  }

  chenge_string(key , e){
    const uuid = this.get_uuid()
    const str  = e.target.value || ''
    Options.datas.set_data(uuid , key , String(str))
  }

  image_move(uuid , key){
    if(!Options.img_datas[uuid]){return}
    if(key === 'x' || key === 'y'){
      const data = Options.datas.get_data(uuid)
      Options.img_datas[uuid].cache.x = data.x
      Options.img_datas[uuid].cache.y = data.y
      Options.img_datas[uuid].set_image_pos()
    }
    else if(key === 'w' || key === 'h'){
      const data = Options.datas.get_data(uuid)
      Options.img_datas[uuid].cache.w = data.w
      Options.img_datas[uuid].cache.h = data.h
      Options.img_datas[uuid].set_image_size()
    }
  }
}
