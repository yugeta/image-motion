import { Options }      from '../options.js'
import * as ActionEvent from '../action/event.js'
import * as ImageCommon from '../images/common.js'
import * as ShapeCommon from '../shape/common.js'
import { Play }         from '../action/play.js'
import { Modal }        from '../modal/src/modal.js'
import { SoundKey }     from '../action/sound_key.js'
import { Shape }        from '../shape/shape.js'

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

// animation-name-listが表示されている時に、別の場所をクリックしたら、リストを閉じる処理
export function animation_name_list_other_click(e){
  if(!Options.elements.upper_selector(e.target , `[name='animation'] .input`)){
    animation_name_list_hidden()
  }
}

// contextmenuが表示されている時に、別の場所をクリックしたら、リストを閉じる処理
export function contextmenu_other_click(e){
  if(!Options.elements.upper_selector(e.target , `.contextmenu`) && Options.contextmenu){
    Options.contextmenu.close()
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
  Options.event.set(
    lists,
    'click',
    click_animation_name.bind(this)
  )
}

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

export function set_animation_name(value) {
  const input = Options.elements.get_animation_name_list_input()
  if (!input) { return }
  input.value = value
}
export function get_animation_name() {
  const input = Options.elements.get_animation_name_list_input()
  if (!input) { return }
  return input.value
}

// animation-nameの切り替え処理
export function animation_name_list_decide(){
  animation_name_list_hidden()

  // header情報の初期設定
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
    Options.datas.add_animation(name)
  }

  // 切り替え後一度transformをクリアする(shapeもクリアする)
  ImageCommon.reset_style()

  // view表示
  Options.current_per = null
  Options.play.transform_img_all()

  // .contentsにフラグ設置
  const root = Options.elements.get_root()
  root.setAttribute('data-animation-name' , name)

  // picが選択されている場合、選択モードに突入
  const active = Options.elements.get_pic_current_select()
  if(active){
    const uuid = active.getAttribute('data-uuid')
    ImageCommon.img_select(uuid)
  }

  // animation設定値の反映
  if(Options.animation){
    Options.animation.change_timeline()
  }
}

// export function get_animation_data(){
//   // const animation_lists = Options.elements.get_
// }

export function set_default_setting() {
  // 値をリセット
  timeline_header_reset()

  const data = Options.datas.get_animations()
  const name = get_animation_name()
  if(!data || !name || !data[name]){return}

  const area = Options.elements.get_timeline_header()

  const elm_duration = area.querySelector(`[name='duration']`)
  elm_duration.value = data[name].duration || 1

  const elm_count = area.querySelector(`[name='count']`)
  elm_count.value = data[name].count || 'infinite'

  const elm_timing = area.querySelector(`[name='timing']`)
  elm_timing.value = data[name].timing || 'linear'//'ease-in-out'

  const elm_direction = area.querySelector(`[name='direction']`)
  elm_direction.value = data[name].direction || 'normal'
}



export function hidden(){

}


export function get_frame_rate(){
  const frame = Options.elements.get_timeline_frame()
  return frame.offsetWidth / 100
}

export function set_timeline_per2pos(target){
  const rate = target.parentNode.offsetWidth / 100
  const num  = Number(target.getAttribute('data-num') || 0)
  const posx = ~~(num * rate)
  target.style.setProperty('left',`${posx}px`,'')
}
export function set_timeline_pos2per(target , x){
  const parent = Options.elements.upper_selector(target , `[name='timeline'] .lists > li`)
  if(!parent){return}
  const rate = parent.offsetWidth / 100
  const rect = parent.getBoundingClientRect()
  const posx = x - rect.left
  const per = Math.round(posx / rate)
  if(per < 0){
    return 0
  }
  else if(per > 100){
    return 100
  }
  return per
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
    // on -> off
    case 'on':
      target.setAttribute(key , '')
      Options.play.stop()
      Options.sound_play.all_pause()
      break
    // off -> on
    default:
      target.setAttribute(key , 'on')
      Options.current_per = null
      const duration = get_duration()
      Options.play.flg_duration = duration / 100 * 1000
      Options.play.play()
      Options.sound_play.all_play()
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
  const inputs   = area.querySelectorAll(`input[data-mode='input']`)
  for(let input of inputs){
    const type   = input.getAttribute('name')
    const value  = Options.datas.get_animation_name_data_between(name , uuid , per , type)
    if(value === null){continue}
    input.value  = value
    const parent = Options.elements.upper_selector(input , `li > .${type}`)
    const range  = parent.querySelector(`input[data-mode='range']`)
    range.value  = value
  }
}

