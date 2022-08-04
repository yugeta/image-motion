import { Player } from '../../player/player.js'

// データからアニメーション設定の初期化
const chara_sample = new Player({
  file     : './sample5-g.json',  // データファイルのパス（読み込み元ファイル[*html]からの相対パス）
  // file     : '../../pepa-web/assets/images/characters/pepa.json',  // データファイルのパス（読み込み元ファイル[*html]からの相対パス）
  selector : '#chara_sample',     // キャラクター画像をloadする要素の指定
  // name     : 'sample',            // キャラクター名(必須 : ユニーク値)
})


// サンプルボタンイベントの設定
set_event()
function set_event(){
  const elms = document.querySelectorAll('button')
  for(let elm of elms){
      elm.addEventListener('click' , (e)=>{
        const name = e.target.className
        chara_sample.action(name)
      })
  }
}