import { Player } from '../../player.js'

// データからアニメーション設定の初期化
const chara_sample = new Player({
  // file     : './data/pepa-front.20220904a.json', // データファイルのパス（読み込み元ファイル[*html]からの相対パス）
  file     : './data/sound.json', // データファイルのパス（読み込み元ファイル[*html]からの相対パス）
  selector : '#chara_sample',     // キャラクター画像をloadする要素の指定
  callback : (e)=>{ // データ設定完了後のcallback処理
    set_animations(e)
  }
})

function set_animations(e){
  const animation_names = e.animation.animation_names
  const target_select = document.querySelector('select.animations')
  for(let i=0; i<animation_names.length; i++){
    const option = new Option(animation_names[i] , animation_names[i])
    target_select.options[target_select.options.length] = option
  }
  target_select.addEventListener('change' , change_animation)
}
function change_animation(e){
  const animation_name = e.target.value || ''
  const target_chara = document.getElementById('chara_sample')
  chara_sample.action(animation_name)
}