// view情報から、animation値の値を取得
export function set_type_value_of_view(name , uuid , type , per , data){
  switch(type){
    case 'shape':
      const shape_value = data !== undefined ? data : ShapeCommon.get_current_per_data(name , uuid , type , per)
      Options.datas.set_animation_data_value(name , uuid , per , type , shape_value)
      break
    
    case 'opacity':
      const opacity_input = Options.elements.get_animation_lists_input_type(type)
      if(!opacity_input){return}
      const opacity_value = data !== undefined ? data : Number(opacity_input.value || 1)
      Options.datas.set_animation_data_value(name , uuid , per , type , opacity_value)
      break

    case 'sound':
      Options.datas.set_animation_data_value(name , uuid , per , type , null)
      Options.sound_key = new SoundKey({
        test : 'action/common',
        name : name , 
        uuid : uuid , 
        per  : per ,
      })
        
      break

    // rotate , posx , posy , posz
    default:
      const animation_input = Options.elements.get_animation_lists_input_type(type)
      if(!animation_input){return}
      const value = data !== undefined ? data : Number(animation_input.value || 0)
      Options.datas.set_animation_data_value(name , uuid , per , type , value)
      break
  }
}
export function get_type_value_of_view(name , uuid , type , per){
  switch(type){
    case 'shape':
      return ShapeCommon.get_current_per_data(name , uuid , type , per)

    // rotate , posx , posy , posz
    default:
      // return Options.datas.
  }
}


export function click_animation_name_list_add(){
  Options.cache_modal = new Modal({
    // 表示サイズ
    size    : {
      width : "500px",
      height: "auto"
    },
    // 表示位置
    position : {
      vertical : "top",     // 縦 [top , *center(*画像などがある場合はサイズ指定してから使用すること) , bottom]
      horizon  : "center",  // 横 [left , *center , right]
      
    },
    offset:{
      x : '0px',
      y : '100px',
    },
    speed : "0.3s",
    
    // [上段] タイトル表示文字列
    title   : "Animation add",
    // [中断] メッセージ表示スタイル
    message : {
      html    : Options.common.get_template('animation_name_modal'),
      height  : "auto",
      align   : "center",
      padding : "0px",
    },
    // [下段] ボタン
    button  : [
      {
        mode:"close",
        text:"Cancel"
      },
      {
        mode:"",
        text:"Add",
        click : animation_name_list_add
      }
    ],
    // クリック挙動 [ "close" ]
    background_click : "",
    loaded : ()=>{
      const input = document.querySelector('.modal-message-contents input,.modal-message-contents textarea')
      if(input){
        input.focus()
      }
    }
  })
}
export function animation_name_list_add(){
  const input_elm = document.querySelector('.animation-name-modal input')
  if(!input_elm){return}
  const animation_name = input_elm.value

  // 登録済みの場合はエラー
  if(get_data(animation_name)){
    document.querySelector('.animation-name-modal .error').innerHTML = 'already used'
    return
  }

  set_animation_name(animation_name)
  animation_name_list_decide()

  // modal close
  Options.cache_modal.close()
  delete Options.cache_modal
}


export function click_animation_name_list_edit(){
  const animation_name = get_animation_name()
  if(!animation_name){return}
  Options.cache_modal = new Modal({
    // 表示サイズ
    size    : {
      width : "500px",
      height: "auto"
    },
    // 表示位置
    position : {
      vertical : "top",     // 縦 [top , *center(*画像などがある場合はサイズ指定してから使用すること) , bottom]
      horizon  : "center",  // 横 [left , *center , right]
      
    },
    offset:{
      x : '0px',
      y : '100px',
    },
    speed : "0.3s",
    
    // [上段] タイトル表示文字列
    title   : "Animation edit",
    // [中断] メッセージ表示スタイル
    message : {
      html    : Options.common.get_template('animation_name_modal'),
      height  : "auto",
      align   : "center",
      padding : "0px",
    },
    // [下段] ボタン
    button  : [
      {
        mode:"close",
        text:"Cancel"
      },
      {
        mode:"",
        text:"Edit",
        click : animation_name_list_edit
      }
    ],
    // クリック挙動 [ "close" ]
    background_click : "",
    loaded : ()=>{
      const input = document.querySelector('.modal-message-contents input,.modal-message-contents textarea')
      if(input){
        const name = get_animation_name()
        input.value = name
        input.focus()
      }
    }
  })
}
export function animation_name_list_edit(){
  const input_elm = document.querySelector('.animation-name-modal input')
  if(!input_elm){return}
  const new_animation_name = input_elm.value

  const current_animation_name = get_animation_name()

  // 変更なし
  if(!new_animation_name
  || new_animation_name === current_animation_name){return}

  // 登録済みの場合はエラー
  if(get_data(new_animation_name)){
    document.querySelector('.animation-name-modal .error').innerHTML = 'already used'
    return
  }

  set_animation_name(new_animation_name)
  change_animation_key(current_animation_name , new_animation_name)
  // animation_name_list_decide()

  // modal close
  Options.cache_modal.close()
  delete Options.cache_modal
}
function change_animation_key(old_key , new_key){
  const datas = get_datas()
  datas[new_key] = datas[old_key]
  delete datas[old_key]
}

