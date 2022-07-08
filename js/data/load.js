import { Options }  from '../options.js'

export class Load{
  constructor(){
    this.load_file()
  }

  load_file(){
    let input_file = document.createElement("input")
    input_file.type     = 'file'
    input_file.multiple = 'multiple'
    input_file.name     = 'json_file'
    input_file.addEventListener('change' , this.get_file.bind(this))
    document.querySelector("form[name='upload']").appendChild(input_file)
    input_file.click()
  }

  get_file(e){
    if(!e.target.files.length){return}
    this.upload(e.target.files[0])
  }
  upload(file){
    const fileReader  = new FileReader()
    fileReader.onload = this.loaded.bind(this, fileReader)
		// fileReader.readAsDataURL(file)
    fileReader.readAsText(file)
  }

  loaded(e){
    if(!e || !e.result){return}
    const data = JSON.parse(e.result)
    console.log(data)

  }

}