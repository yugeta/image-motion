import { Options }  from '../options.js'

export class Save{
  constructor(){
    const data = Options.datas.get_save_data()
    this.download(data)
  }
  
  download(data){
    const url  = this.get_url(data)
    const link = this.make_link(url , 'test.json')
    link.click()
    URL.revokeObjectURL(url)
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
    return link
  }
}