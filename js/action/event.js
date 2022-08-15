import { Options }       from '../options.js'
import * as ActionCommon from '../action/common.js'
import { Contextmenu }   from '../asset/contextmenu.js'
import { SoundKey }      from '../action/sound_key.js'

export function resize(e){
  set_cursor_num2pos()
  set_points_resize()
}

export function contextmenu(e , type){
  // 通常クリック処理を削除
  if(Options.timeline_cursor){
    delete Options.timeline_cursor
  }
  if(Options.move_key_point){
    delete Options.move_key_point
  }

  Options.contextmenu = new Contextmenu({
    type  : type ,
    x     : e.pageX,
    y     : e.pageY,
    event : e
  })

  // カーソル移動
  if(Options.contextmenu.status){
    move_timeline_cursor(e)
  }
}
export function mousedown(e){
  
  switch(start_check(e)){
    case 'cursor':
      set_timeline_cursor(e)
      break
    case 'timeline-lists':
      click_timeline_lists(e)
      break
  }
  ActionCommon.animation_name_list_other_click(e)
  ActionCommon.contextmenu_other_click(e)
}

export function mousemove(e){
  if(Options.timeline_cursor){
    move_timeline_cursor(e)
    Options.play.transform_img_all()
    change_timeline()
    new SoundKey().all_stop()
  }
  drag_move_key_point(e)
}

export function mouseup(e){
  end_timeline_cursor(e)
  end_move_key_point(e)
}

function change_timeline(){
  if(Options.animation){
    Options.animation.change_timeline()
  }
}

// ----------
// Cursor

function start_check(e){
  const timeline_frame = Options.elements.upper_selector(e.target , `[name='timeline'] .timeline`)
  if(timeline_frame){
    return 'cursor'
  }
  const timeline_lists = Options.elements.upper_selector(e.target , `[name='timeline'] .lists`)
  if(timeline_lists){
    return 'timeline-lists'
  }
}

function set_timeline_cursor(e){
  const cursor = Options.elements.get_timeline_cursor()
  Options.timeline_cursor = true
  move_timeline_cursor(e)
  Options.play.transform_img_all()
  change_timeline()

  const under = Options.elements.get_under()
  under.setAttribute('data-status' , 'drag')
}

export function move_timeline_cursor(e){
  const frame  = Options.elements.get_timeline_frame()
  const rect   = frame.getBoundingClientRect()
  const max    = rect.width
  let   posx   = e.pageX - rect.left
  if(posx < 0){
    posx = 0
  }
  else if(posx >= max){
    posx = max
  }
  const rate   = ActionCommon.get_frame_rate()
  const per    = Math.round(posx / rate)
  const cursor = Options.elements.get_timeline_cursor()
  cursor.setAttribute('data-num' , per)
  const left   = ~~(per * rate)
  cursor.style.setProperty('left', `${left}px`,'')
  Options.play.timeline_key_point_current(per)
}

function end_timeline_cursor(e){
  if(!Options.timeline_cursor){return}
  delete Options.timeline_cursor
  // del_cover()

  // 選択防止処理の終了
  const under = Options.elements.get_under()
  if(under && under.hasAttribute('data-status')){
    under.removeAttribute('data-status')
  }
}

// 他エリアの文字選択を防ぐ処理
function set_cover(){
  const cover = document.createElement('div')
  cover.className = 'timeline-cover'
  cover.style.setProperty('position','absolute','')
  cover.style.setProperty('top','0','')
  cover.style.setProperty('left','0','')
  cover.style.setProperty('width','100%','')
  cover.style.setProperty('height','100%','')
  document.body.appendChild(cover)
}

function del_cover(){
  const cover = document.querySelector('.timeline-cover')
  if(!cover){return}
  cover.parentNode.removeChild(cover)
}

// ----------
// Lists

function click_timeline_lists(e){
  if(Options.timeline){
    Options.timeline.click(e)
  }
  const point = Options.elements.upper_selector(e.target , '.point')
  if(point){
    const parent = Options.elements.upper_selector(e.target , `[name='timeline'] .lists > li`)
    if(!parent){return}
    const type   = parent.getAttribute('class')
    const name   = Options.timeline.name
    const uuid   = Options.timeline.uuid
    // const per    = ActionCommon.get_timeline_per()
    const per    = ActionCommon.set_timeline_pos2per(e.target , e.pageX)
    const value  = Options.datas.get_animation_name_data(name , uuid , per , type)
    Options.move_key_point = {
      point  : point,
      per    : per,
      mouse  : {
        x    : e.pageX,
        y    : e.pageY,
      },
      type   : type,
      name   : name,
      uuid   : uuid,
      value  : value,
      parent : parent , 
      rate   : parent.offsetWidth / 100,
      rect   : parent.getBoundingClientRect(),
    }
    const under = Options.elements.get_under()
    under.setAttribute('data-status' , 'drag')
  }
}

function drag_move_key_point(e){
  if(!Options.move_key_point){return}
  const posx = e.pageX - Options.move_key_point.rect.left
  // console.log(posx)
  let   per  = Math.round(posx / Options.move_key_point.rate)
  if(per < 0){
    per = 0
  }
  else if(per > 100){
    per = 100
  }
  // 同じ位置の場合は処理しない
  if(Options.move_key_point.per === per){return}
  // 別のkey-pointがある場合は処理しない（カブさない）
  const res = Options.datas.get_animation_name_data(
    Options.move_key_point.name,
    Options.move_key_point.uuid,
    per,
    Options.move_key_point.type,
  )
  if(typeof res === 'number'){return}

  set_move_key_point(per)
}
function set_move_key_point(per){
  // point移動
  const target = Options.move_key_point.point
  const rate   = Options.move_key_point.rate
  const posx   = ~~(per * rate)
  target.style.setProperty('left',`${posx}px`,'')
  target.setAttribute('data-num' , per)

  // 保存用データ更新
  Options.datas.set_animation_data_move(
    Options.move_key_point.name,
    Options.move_key_point.uuid,
    Options.move_key_point.type,
    Options.move_key_point.per,
    per,
  )

  // キャッシュデータ更新
  Options.move_key_point.per = per
  // console.log(Options.animations)

  // viewアニメーション更新
  // console.log('--5')
  Options.play.transform_img_all()

  // animation値の更新
  change_timeline()

  // 選択防止処理の終了
  const under = Options.elements.get_under()
  if(under && under.hasAttribute('data-status')){
    under.removeAttribute('data-status')
  }
}


function end_move_key_point(e){
  if(!Options.move_key_point){return}
  delete Options.move_key_point
}

function set_cursor_num2pos(){
  const cursor = Options.elements.get_timeline_cursor()
  ActionCommon.set_timeline_per2pos(cursor)
}

function set_points_resize(){
  const points = Options.elements.get_timeline_lists_points()
  // if(!lists){return}
  // const points = lists.querySelectorAll('.point')
  if(!points || !points.length){return}
  for(let point of points){
    // set_point_num2pos(point)
    ActionCommon.set_timeline_per2pos(point)
  }
}

// ----------
// Timeline-Animation

function per_animation(per){

}


