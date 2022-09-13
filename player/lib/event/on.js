
/**
 * animation実行時に各種イベントを発火する処理
 * 
 */

export class On{
  constructor(){

  }

  // animation開始タイミング
  start(options , datas){
    // console.log('start' , options , datas)

  }

  // アニメーション終了タイミング
  // count設定に数値がされている場合
  end(options , datas){
    // console.log('end' , options , datas)
    
  }

  // countにinifiniteが設定されている場合のloopタイミング
  loop(options , datas){
    // console.log('loop' , options , datas)

  }

  // 任意フラグのタイミング（keyframで設定されているフラグ設定）
  flag(id){

  }
}