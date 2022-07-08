import { Options } from '../options.js'

export class Lists{
  add(uuid , image_datas){
    if(!uuid || !image_datas){return}
    this.data = image_datas
    this.data.uuid = uuid
    if(!Options.datas[uuid]){
      Options.datas[uuid] = {}
    }
    this.init()
  }

  click(e){
    // image-add-button
    if(Options.common.upper_selector(e.target , '.plus')){
      Options.images.add()
    }

    // list-click
    else{
      const list = Options.common.upper_selector(e.target , 'li[data-uuid]')
      const uuid = list ? list.getAttribute('data-uuid') : null
      Options.images.active(uuid)
      Options.property.view(uuid)
    }
  }

  get_list_area(){
    return document.querySelector(`.contents [name='images'] ul`)
  }
  get_list_item(uuid){
    const area = this.get_list_area()
    return area.querySelector(`[data-uuid='${uuid}']`)
  }
  get_list_name(uuid){
    const area = this.get_list_area()
    return area.querySelector(`[data-uuid='${uuid}'] .name`)
  }

  init(){
    this.add_list(this.data)
  }

  add_list(data){
    const list_area = this.get_list_area()
    let template = Options.common.get_template('image_list')
    if(!template){return}
    template = Options.common.doubleBlancketConvert(template , data)
    list_area.insertAdjacentHTML('beforeend' , template)
    const elm = list_area.querySelector(`[data-uuid='${data.uuid}']`)
    // this.set_event(elm)
    Options.datas[data.uuid].list = elm
    Options.datas[data.uuid].data = data
  }

  update_name(uuid){
    const item = this.get_list_name(uuid)
    if(!item){return}
    const data = Options.datas[uuid]
    if(!data){return}
    item.textContent = data.name
  }

  // set_event(elm){
  //   if(!elm){return}
  //   elm.addEventListener('click' , this.click_list.bind(this))
  // }

  // click_list(e){
  //   const list = Options.common.upper_selector(e.target , 'li')
  //   if(!list){return}
  //   const uuid = list.getAttribute('data-uuid')
  //   Options.images.active(uuid)
  // }


}