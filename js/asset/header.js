import { Options }  from '../options.js'

export class Header{
  constructor(){
    this.get_elm_header().addEventListener('click' , this.click_header.bind(this))
    this.get_elm_input_scale().addEventListener('input' , this.change_scale.bind(this))
    this.set_contents_hash()
    this.change_scale()
  }

  click_header(e){
    const target = Options.common.upper_selector(e.target , 'header > ul.view > li')
    if(!target){return}
    setTimeout(this.set_contents_hash , 0)
  }

  set_contents_hash(){
    const hash = Options.common.get_hash()
    document.body.setAttribute('data-hash' , hash)
  }

  
  change_scale(e){
    const target = e ? e.target : this.get_elm_input_scale()
    document.querySelector(`header .range .scale-value`).textContent = target.value
    const rate = target.value / 100
    this.get_elm_contents_scale().style.setProperty(`transform`,`scale(${rate})`,'')
  }


  // ----------
  // Elements
  get_elm_header(){
    return document.querySelector('header')
  }
  get_elm_input_scale(){
    return document.querySelector(`header .range input[type='range'][name='scale']`)
  }
  get_elm_contents_scale(){
    return document.querySelector(`.contents [name='view'] .scale`)
  }
  
}
