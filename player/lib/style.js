import { Options } from '../options.js'

export class Style{
  constructor(){
    this.elm = this.get_style()
  }

  get_style(){
    const elm = document.querySelector(`style[data-service='${Options.service_name}']`)
    if(elm){
      return elm
    }
    else{
      return this.create_style()
    }
  }
  // styleタグの設置
  create_style(){
    const style = document.createElement('style')
    style.setAttribute('type' , 'text/css')
    style.setAttribute('data-service' , Options.service_name)
    document.querySelector('head').appendChild(style)
    return style
  }

  add(val){
    if(!val){return}
    this.elm.textContent += val+'\n'
  }
  


}