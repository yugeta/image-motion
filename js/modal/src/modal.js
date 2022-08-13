import { Options } from './options.js'
import { Ajax }    from './ajax.js'

export class Modal{
  constructor(options){
    if(!options){return}
    this.options  = this.reflect_options(options)
    this.meta_url = import.meta.url
    this.load()
  }

  load(){
    this.load_css()
  }

  reflect_options(options){
    const datas = {}
    for(let i in Options){
      options[i] = typeof options[i] !== 'undefined' ? options[i] : Options[i]
    }
    return options
  }

  elm_css(){
    return document.querySelector(`style[data-name='${this.options.name}']`)
  }
  get_css_filename(){
    return this.meta_url.replace(/\.js$/ , '.css')
  }
  load_css(){
    if(this.elm_css()){
      this.load_html()
    }
    else{
      this.ajax_css()
    }
  }
  ajax_css(){
    new Ajax({
      url : this.get_css_filename(),
      method : 'get',
      callback : (e =>{
        this.set_css(e.target.response)
        this.load_html()
      }).bind(this)
    })
  }
  set_css(css){
    const head  = document.querySelector('head')
    const style = document.createElement('style')
    style.setAttribute('data-name' , this.options.name)
    style.textContent = css
    head.appendChild(style)
  }


  elm_html(){
    return document.querySelector(`div.template[data-name='${this.options.name}'] > textarea[data-name='${this.options.name}']`)
  }
  get_html_filename(){
    return this.meta_url.replace(/\.js$/ , '.html')
  }
  load_html(){
    if(this.elm_html()){
      this.view()
    }
    else{
      this.ajax_html()
    }
  }
  ajax_html(){
    new Ajax({
      url : this.get_html_filename(),
      method : 'get',
      callback : (e =>{
        this.set_html(e.target.response)
        this.view()
      }).bind(this)
    })
  }
  set_html(html){
    const body  = document.body
    const div = document.createElement('div')
    div.className = 'template'
    div.setAttribute('data-name' , this.options.name)
    const textarea = document.createElement('textarea')
    textarea.setAttribute('data-name' , this.options.name)
    textarea.value = html
    div.appendChild(textarea)
    body.appendChild(div)
  }
  get_template(){
    const elm = this.elm_html()
    if(!elm){return}
    if(elm.tagName === 'TEXTAREA'){
      return elm.value
    }
    else{
      return elm.innerHTML
    }
  }

  view(){
    const template = this.get_template()
    const bg = this.get_bg()
    bg.innerHTML = template
    this.set_base()
    this.set_close()
    this.set_close_icon()
    this.set_title()
    this.set_message()
    this.set_buttons()
    this.set_offset()
    this.options.loaded(this)

    setTimeout(this.view_start.bind(this) , 30)
  }

  faceout(){
    this.view_hidden()
    setTimeout(this.close.bind(this) , 500)
  }
  close(){
    const bg = this.get_bg()
    bg.parentNode.removeChild(bg)
  }

  view_start(){
    const bg = this.get_bg()
    bg.setAttribute('data-view' , 1)
  }
  view_hidden(){
    const bg = this.get_bg()
    bg.setAttribute('data-view' , 0)
  }

  get_bg(){
    const bg = document.querySelector(`.modal-bg[data-name='${this.options.name}']`)
    if(bg){
      return bg
    }
    else{
      return this.make_bg()
    }
  }

  make_bg(){
    const bg = document.createElement('div')
    bg.className = 'modal-bg'
    bg.setAttribute('data-name' , this.options.name)
    if(this.options.background_click === "close"){
      bg.addEventListener(`click` , this.click_bg.bind(this))
    }
    document.body.appendChild(bg)
    return bg
  }

  click_bg(e){
    if(!e.target.matches(`.modal-bg`)){return}
    this.faceout()
  }

  get_base(){
    const bg = this.get_bg()
    return bg.querySelector(`.modal-base`)
  }
  set_base(){
    const base = this.get_base()
    base.style.setProperty(`width`  , this.options.size.width   , '')
    base.style.setProperty(`height` , this.options.size.height  , '')
  }

  get_close(){
    const bg = this.get_bg()
    return bg.querySelector(`.modal-close`)
  }
  set_close(){
    if(!this.options.close){return}
    const close = this.get_close()
    close.style.setProperty(`width`  , this.options.close.size , '')
    close.style.setProperty(`height` , this.options.close.size , '')
    if(this.options.close.click){
      close.addEventListener('click' , this.options.close.click)
    }
    close.addEventListener('click' , this.faceout.bind(this))
  }
  set_close_icon(){
    const close = this.get_close()
    const close_icon = close.querySelector(`.modal-close-icon`)
    close_icon.innerHTML = this.options.close.html
  }

  set_title(){
    if(!this.options.title){return}
    const bg = this.get_bg()
    const title = bg.querySelector(".modal-title")
    title.innerHTML = this.options.title
  }

  set_message(){
    const bg = this.get_bg()
    const message = bg.querySelector(".modal-message")
    message.style.setProperty(`height`     , this.options.message.height , '')
    message.style.setProperty('text-align' , this.options.message.align  , '')
    message.style.setProperty('padding'    , this.options.message.padding  , '')
    const message_contents = bg.querySelector(".modal-message-contents")
    message_contents.innerHTML = this.options.message.html
  }

  set_buttons(){
    const bg = this.get_bg()
    const button_area = bg.querySelector(".modal-button-area")
    for(var i in this.options.button){
      const button = document.createElement("button")
      button.className = "modal-button"
      button.innerHTML = this.options.button[i].text
      if(this.options.button[i].click){
        button.addEventListener('click' , this.options.button[i].click)
      }
      if(this.options.button[i].mode === "close"){
        button.addEventListener('click' , this.faceout.bind(this))
      }
      button_area.appendChild(button)
    }
  }

  set_offset(){
    const bg   = this.get_bg()
    const base = this.get_base()
    base.setAttribute('data-position-x' , this.options.position.horizon  || 'center')
    base.setAttribute('data-position-y' , this.options.position.vertical || 'center')
    let transX = 0;
    let transY = 0;
    switch(this.options.position.horizon){
      case 'left' :break;
      case 'right':break;
      default:
        transX = '-50%';
        break;
    }
    switch(this.options.position.vertical){
      case 'top'   :break;
      case 'bottom':break;
      default:
        transY = '-50%';
        break;
    }
    if(this.options.offset){
      transX = this.set_calc_value(transX , this.options.offset.x)
      transY = this.set_calc_value(transY , this.options.offset.y)
      base.style.setProperty('transform'  , `translate(${transX} , ${transY})` , '')
    }
    if(this.options.position.speed){
      base.style.setProperty('transition-duration'  , this.options.speed , '')
      bg.style.setProperty('transition-duration'  , this.options.speed , '')
    }
  }

  set_calc_value(val1 , val2){
    if(val1){
      if(val2){
        return `calc(${val1} + ${val2})`
      }
      else{
        return val1
      }
    }
    else{
      if(val2){
        return val2
      }
      else{
        return val1
      }
    }
  }
}
