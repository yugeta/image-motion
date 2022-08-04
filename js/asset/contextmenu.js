import { Options }       from '../options.js'
import * as ActionCommon from '../action/common.js'

export class Contextmenu{
  setting = {
    className : 'contextmenu',
  }

  constructor(options){
    if(!options || !options.type){return}
    this.options = options
    this.type    = options.type
    this.root    = document.body
    this.init()
  }

  init(){
    switch(this.options.type){
      case 'timeline/point':
        this.timeline_point()
        break

      case 'timeline/lists':
        this.timeline_lists()
        break
    }
  }

  set_status(flg){
    this.status = flg
  }

  view(pos , lists){
    const div = document.createElement('div')
    div.className = this.setting.className
    this.root.appendChild(div)
    div.appendChild(lists)
    const w = div.offsetWidth
    const h = div.offsetHeight
    pos.x = (pos.x + w) <= document.documentElement.clientWidth  ? pos.x : document.documentElement.clientWidth  - w
    pos.y = (pos.y + h) <= document.documentElement.clientHeight ? pos.y : document.documentElement.clientHeight - h
    div.style.setProperty('left' , `${pos.x}px` , '')
    div.style.setProperty('top'  , `${pos.y}px` , '')
  }

  // メニュー非表示 + キャッシュデータ削除 + インスタンス削除
  close(){
    this.hidden()
    this.delete_cache()
    this.delete_instance()
  }
  // メニュー非表示
  hidden(){
    const contextmenu = Options.elements.get_contextmenu()
    if(!contextmenu){return}
    this.root.removeChild(contextmenu)
  }
  // キャッシュデータの削除
  delete_cache(){
    if(!Options.contextmenu_cache){return}
    delete Options.contextmenu_cache
  }
  // インスタンス削除
  delete_instance(){
    if(!Options.contextmenu){return}
    delete Options.contextmenu
  }
  

  timeline_lists(){
    // コピーデータがない場合は表示しない
    if(!Options.contextmenu_copy){return}

    const parent = Options.elements.upper_selector(this.options.event.target , '.lists > li')
    const type   = parent.getAttribute('class')
    const per    = ActionCommon.set_timeline_pos2per(this.options.event.target , this.options.event.pageX)

    const lists = []
    if(Options.contextmenu_copy
    && Options.contextmenu_copy.type === type){
      lists.push({key : 'paste' , value : 'paste'})
    }
    
    if(!lists.length){return}
    const menulists = this.make_lists(lists)
    const pos = {
      x : this.options.x,
      y : this.options.y,
    }
    Options.contextmenu_cache = {
      pos  : pos,
      per  : per,
      type : type,
      elm  : this.options.event.target,
    }
    this.view(pos , menulists)
    this.set_status('view')
  }

  timeline_point(){
    const parent = Options.elements.upper_selector(this.options.event.target , '.lists > li')
    const type   = parent.getAttribute('class')
    const per    = ActionCommon.set_timeline_pos2per(this.options.event.target , this.options.event.pageX)

    const lists = []
    lists.push({key:'copy' , value:'copy'})
    if(Options.contextmenu_copy
    && Options.contextmenu_copy.type === type){
      lists.push({key:'paste' , value:'paste'})
    }
    lists.push({key:'delete', value:'delete'})
    
    const pos = {
      x : this.options.x,
      y : this.options.y,
    }
    const menulists = this.make_lists(lists)
    Options.contextmenu_cache = {
      pos  : pos,
      per  : per,
      type : type,
      elm  : this.options.event.target,
    }
    this.view(pos , menulists)
    this.set_status('view')
  }

  make_lists(lists){
    const ul = document.createElement('ul')
    for(let list of lists){
      const li = document.createElement('li')
      li.innerHTML = list.value
      li.setAttribute('data-key' , list.key)
      ul.appendChild(li)
      Options.event.set(
        li,
        'click',
        this.click.bind(this),
      )
    }
    return ul
  }

  click(e){
    const li = e.target
    const key = li.getAttribute('data-key')
    
    switch(this.type){
      case 'timeline/point':
        switch(key){
          case 'copy':
            this.click_timeline_point_copy()
            this.close()
            break
          case 'paste':
            this.click_timeline_point_paste()
            this.close()
            break
          case 'delete':
            this.click_timeline_point_delete()
            this.close()
            break
        }
        break
      case 'timeline/lists':
        switch(key){
          case 'paste':
            this.click_timeline_point_paste()
            this.close()
            break
        }
        break
    }
    
  }
  click_timeline_point_copy(){
    Options.contextmenu_copy = Options.contextmenu_cache
  }
  click_timeline_point_paste(){
    if(!Options.contextmenu_copy){return}
    if(!Options.timeline){return}
    const flg = Options.timeline.copy_point(
      Options.contextmenu_cache.type,
      Options.contextmenu_copy.per,
      Options.contextmenu_cache.per,
    )
    if(!flg){return}
    // view表示処理
    Options.play.set_timeline_per(Options.contextmenu_cache.per)
    // コピーデータ削除（続けてコピーする場合がある場合はこの処理を無くす）
    delete Options.contextmenu_copy
  }

  click_timeline_point_delete(){
    if(!Options.contextmenu_cache
    || !Options.timeline){return}
    Options.timeline.del_point(
      Options.contextmenu_cache.per , 
      Options.contextmenu_cache.type , 
      Options.contextmenu_cache.elm,
    )
    // view表示処理
    Options.play.set_timeline_per(Options.contextmenu_cache.per)
    // キャッシュデータ削除
    delete Options.contextmenu_cache
  }
}

