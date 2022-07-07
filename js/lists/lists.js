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

  get_list_area(){
    return document.querySelector(`.contents [name='images'] ul`)
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
  }

  // set_event(elm){
  //   if(!elm){return}
  //   elm.addEventListener('click' , this.click_list.bind(this))
  // }

  click_list(e){
    const list = Options.common.upper_selector(e.target , 'li')
    if(!list){return}
    const uuid = list.getAttribute('data-uuid')
    Options.images.active(uuid)
  }


}