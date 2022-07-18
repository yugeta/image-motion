import { Options }       from '../options.js'
import * as ActionCommon from './common.js'

export function resize(e){
  set_cursor_num2pos()
  set_points_resize()
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
}

export function mousemove(e){
  if(Options.timeline_cursor){
    move_timeline_cursor(e)
  }
}

export function mouseup(e){
  if(Options.timeline_cursor){
    end_timeline_cursor(e)
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
  const mouse = {
    x : ~~(e.pageX),
    y : ~~(e.pageY),
  }
  const rect = cursor.getBoundingClientRect()
  Options.timeline_cursor = true
  move_timeline_cursor(e)
  set_cover()
  if(Options.animation){
    Options.animation.change_timeline()
  }
}

function move_timeline_cursor(e){
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
  const num    = Math.round(posx / rate)
  const cursor = Options.elements.get_timeline_cursor()
  cursor.setAttribute('data-num' , num)
  const left   = ~~(num * rate)
  cursor.style.setProperty('left', `${left}px`,'')
  if(Options.animation){
    Options.animation.change_timeline()
  }
  
  Options.play.transform_img_all()
}

function end_timeline_cursor(e){
  delete Options.timeline_cursor
  del_cover()
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
}

function set_cursor_num2pos(){
  const cursor = Options.elements.get_timeline_cursor()
  ActionCommon.set_timeline_num2pos(cursor)
}

function set_points_resize(){
  const lists = Options.elements.get_timeline_lists()
  if(!lists){return}
  const points = lists.querySelectorAll('.point')
  if(!points || !points.length){return}
  for(let point of points){
    // set_point_num2pos(point)
    ActionCommon.set_timeline_num2pos(point)
  }
}

// ----------
// Timeline-Animation

function per_animation(per){

}


