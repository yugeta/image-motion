import { Options } from './options.js'

export class Common{

  // 任意文字列の中から、{{key}}という文字列を、{key:val}で置換する処理
  doubleBlancketConvert = function(str , data){
    if(data){
      const reg = new RegExp('{{(.*?)}}','g')
      const arr = []
      let res = []
      while ((res = reg.exec(str)) !== null) {
        arr.push(res[1])
      }
      for(let key of arr){
        const val = typeof data[key] !== 'undefined' ? data[key] : ''
        str = str.split('{{'+String(key)+'}}').join(val)
      }
    }
    return str
  }

  // 上位階層をselectorで選択する機能
  upper_selector(elm , selectors){
    if(!elm || !selectors){return}
    selectors = typeof selectors === "object" ? selectors : [selectors]
    if(!elm || !selectors){return}
    let cur, flg = null
    for(let i=0; i<selectors.length; i++){
      if(!selectors[i]){continue}
      for(cur=elm; cur; cur=cur.parentElement) {
        if(!cur.matches(selectors[i])){continue}
        flg = true
        break
      }
      if(flg){break}
    }
    return cur
  }

  get_data(uuid){
    return Options.sounds.find(d => d.uuid === uuid)
  }
  set_data(){

  }
}