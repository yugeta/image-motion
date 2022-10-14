
export class Images{
  constructor(options){
    if(!options.data || !options.data.length){return}
    this.options = options
    this.init()
  }

  get datas(){
    return this.options.data
  }

  init(){
    for(let i=0; i<this.datas.length; i++){
      if(!this.datas[i].images){continue}
      this.datas[i].elements = []
      for(let image_data of this.datas[i].images){
        // console.log(image_data)
        const img = new Image()
        img.src = image_data.image
        image_data.element = img
      }
    }
  }
}