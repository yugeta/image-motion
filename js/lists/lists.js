import { Options } from '../options.js'

export class Lists{
  add(uuid , image_datas){
    if(!uuid || !image_datas){return}
    this.data = image_datas
    this.data.uuid = uuid
    this.init()
  }

  del(uuid){
    if(!uuid){return}
    const elm = Options.elements.get_list_item(uuid)
    if(!elm){return}
    elm.parentNode.removeChild(elm)
  }

  init(){
    this.add_list(this.data)
  }

  add_list(data){
    let template = Options.common.get_template('image_list')
    if(!template){return}
    template = Options.common.doubleBlancketConvert(template , data)
    this.add_parent(data , template)
    this.set_visibility(data.uuid)
  }
  add_parent(data , template){
    if(data.parent){
      const parent = Options.elements.get_list_item(data.parent)
      // console.log(data.uuid,parent)
      parent.querySelector(':scope > .sub-lists').insertAdjacentHTML('beforeend' , template)
    }
    else{
      const list_area = Options.elements.get_list_area()
      list_area.insertAdjacentHTML('beforeend' , template)
    }
  }

  update_name(uuid){
    const item = Options.elements.get_list_name(uuid)
    if(!item){return}
    const data = Options.datas.get_data(uuid)
    if(!data){return}
    item.textContent = data.name
  }

  set_visibility(uuid){
    const list_area = Options.elements.get_list_area()
    const item = list_area.querySelector(`[data-uuid='${uuid}']`)
    const elm = item.querySelector('.visibility')
    if(!elm){return}
    const data = Options.datas.get_data(uuid)
    if(!data){return}
    const status = data.hidden ? 'hidden' : ''
    elm.setAttribute('data-status' , status)
  }


}