export function click_animation_name_list_copy(){
  const animation_name = get_animation_name()
  if(!animation_name){return}
  Options.cache_modal = new Modal({
    // 表示サイズ
    size    : {
      width : "500px",
      height: "auto"
    },
    // 表示位置
    position : {
      vertical : "top",     // 縦 [top , *center(*画像などがある場合はサイズ指定してから使用すること) , bottom]
      horizon  : "center",  // 横 [left , *center , right]
      
    },
    offset:{
      x : '0px',
      y : '100px',
    },
    speed : "0.3s",
    
    // [上段] タイトル表示文字列
    title   : "Animation copy",
    // [中断] メッセージ表示スタイル
    message : {
      html    : Options.common.get_template('animation_name_modal'),
      height  : "auto",
      align   : "center",
      padding : "0px",
    },
    // [下段] ボタン
    button  : [
      {
        mode:"close",
        text:"Cancel"
      },
      {
        mode:"",
        text:"Copy",
        click : animation_name_list_copy
      }
    ],
    // クリック挙動 [ "close" ]
    background_click : "",
    loaded : ()=>{
      const input = document.querySelector('.modal-message-contents input,.modal-message-contents textarea')
      if(input){
        const name = get_animation_name()
        input.value = name
        input.focus()
      }
    }
  })
}
export function animation_name_list_copy(){
  const input_elm = document.querySelector('.animation-name-modal input')
  if(!input_elm){return}
  const new_animation_name = input_elm.value

  const current_animation_name = get_animation_name()

  // 変更なし
  if(!new_animation_name
  || new_animation_name === current_animation_name){return}

  // 登録済みの場合はエラー
  if(get_data(new_animation_name)){
    document.querySelector('.animation-name-modal .error').innerHTML = 'already used'
    return
  }

  set_animation_name(new_animation_name)
  copy_animation_data(current_animation_name , new_animation_name)
  // animation_name_list_decide()

  // modal close
  Options.cache_modal.close()
  delete Options.cache_modal
}
function copy_animation_data(old_key , new_key){
  const datas = get_datas()
  datas[new_key] = JSON.parse(JSON.stringify(datas[old_key]))
}

// animation-name-listの削除処理
export function click_animation_name_list_trash(){
  const animation_name = get_animation_name()
  if(!animation_name){return}
  const input = Options.elements.get_animation_name_list_input()
  if(!input){return}
  if(!confirm('アニメーションデータを削除してもよろしいですか？')){return}

  // データ削除
  Options.datas.remove_animation_data(animation_name)

  // 表示処理
  input.value = ''
  animation_name_list_decide()
}


// ----------
// timeline-header

// headerの値をリセットする。
export function timeline_header_reset(){
  const timeline_header = Options.elements.get_timeline_header()
    const duration = timeline_header.querySelector(`input[name='duration']`)
    const count    = timeline_header.querySelector(`input[name='count']`)
    const timing   = timeline_header.querySelector(`select[name='timing']`)
    duration.value = duration.getAttribute('value')
    count.value    = count.getAttribute('value')
    timing.value   = timing.options[0].value
  }

// duration値の変更
export function timeline_duration(e){
  const animation_name = get_animation_name()
  if(!animation_name){return}
  const value = Number(e.target.value || 1)
  Options.datas.set_animation_header(animation_name , 'duration' , value)
}

// count値の変更
export function timeline_count(e){
  if(e.target.value === ''){
    e.target.value = e.target.getAttribute('value')
    return
  }
  const animation_name = get_animation_name()
  if(!animation_name){return}
  const value = e.target.value.match(/^\d.+?$/) ? Number(e.target.value) : e.target.value
  Options.datas.set_animation_header(animation_name , 'count' , value)
}

// timing値の変更
export function timeline_timing(e){
  const animation_name = get_animation_name()
  if(!animation_name){return}
  const value = e.target.value
  Options.datas.set_animation_header(animation_name , 'timing' , value)
}

// // アニメーションデータが変更になった場合に、timelineデータ（表示）の再構築をする処理
// export function timeline_remake(){

// }

export function is_point(name , uuid , type , per){
  const datas = Options.datas.get_animation_per_datas(name , uuid , per)
  if(!datas || typeof datas[type] === 'undefined'){
    return false
  }
  else{
    return true
  }
}

// mode切り替えの時にanimation-nameが選択されている場合はclearする
export function animation_name_clear(){
  const animation_name = get_animation_name()
  if(!animation_name){return}
  const input = Options.elements.get_animation_name_list_input()
  input.value = ''
}


