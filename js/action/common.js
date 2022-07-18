import { Options }      from '../options.js'
import * as ActionEvent from './event.js'

// ----------
// animation-name

export function animation_name_list_click(e) {
  const lists = Options.elements.get_animation_name_lists()
  // 表示
  if (!lists) {
    animation_name_list_view()
  }
  // 非表示
  else {
    animation_name_list_hidden()
  }
}

function get_datas() {
  return Options.datas.get_animations()
}
function get_data(name) {
  const animations = get_datas()
  return animations && animations[name] ? animations[name] : null
}

function animation_name_list_view() {
  const animations = get_datas()
  if (!animations) { return }
  const header = Options.elements.get_animation_header()
  const area = header.querySelector('.input')
  const base = Options.common.get_template('animation_name_lists')
  const item = Options.common.get_template('animation_name_list')
  let item_html = ''
  for (let name in animations) {
    item_html += Options.common.doubleBlancketConvert(item, { name: name })
  }

  const html = Options.common.doubleBlancketConvert(base, { items: item_html })
  area.insertAdjacentHTML('beforeend', html)
  const lists = Options.elements.get_animation_name_lists()
  // animation_name_list_view_additem(lists.querySelector(':scope > ul'))
  Options.event.set(
    lists,
    'click',
    click_animation_name.bind(this)
  )
}
// function animation_name_list_view_additem(area){
//   const add_button = document.createElement('li')
//   add_button.setAttribute('data-type' , 'add')
//   add_button.textContent = '( + add )'
//   area.appendChild(add_button)
// }

function animation_name_list_hidden() {
  const lists = Options.elements.get_animation_name_lists()
  if (!lists) { return }
  lists.parentNode.removeChild(lists)
}

function click_animation_name(e) {
  const target = Options.elements.upper_selector(e.target, '.animation_name_lists > ul > li')
  if (!target) { return }
  const name = target.textContent
  const input = Options.elements.get_animation_name_list_input()
  input.value = name
  animation_name_list_decide()
}




export function animation_name_list_input(e) {
  // console.log(e.target.value)
}


export function get_animation_name() {
  const input = Options.elements.get_animation_name_list_input()
  if (!input) { return }
  return input.value
}

export function animation_name_list_decide() {
  animation_name_list_hidden()
  set_default_setting()
  const name = get_animation_name()
  // 既存データ
  if (get_data(name)){
    if(Options.animation){
      Options.animation.change_timeline()
    }
  }
  // 新規key作成
  else{
    // console.log(Options.animation)
    const data = get_animation_data()
    Options.datas.add_animation(name , data)
  }
  // view表示
  Options.play.transform_img_all()
}

export function get_animation_data(){

}

export function set_default_setting() {
  const data = Options.datas.get_animations()
  const name = get_animation_name()
  if(!data || !name || !data[name]){return}

  const area = Options.elements.get_timeline_header()

  const elm_duration = area.querySelector(`[name='duration']`)
  elm_duration.value = data[name].duration || 1

  const elm_count = area.querySelector(`[name='count']`)
  elm_count.value = data[name].count || 'infinite'

  const elm_timing = area.querySelector(`[name='timing']`)
  elm_timing.value = data[name].timing || 'ease-in-out'

  const elm_direction = area.querySelector(`[name='direction']`)
  elm_direction.value = data[name].direction || 'normal'

  // for(let i in data[name]){
  //   if(i === 'items'){continue}
  //   set_default_value(i , data[name][i])
  // }
}

// function set_default_value(key , value){
//   const area = Options.elements.get_timeline_header()
//   const elm  = area.querySelector(`[name='${key}']`)
//   if(!elm){return}
//   elm.value = value
// }


export function hidden(){

}


export function get_frame_rate(){
  const frame = Options.elements.get_timeline_frame()
  return frame.offsetWidth / 100
}

export function set_timeline_num2pos(target){
  const rate = target.parentNode.offsetWidth / 100
  const num  = Number(target.getAttribute('data-num') || 0)
  const posx = ~~(num * rate)
  target.style.setProperty('left',`${posx}px`,'')
}

export function get_timeline_per(){
  const frame = Options.elements.get_timeline_cursor()
  return Number(frame.getAttribute('data-num') || 0)
}



export function set_tools(){
  const area = Options.elements.get_animation_tools()
  area.innerHTML = Options.common.get_template('animation_header_tools')
  ActionEvent.set_tools_event()
}

export function get_duration(){
  const input = Options.elements.get_duration_input()
  return Number(input.value || 0)
}

export function click_play(e){
  const key = 'data-status'
  const target = e.currentTarget
  switch(target.getAttribute(key)){
    case 'on':
      target.setAttribute(key , '')
      Options.play.stop()
      break
    default:
      target.setAttribute(key , 'on')
      const duration = get_duration()
      Options.play.flg_duration = duration / 100 * 1000
      Options.play.play()
      break
  }
}

export function click_stop(){
  console.log("stop")
}
export function click_prev(){
  Options.play.set_timeline_per(0)
}
export function click_next(){
  Options.play.set_timeline_per(100)
}



export function set_current_num(name , uuid){
  const per      = get_timeline_per()
  const area     = Options.elements.get_animation_lists()
  const inputs   = area.querySelectorAll(`input[type='text']`)
  for(let input of inputs){
    const type   = input.getAttribute('name')
    const value  = Options.datas.get_animation_name_data_between(name , uuid , per , type)
    if(value === null){continue}
    input.value  = value
    const parent = Options.elements.upper_selector(input , `li > .${type}`)
    const range  = parent.querySelector(`input[type='range']`)
    range.value  = value
  }
}
