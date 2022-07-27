import { Options  }  from '../options.js'

export class Common{

  // // 上位階層をselectorで選択する機能
  // upper_selector(elm , selectors){
  //   if(!selectors){return}
  //   selectors = typeof selectors === "object" ? selectors : [selectors]
  //   if(!elm || !selectors){return}
  //   let cur, flg = null
  //   for(let i=0; i<selectors.length; i++){
  //     if(!selectors[i]){continue}
  //     for(cur=elm; cur; cur=cur.parentElement) {
  //       if(!cur.matches(selectors[i])){continue}
  //       flg = true
  //       break
  //     }
  //     if(flg){break}
  //   }
  //   return cur
  // }

  // ハッシュリンクの値を取得 : (upload / animation)
  get_hash(){
    const hash = location.hash
    return hash.replace(/^#/ , '')
  }
  set_hash(hash){console.log(hash)
    const url = location.href.split('#')[0]
    document.body.setAttribute('data-hash' , hash)
    location.href = url +'#'+ hash
  }

  // ページ内の.template > data-nameを取得する
  get_template(name){
    // if(!Options.templates[name]){
    //   const target = document.querySelector(`.template [data-name='${name}']`)
    //   // html内チェック
    //   if(target){
    //     if(target.tagName === 'TEXTAREA'){
    //       Options.templates[name] = target.value
    //     }
    //     else{
    //       Options.templates[name] = target.innerHTML
    //     }
    //   }
    //   // ajax-load
    //   else{
    //     const path = `template/${name}.html`
    //     // console.log(path)
    //     // Options.templates[name] = ''
    //     new Promise( resolve => {
    //       Options.templates[name] = new Ajax({
    //         url    : path,
    //         method : 'get',
    //         // type   : 'txt',
    //         // headers : {
    //         //   'Content-Type': 'application/json'
    //         //   // 'Content-Type': 'application/x-www-form-urlencoded',
    //         // },
    //         callback : ((e)=>{
    //           // console.log(e)
    //           resolve(e.target.resolve)
    //         }).bind(this)
    //       })
    //     })
    //   }
    // }
    return Options.templates[name]
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

  // range : 0.0 - 1.0
  get_scale(){
    let scale = document.querySelector(`input[type='range'][name='scale']`).value
    return Number(scale) * 0.01
  }

  // filePath -> name
  get_file2name(filepath){
    if(!filepath){return ''}
    const sp = filepath.split('.')
    return sp.slice(0 , sp.length-1).join('.')
  }

  // 任意要素内で、任意エレメントの、座標を取得
  get_pos(elm , root){
		if(!elm){return null}
    root = root || document.body
		var pos={
      x:0,
      y:0,
    }
		do{
			//指定エレメントでストップする。
			if(elm === root){break}

			//対象エレメントが存在しない場合はその辞典で終了
			if(typeof elm === 'undefined' || elm === null){
        break
        // return pos
      }

			//座標を足し込む
			pos.x += elm.offsetLeft
			pos.y += elm.offsetTop
		}

		//上位エレメントを参照する
		while(elm = elm.offsetParent)

		//最終座標を返す
		return pos;
  }

}
