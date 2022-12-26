

export class Animation{
  constructor(options){
    this.options = options
  }

  get animation_names(){
    return this.options.data.map(e => e.name)
  }
}