

export class Animation{
  constructor(options){
    this.options = options
  }

  get animation_names(){
    return this.options.datas.map(e => e.animation_name)
  }
}