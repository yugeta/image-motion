import { Options } from '../options.js'
import { Ajax }    from '../common/ajax.js'

export class Version{
  constructor(){console.log(1)
    // this.version = Options.elements.get_version()
    this.init()
  }
  async init(){
    this.main     = Options.versions.main
    this.sub      = Options.versions.sub
    this.revision = 0
    this.load_revision()
  }

  get full(){
    return `${this.main}.${this.sub}.${this.revision}`
  }

  // get_version(){
  //   const vals = []
  //   vals.push(Options.versions.main)
  //   vals.push(Options.versions.sub)
  //   vals.push(this.revision || Options.versions.revision)
  //   return vals.join('.')
  // }

  load_revision(){
    new Ajax({
      url      : `.git/refs/heads/${Options.versions.git_target}`,
      method   : 'get',
      callback : (e => {
        const val = e.target.response
        this.revision = val ? val.slice(0,5) : this.revision
        Options.versions.revision = this.revision
      }).bind(this)
    })
  }
}