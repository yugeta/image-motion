import { Player } from '../../../player/player.js'
import { Save }   from './save.js'

class Main{
  constructor(){
    this.options = parent.main.options
    this.datas   = this.get_datas()
    if(!this.datas || !this.datas.images.length){return}
    this.set_animation_names()
    this.set_event()
    this.view()
    this.set_size()
  }

  get_datas(){
    return this.options.datas.get_save_data()
  }
  get elm_animation_name_select(){
    return document.querySelector(`select.animation_name`)
  }
  get elm_save(){
    return document.querySelector(`#save`)
  }
  get elm_width(){
    return document.querySelector(`input[name='width']`)
  }
  get elm_height(){
    return document.querySelector(`input[name='height']`)
  }
  get elm_preview(){
    return document.getElementById('preview')
  }
  get elm_rate(){
    return document.querySelector(`input[name='rate']`)
  }

  set_animation_names(){
    const animations = this.datas.animations
    const select = this.elm_animation_name_select
    const options = select.options
    if(!Object.keys(animations).length){return}
    for(let animation_name in animations){
      options[options.length] = new Option(animation_name , animation_name)
    }
  }

  set_event(){
    this.elm_animation_name_select.addEventListener('change' , this.change_select.bind(this))
    this.elm_save.addEventListener('click'   , this.click_save.bind(this))
    this.elm_width.addEventListener('input'  , this.change_size.bind(this , 'width'))
    this.elm_height.addEventListener('input' , this.change_size.bind(this , 'height'))
    this.elm_rate.addEventListener('input' , this.change_size.bind(this , 'rate'))
  }
  change_select(e){
    const animation_name = e.target.value
    this.elm_preview.setAttribute('data-action' , animation_name)
  }

  view(){
    this.player = new Player({
      data     : JSON.parse(JSON.stringify(this.datas)),
      selector : '#preview',     // キャラクター画像をloadする要素の指定
    })
  }

  get width(){
    return Number(this.elm_width.value  || 0)
  }
  get height(){
    return Number(this.elm_height.value || 0)
  }
  get rate(){
    return Number(this.elm_rate.value || 1)
  }

  click_save(){
    new Save(this)
  }
  set_size(){
    this.elm_width.value  = this.player.options.scale.fit.width
    this.elm_height.value = this.player.options.scale.fit.height
    this.elm_width.setAttribute('data-default-size'  , this.player.options.scale.fit.width)
    this.elm_height.setAttribute('data-default-size' , this.player.options.scale.fit.height)
  }

  change_size(type){
    const width  = Number(this.elm_width.getAttribute('data-default-size')  || 0)
    const height = Number(this.elm_height.getAttribute('data-default-size') || 0)
    const num = {
      width  : 0,
      height : 0,
    }
    switch(type){
      case 'width':
        num.width  = Number(this.elm_width.value || 0)
        const rate_w = (num.width / width)
        num.height = height * rate_w
        this.elm_height.value = num.height
        this.elm_rate.value = rate_w
        break
      case 'height':
        num.height = Number(this.elm_height.value || 0)
        const rate_h = (num.height / height)
        num.width  = width * rate_h
        this.elm_width.value = num.width
        this.elm_rate.value = rate_h
        break
      case 'rate':
        const rate = Number(this.elm_rate.value || 0)
        this.elm_width.value  = width  * rate
        this.elm_height.value = height * rate
    }
  }

}

// (()=>{new Main()})()
switch(document.readyState){
  case 'complete': 
    window.main = new Main(); 
    break
  default: 
    window.addEventListener('load' , (function(){
      window.main = new Main()
    })); 
    break
}