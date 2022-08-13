import { Options }       from '../options.js'

export class HashChange{
  constructor(){
    this.hash = Options.common.get_hash()
    this.change()
  }
  change(){
    const iframe = this.get_iframe()
    switch(this.hash){
      case 'upload':
      case 'action':
      // case 'sound':
        break

      case '':
        iframe.src = 'page/index.html'
        break
      case 'help':
      default:
        iframe.src = `page/${this.hash}.html`
        break
    }
  }
  get_iframe(){
    return Options.elements.get_iframe()
  }
}