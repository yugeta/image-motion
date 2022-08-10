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
    // margin   : ["10px","10px","10px","10px"],   // [上、右、下、左]
  },
  offset  : {x:0,y:0},
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