import { Player } from '../../player.js'
import { Urlinfo } from './urlinfo.js'

// データからアニメーション設定の初期化
const chara_sample = new Player({
  // files : [
  //   'data/pepa-front-sit.ima',
  //   'data/pepa-front-idea.ima',
  //   'data/pepa-front-paper.ima',
  //   'data/pepa-front-pickup.ima',
  //   'data/pepa-front-stand.ima',
  // ],
  // files : [
  //   'data/box1-rotate.ima',
  // ],
  // files : [
  //   'data/box3-rotate.ima',
  //   'data/box3-shape.ima',
  // ],
  files : [
    'data/pepa-front-sound-sit.ima',
  ],
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

function get_file(default_file){
  const urlinfo = new Urlinfo()
  if(urlinfo.query && urlinfo.query.file){
    return urlinfo.query.file
  }
  else{
    return default_file
  }
}




