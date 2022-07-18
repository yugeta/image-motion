
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

  // constructor(options){
  //   return this.fetch(options)
  // }

  // async fetch(options){
  //   return await fetch(options.url, {
  //     method: options.method || 'get', // *GET, POST, PUT, DELETE, etc.
  //     // mode: 'cors', // no-cors, *cors, same-origin
  //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: 'same-origin', // include, *same-origin, omit
  //     headers: options.headers || {},
  //     redirect: 'follow', // manual, *follow, error
  //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //     body: JSON.stringify(data) // 本文のデータ型は "Content-Type" ヘッダーと一致させる必要があります
  //   })
  //   // return response.json();
  // }

}