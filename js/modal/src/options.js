export const Options = {
  name : 'modal_api',

  // 表示サイズ
  size    : {
    width : "500px",
    height: "auto",
  },
  // 表示位置
  position : {
    vertical : "top",     // 縦 [top , *center(*画像などがある場合はサイズ指定してから使用すること) , bottom]
    horizon  : "center",  // 横 [left , *center , right]
  },
  speed    : "0.5s",  // 表示速度
  offset  : {x:"0px",y:"0px"},  // 表示位置の調整
  
  // 閉じるボタン
  close   : {
    html  : "",
    size  : 20,
    click : function(){},
  },
  // [上段] タイトル表示文字列
  title   : "Title",
  // [中断] メッセージ表示スタイル
  message : {
    html   : "Message",
    height : "auto",
    align  : "left",
  },
  // [下段] ボタン
  button  : [
    {
      mode:"close",
      text:"Click",
      click : function(){}
    }
  ],
  // クリック挙動 [ "close" , "none" ]
  bgClick : "close",

  // modal表示後の実行function
  loaded : function(){},
  closed : function(){},
};