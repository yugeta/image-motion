import { Options } from '../options.js'
import { Modal }   from '../modal/src/modal.js'

export class About{
  constructor(){
    new Modal({
      // 表示サイズ
      size    : {
        width : "500px",
        height: "auto"
      },
      // 表示位置
      position : {
        vertical : "center",     // 縦 [top , *center(*画像などがある場合はサイズ指定してから使用すること) , bottom]
        horizon  : "center",  // 横 [left , *center , right]
      },
      // 閉じるボタン
      close   : {
        html  : "",
        size  : '20px',
        click : ()=>{}
      },
      // [上段] タイトル表示文字列
      title   : "About",
      // [中断] メッセージ表示スタイル
      message : {
        html   : this.get_message(),
        height : "auto",
        align  : "center",
        padding : '20px',
      },
      // [下段] ボタン
      button  : [
        {
          mode:"close",
          text:"Click",
          click : ()=>{}
        }
      ],
      // クリック挙動 [ "close" , "none" ]
      background_click : "close"
    })
  }

  get_message(){
    const version = {
      main : Options.versions.main,
      sub  : Options.versions.sub,
      revision : Options.versions.revision
    }
    return `version ${version.main}.${version.sub}.${version.revision}`
  }
}