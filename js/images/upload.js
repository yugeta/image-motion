import { Options }      from '../options.js'
import { Images  }      from './images.js'

export class Upload{
  constructor(){
    this.click()
  }
  click(){
    let input_file = document.createElement("input")
    input_file.type     = 'file'
    input_file.multiple = 'multiple'
    input_file.name     = 'images[]'
    input_file.accept   = 'image/*'
    input_file.addEventListener('change' , this.upload_files.bind(this))
    document.querySelector("form[name='upload']").appendChild(input_file)
    input_file.click()
  }
  upload_files(e){
    if(!e.target.files.length){return}
    for(let file of e.target.files){
      new Images({file:file})
    }
  }
  
}