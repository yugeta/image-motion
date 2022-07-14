export class Elements{

  // 上位階層をselectorで選択する機能
  upper_selector(elm , selectors){
    if(!elm || !selectors){return}
    selectors = typeof selectors === "object" ? selectors : [selectors]
    if(!elm || !selectors){return}
    let cur, flg = null
    for(let i=0; i<selectors.length; i++){
      if(!selectors[i]){continue}
      for(cur=elm; cur; cur=cur.parentElement) {
        if(!cur.matches(selectors[i])){continue}
        flg = true
        break
      }
      if(flg){break}
    }
    return cur
  }

  get_root(){
    return document.querySelector(".contents")
  }
  
  

  get_area_lists(){
    return document.querySelector(".contents [name='images']")
  }

  // ----------
  // View 
  
  get_area_view(){
    return document.querySelector(".contents [name='view'] .scale")
  }

  get_uuid_view(uuid){
    if(!uuid){return}
    const area = this.get_area_view()
    return area.querySelector(`.pic[data-uuid='${uuid}']`)
  }
  get_uuid_list(uuid){
    if(!uuid){return}
    const area = this.get_area_lists()
    return area.querySelector(`[data-uuid='${uuid}']`)
  }
  get_view_elms(){
    const area = this.get_area_view()
    return area.querySelectorAll(`.pic[data-uuid]`)
  }

  // ----------
  // Property

  get_info_area(){
    return document.querySelector(`.contents [name='property'] .info`)
  }
  get_info_form(name){
    return document.querySelector(`.contents [name='property'] input[name='${name}']`)
  }
  get_info_uuid(){
    const area = this.get_info_area()
    const input = area.querySelector(`input[name='uuid']`)
    return input.value
  }


  // ----------
  // Lists
  
  get_list_area(){
    return document.querySelector(`.contents [name='images'] .lists`)
  }
  get_list_item(uuid){
    const area = this.get_list_area()
    return area.querySelector(`[data-uuid='${uuid}']`)
  }
  get_list_name(uuid){
    const area = this.get_list_area()
    return area.querySelector(`[data-uuid='${uuid}'] .name`)
  }
  get_image_lists(){
    const area = this.get_list_area()
    return area.querySelectorAll(`[data-uuid]`)
  }


  // ----------
  // Header

  get_elm_header(){
    return document.querySelector('header')
  }
  get_elm_input_scale(){
    return document.querySelector(`header .range input[type='range'][name='scale']`)
  }
  get_elm_contents_scale(){
    return document.querySelector(`.contents [name='view'] .scale`)
  }

  // scale
  get_header_scale_input(){
    return document.querySelector(`header input[name='scale']`)
  }
  get_header_scale_value(){
    return document.querySelector(`header .range .scale-value`)
  }


}