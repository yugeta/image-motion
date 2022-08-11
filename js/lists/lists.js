import { Options }      from '../options.js'
import * as ImageCommon from '../images/common.js'
import { Upload      }  from '../images/upload.js'
import { Renew       }  from '../images/renew.js'

export class Lists{
  constructor(){
    this.upload()
  }

  upload(){
    // Options.event.set(
    //   document.querySelector('.contents [name="images"]'),
    //   'click',
    //   Options.control.image_upload,
    // )
    const area = document.querySelector('.contents [name="images"]')
    area.addEventListener('click' , this.lists_click.bind(this))
  }

  lists_click(e){
    // image-add-button
    if(Options.elements.upper_selector(e.target , '.plus')){
      new Upload()
    }

    // image-renew
    else if(Options.elements.upper_selector(e.target , '.renew')){
      new Renew()
    }

    // 除外
    else if(Options.elements.upper_selector(e.target , '.visibility')){
      return
    }
    else if(Options.elements.upper_selector(e.target , '.folder')){
      return
    }

    // list-click
    else{
      const list = Options.elements.upper_selector(e.target , '.item[data-uuid]')
      if(list){
        const uuid = list.getAttribute('data-uuid')
        ImageCommon.img_select(uuid)
      }
    }
  }


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