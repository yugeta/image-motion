import { Options }      from '../options.js'
import { Images  }      from '../images/images.js'
import { New  }         from '../data/new.js'

export class Load{
  constructor(){
    this.load_file()
  }

  loaded_change_hash(){
    if(!Options.common.get_hash()){
      Options.common.set_hash('upload')
    }
  }

  load_file(){
    let input_file = document.createElement("input")
    input_file.type     = 'file'
    input_file.multiple = 'multiple'
    input_file.accept   = Options.save_file_extension
    input_file.addEventListener('change' , this.get_file.bind(this))
    document.querySelector("form[name='upload']").appendChild(input_file)
    input_file.click()
  }

  get_file(e){
    if(!e.target.files.length){return}
    this.set_filename(e.target.files[0].name)
    this.upload(e.target.files[0])
  }

  set_filename(filename){
    const sp = filename.split('.')
    Options.load_filename = sp.splice(0,sp.length-1).join('.')
  }

  upload(file){
    new New()
    const fileReader  = new FileReader()
    fileReader.onload = this.loaded.bind(this, fileReader)
    fileReader.readAsText(file)
  }

  loaded(e){
    if(!e || !e.result){return}
    const datas = JSON.parse(e.result)
    if(!this.data_check(datas)){
      this.error()
      return
    }
    const lists = this.get_image_sort_lists(datas)
    for(let data of lists){
      new Images({data:data})
    }
    
    Options.animations = datas.animations || {}
    Options.sounds     = datas.sounds     || []

    this.loaded_change_hash()
  }

  get_image_sort_lists(datas){
    if(!datas.sort){return datas.images}
    const lists = []
    for(let uuid of datas.sort){
      const data = this.pickup_uuidData(datas , uuid)
      if(!data){continue}
      lists.push(data)
    }
    return lists
  }

  pickup_uuidData(datas , uuid){
    for(let data of datas.images){
      if(data.uuid !== uuid){continue}
      return data
    }
  }

  // データチェック
  data_check(data){
    return true
  }

  error(){
    alert('データが正しく読み込めません。')
  }

}