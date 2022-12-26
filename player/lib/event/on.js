
/**
 * animation実行時に各種イベントを発火する処理
 * 
 */

export class On{
  constructor(){

  }

  // animation開始タイミング
  start(options , datas){
    if(options
      && options.event 
      && options.event.end){
        options.event.start(datas.animation_name , options , datas)
      }
  }

  // アニメーション終了タイミング
  // count設定に数値がされている場合
  end(options , datas){
    if(options
    && options.event 
    && options.event.end){
      options.event.end(datas.animation_name , options , datas)
    }
  }

  // countにinifiniteが設定されている場合のloopタイミング
  loop(options , datas){
    if(options
      && options.event 
      && options.event.end){
        options.event.loop(datas.animation_name , options , datas)
      }
  }

  // 任意フラグのタイミング（keyframで設定されているフラグ設定）
  flag(id){

  }
}