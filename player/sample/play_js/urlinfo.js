
export class Urlinfo{

  constructor(uri){
    this.uri = uri || location.href
    this.url = this.setUrl()
    this.setDomain()
    this.setHash()
    this.setQuery()
    this.setFilename()
  }

  setUrl(){
    if(this.uri.indexOf("?")!=-1){
      return this.uri.split("?")[0]
    }
    else if(this.uri.indexOf(";")!=-1){
      return this.uri.split(";")[0]
    }
    else{
      return this.uri
    }
  }
  setDomain(){
    const sp = this.uri.split('/')
    if(!sp[2]){return null}
    this.hostname = sp[2]
    const sp2 = sp[2].split(':')
    if(this.uri.match(/^http:\/\//)){
      this.port = sp2[1] || 80
      this.protocol = 'http'
    }
    else if(this.uri.match(/^https:\/\//)){
      this.port = sp2[1] || 443
      this.protocol = 'https'
    }
    this.domain = sp2[0]
  }
  setHash(){
    if(!this.uri || this.uri.indexOf('#')==-1){return null}
    const sp = this.uri.split('#')
    this.hash = sp.slice(1)
  }
  setQuery(){
    let query = this.getQueryString(this.uri)
    if(!query){return null}
    const querys = query.split("&")
    const newDatas = {}
    for(var i=0;i<querys.length;i++){
      var sp = querys[i].split("=")
      if(!sp[0]){continue}
      newDatas[sp[0]]=sp[1]
    }
    this.query = newDatas
  }
  getQueryString(){
    if(!this.uri){return null}
    const uri_query = this.uri.split('#')[0]
    if(uri_query.indexOf("?")!=-1){return uri_query.split("?")[1]}
    if(uri_query.indexOf(";")!=-1){return uri_query.split(";")[1]}
    return null
  }
  setFilename(){
    const sp = this.url.split('/')
    this.basename = sp[sp.length-1]
    this.path = this.domain ? sp.slice(3,sp.length-1).join('/') : sp.slice(0,sp.length-1).join('/')
    this.setName(this.basename)
  }
  
  setName(basename){
    if(!basename){return null}
    const sp = basename.split('.')
    if(sp.length <= 1){return null}
    this.filename = sp.slice(0,sp.length-1).join('.')
    this.extension = sp[sp.length-1]
  }
}
