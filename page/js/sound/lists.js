import { Options } from './options.js'

export class Lists{
  constructor(options){
    this.options = options
    // this.uuid = datas.uuid
    // this.name = datas.name
    // this.file = datas.file || datas.name
    this.view_add()
  }
  
  get_area(){
    return document.querySelector('.contents-sound .lists > ul')
  }
  get_template(){
    const elm = document.querySelector(`.template > [data-name='sound-list']`)
    return Options.common.doubleBlancketConvert(elm.innerHTML , this.options)
  }
  get_item(){
    const area = this.get_area()
    return area.querySelector(`[data-uuid='${this.options.uuid}']`)
  }
  get_play(){
    const item = this.get_item()
    return item.querySelctor(`.play`)
  }

  view_add(){
    const area = this.get_area()
    const li = document.createElement('li')
    li.setAttribute('data-uuid' , this.options.uuid)
    li.textContent = this.options.name
    li.innerHTML = this.get_template()
    area.appendChild(li)
  }
}