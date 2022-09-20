import { Options }      from '../options.js'

export class Renew{
  constructor(){
    const uuid = this.get_active_uuid()
    if(!uuid){return}
    this.uuid = uuid
    this.click()
  }
  click(){
    let input_file = document.createElement("input")
    input_file.type     = 'file'
    input_file.accept   = 'image/*'
    input_file.addEventListener('change' , this.upload_files.bind(this))
    document.querySelector("form[name='upload']").appendChild(input_file)
    input_file.click()
  }

  upload_files(e){
    if(!e.target.files.length){return}
    if(!this.uuid){return}
    const data = e.target.files[0]
    if(Options.img_datas[this.uuid]){
      Options.img_datas[this.uuid].renew(data)
    }
  }

  get_active_uuid(){
    const elm = Options.elements.get_active_view()
    return elm ? elm.getAttribute('data-uuid') : null
  }

  upload_thumbnail(){

  }
}
