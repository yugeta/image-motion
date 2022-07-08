import { Options } from '../options.js'

export class Property{
  
  view(uuid){
    let template = Options.common.get_template('image_property')
    if(!template){return}
    if(!Options.datas[uuid] || !Options.datas[uuid].data){return}
    const data = this.get_data(uuid)
    const img  = data.pic.querySelector('img')
    data.uuid  = uuid
    data.x     = data.x    || data.pic.offsetLeft
    data.y     = data.y    || data.pic.offsetTop
    data.w     = data.w    || img.offsetWidth
    data.h     = data.h    || img.offsetHeight
    data.file  = data.file || data.data.name
    data.name  = data.name || this.get_name(data.data.name)
    template   = Options.common.doubleBlancketConvert(template , data)
    const area = this.get_info_area()
    area.innerHTML = template
    this.set_event()
  }

  

  get_info_area(){
    return document.querySelector(`.contents [name='property'] .info`)
  }

  getForm(name){
    return document.querySelector(`.contents [name='property'] input[name='${name}']`)
  }


  update(data){
    for(let key in data){
      if(typeof data[key] === 'undefined'){continue}
      this.update_value(key , data)
    }
  }

  update_value(key , data){
    const input = this.getForm(key)
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
    // return ~~(num * 10) /10
  }

  get_name(str){
    const sp = str.split('.')
    return sp.slice(0,sp.length-1).join('.')
  }

  get_data(uuid){
    return Options.datas[uuid]
  }
  set_data(uuid , key , val){
    const data = this.get_data(uuid)
    data[key] = val
  }
  set_lists(uuid , val){
    Options.lists.update_name(uuid , val)
  }
  


  // Event

  set_event(){
    const area = this.get_info_area()
    const name = area.querySelector(`input[name='name']`)
    if(name){
      name.oninput = this.chenge_name.bind(this)
    }
    const x    = area.querySelector(`input[name='x']`)
    if(x){
      x.oninput = this.chenge_x.bind(this)
    }
    const y    = area.querySelector(`input[name='y']`)
    if(y){
      y.oninput = this.chenge_y.bind(this)
    }
    const w    = area.querySelector(`input[name='w']`)
    if(w){
      w.oninput = this.chenge_w.bind(this)
    }
    const h    = area.querySelector(`input[name='h']`)
    if(h){
      h.oninput = this.chenge_h.bind(this)
    }
  }
  get_uuid(){
    const area = this.get_info_area()
    return area.querySelector(`input[name='uuid']`).value
  }
  chenge_name(e){
    const uuid = this.get_uuid()
    this.set_data(uuid , 'name' , e.target.value)
    this.set_lists(uuid , e.target.value)
  }
  chenge_x(e){
    const uuid = this.get_uuid()
    this.set_data(uuid , 'x' , e.target.value)
  }
  chenge_y(e){
    const uuid = this.get_uuid()
    this.set_data(uuid , 'y' , e.target.value)
  }
  chenge_w(e){
    const uuid = this.get_uuid()
    this.set_data(uuid , 'w' , e.target.value)
  }
  chenge_h(e){
    const uuid = this.get_uuid()
    this.set_data(uuid , 'h' , e.target.value)
  }

}
