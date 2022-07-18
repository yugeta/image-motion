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

  // ----------
  // Transform

  get_transform_area(){
    return document.querySelector(`.contents [name='transform'] .datas`)
  }

  get_transform_rotate_range(){
    const area = this.get_transform_area()
    return area.querySelector(`.rotate input[name='rotate_range']`)
  }
  get_transform_posx_range(){
    const area = this.get_transform_area()
    return area.querySelector(`.posx input[name='posx_range']`)
  }
  get_transform_posy_range(){
    const area = this.get_transform_area()
    return area.querySelector(`.posy input[name='posy_range']`)
  }

  get_transform_rotate_input(){
    const area = this.get_transform_area()
    return area.querySelector(`.rotate input[name='rotate']`)
  }
  get_transform_posx_input(){
    const area = this.get_transform_area()
    return area.querySelector(`.posx input[name='posx']`)
  }
  get_transform_posy_input(){
    const area = this.get_transform_area()
    return area.querySelector(`.posy input[name='posy']`)
  }

  // ----------
  // Timeline

  get_timeline_lists(){
    return document.querySelector(`.contents [name='timeline'] .lists`)
  }
  get_timeline_frame(){
    return document.querySelector(`.contents [name='timeline'] .timeline`)
  }
  get_timeline_cursor(){
    return document.querySelector(`.contents [name='timeline'] .timeline .cursor`)
  }

  get_timeline_header(){
    return document.querySelector(`.contents [name='timeline'] .header`)
  }
  get_duration_input(){
    return document.querySelector(`.contents [name='timeline'] .header .duration input[name='duration']`)
  }

  get_timeline_data_frame(name){
    const area = this.get_timeline_lists()
    if(!area){return}
    return area.querySelector(`.${name}`)
  }

  // ----------
  // Animation

  get_animation_lists(){
    return document.querySelector(`.contents [name='animation'] .lists`)
  }

  get_animation_name_list_input(){
    return document.querySelector(`.contents [name='animation'] .header .input input`)
  }
  get_animation_header(){
    return document.querySelector(`.contents [name='animation'] .header`)
  }
  get_animation_name_lists(){
    return document.querySelector(`.contents [name='animation'] .header .animation_name_lists`)
  }

  get_animation_tools(){
    return document.querySelector(`.contents [name='animation'] .tools`)
  }

}