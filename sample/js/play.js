import { Main } from '../../play/main.js'

// データからアニメーション設定の初期化
const chara_sample = new Main({
  file     : './sample5-d.json',  // データファイルのパス（読み込み元ファイル[*html]からの相対パス）
  target   : '#chara_sample',     // キャラクター画像をloadする要素の指定
  name     : 'sample',            // キャラクター名(必須 : ユニーク値)
})


// サンプルボタンイベントの設定
set_event()
function set_event(){
  const elms = document.querySelectorAll('button')
  for(let elm of elms){
      elm.addEventListener('click' , (e)=>{
        const name = e.target.className
        // chara_sample.elm.setAttribute('data-action' , name)
        chara_sample.action(name)
      })
  }
//   const standard = document.querySelector('button.standard')
//   if(standard){
//     standard.addEventListener('click' , ()=>{
//       chara_sample.elm.setAttribute('data-action' , 'standard')
//     })
//   }
// 
//   const walk = document.querySelector('button.walk')
//   if(walk){
//     walk.addEventListener('click' , ()=>{
//       chara_sample.elm.setAttribute('data-action' , 'walk')
//     })
//   }
}