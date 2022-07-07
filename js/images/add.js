import { Upload } from './upload.js'

export class Add{
  constructor(){
    this.init()
  }

  init(){
    let input_file = document.createElement("input")
    input_file.type     = 'file'
    input_file.multiple = 'multiple'
    input_file.name     = 'images[]'
    input_file.addEventListener('change' , this.pick_imgs_upload.bind(this))
    document.querySelector("form[name='upload']").appendChild(input_file)
    input_file.click()
  }

  pick_imgs_upload(e){
    if(!e.target.files.length){return}
    for(let file of e.target.files){
      new Upload(file)
    }
  }

}