
export class NotAllowedError{
  constructor(options){
    this.options = options
    this.set_event()
    this.flg = false
  }

  set_event(){
    window.addEventListener('click' , this.clicked.bind(this))
  }

  clicked(e){
    if(this.flg !== false){return}
    this.flg = true
    window.removeEventListener('click' , this.clicked.bind(this))
    if(!this.options.sound){return}
    this.options.sound.set_sound_elements()
  }

  finish_wait(){
    if(this.flg === true){return true}
    console.log('no-finish')
  }
}