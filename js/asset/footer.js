import { Options } from '../options.js'
import { Ajax    } from '../common/ajax.js'

export class Footer{
  constructor(){
    if(!Options.elements.get_footer()){return}
    this.version = Options.elements.get_version()
    this.init()
  }

  init(){
    this.load_revision()
  }

  view_version(){
    this.version.textContent = this.get_version()
  }

  load_revision(){
    new Ajax({
      url      : `.git/refs/heads/${Options.versions.git_target}`,
      method   : 'get',
      callback : (e => {
        const val = e.target.response
        this.revision = val ? val.slice(0,5) : ''
        this.view_version()
      }).bind(this)
    })
  }
  get_version(){
    const vals = []
    vals.push(Options.versions.main)
    vals.push(Options.versions.sub)
    vals.push(this.revision || Options.versions.revision)
    return vals.join('.')
  }

}
