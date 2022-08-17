import { Player } from '../../../player/player.js'

class Main{
  constructor(){
    this.options = parent.main.options
    this.datas = this.get_datas()
    if(!this.datas || !this.datas.images.length){return}
    this.select = this.get_select()
    this.preview = this.get_preview()
    this.set_animation_names()
    this.set_event()
    this.view()
  }

  get_datas(){
    return this.options.datas.get_save_data()
  }
  get_select(){
    return document.querySelector(`select.animation_name`)
  }
  get_preview(){
    return document.getElementById('preview')
  }

  set_animation_names(){
    const animations = this.datas.animations
    const select = this.select
    const options = select.options
    if(!Object.keys(animations).length){return}
    for(let animation_name in animations){
      options[options.length] = new Option(animation_name , animation_name)
    }
  }

  set_event(){
    this.select.addEventListener('change' , this.change_select.bind(this))
  }
  change_select(e){
    const animation_name = e.target.value
    this.preview.setAttribute('data-action' , animation_name)
  }

  view(){
    new Player({
      data     : JSON.parse(JSON.stringify(this.datas)),
      selector : '#preview',     // キャラクター画像をloadする要素の指定
    })
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