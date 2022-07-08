

export class Common{

  upper_selector(elm , selectors){
    if(!selectors){return}
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

  // ハッシュリンクの値を取得
  get_hash(){
    const hash = location.hash
    return hash.replace(/^#/ , '')
  }

  get_template(name){
    const target = document.querySelector(`.template [data-name='${name}']`)
    if(!target){return}
    if(target.tagName === 'TEXTAREA'){
      return target.value
    }
    else{
      return target.innerHTML
    }
  }

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

  // 0.0 - 1.0
  get_scale(){
    let scale = document.querySelector(`input[type='range'][name='scale']`).value
    return Number(scale) * 0.01
  }


}
