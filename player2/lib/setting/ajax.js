
export class Ajax{
  constructor(options){
    this.options = options || {}
    const query = options.query ? Object.entries(options.query).map((e)=>`${e[0]}=${e[1]}`).join('&') : ''
    this.xhr = new XMLHttpRequest()
    this.xhr.open(options.method || 'get' , options.url || getApiUrl() , true)
    this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    this.sync(query)
  }
  
  // 非同期の返り値を同期的にも取得する
  async sync(query){
    return new Promise(((resolve) =>{
      this.xhr.onload = (res) => {
        resolve(res.target.response)
        if(this.options.callback){
          this.options.callback(res)
        }
      }
      this.xhr.send(query)
    }).bind(this))
  }
}