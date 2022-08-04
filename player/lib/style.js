import { Options } from '../options.js'
import { Ajax }    from './ajax.js'

export class Style{
  constructor(css_path){
    this.css = css_path
    this.set_style()
  }

  set_style(){
    const elm = document.querySelector(`style[data-service='${Options.service_name}']`)
    if(elm){
      this.elm = elm
    }
    else{
      this.elm = this.create_style()
      if(this.css){
        this.load_css()
      }
    }
  }
  load_css(){
    new Ajax({
      url : this.css,
      method : 'get',
      callback : this.loaded_css.bind(this)
    })
  }
  loaded_css(e){
    this.elm = this.create_style()
    this.elm.textContent = e.target.response +'\n'
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