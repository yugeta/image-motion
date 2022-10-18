import { Options }  from '../options.js'

export class Save{
  constructor(){
    const images = Options.elements.get_image_lists()
    if(!images.length){return}
    const data = Options.datas.get_save_data()
    this.download(data)
  }
  
  download(data){
    const url  = this.get_url(data)
    const filename = this.get_filename()
    const link = this.make_link(url , filename + this.get_extension())
    document.body.appendChild(link);
    link.onloadstart = (function(e){console.log(e)}).bind(this)
    link.click()
    // console.log(link.__proto__)
    // console.log(link.username)

    document.body.removeChild(link);
    URL.revokeObjectURL(url)
  }

  get_extension(){
    return Options.save_file_extension
  }

  get_url(data){
    const blob    = new Blob(
      [JSON.stringify(data, null, '  ')],
      {type: 'application\/json'}
    )
    return URL.createObjectURL(blob)
  }
  make_link(url , filename){
    const link    = document.createElement('a')
    link.href     = url
    link.download = filename
    link.style.display = 'none'
    return link
  }

  get_filename(){
    if(Options.load_filename){
      return Options.load_filename
    }
    else{
      return (+new Date())
    }
  }
}