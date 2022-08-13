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

  get_iframe(){
    return document.querySelector(".contents-home iframe")
  }

  get_root(){
    return document.querySelector(".contents")
  }
  
  get_home(){
    return document.querySelector(".contents .home")
  }

  get_footer(){
    return document.querySelector('footer')
  }
  
  get_version(){
    return document.querySelector('footer .version-value')
  }

  get_area_lists(){
    return document.querySelector(".contents [name='images']")
  }


  get_active_view(){
    const area = this.get_area_view()
    return area.querySelector(`.pic[data-status='active']`)
  }

  get_over(){
    return document.querySelector('.contents .over')
  }
  get_under(){
    return document.querySelector('.contents .under')
  }

  get_contextmenu(){
    return document.querySelector('.contextmenu')
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
  get_view_img(uuid){
    if(!uuid){return null}
    const pic = this.get_uuid_view(uuid)
    return pic.querySelector(`:scope > img`)
  }
  get_view_shape(uuid){
    if(!uuid){return null}
    const pic = this.get_uuid_view(uuid)
    return pic.querySelector(`:scope > .shape`)
  }

  get_pic_current_select(){
    return document.querySelector(`.contents [name='view'] .pic[data-status='active']`)
  }

  get_view_move_cursor(){
    return document.querySelector(`.contents [name='view'] > .move`)
  }

  get_uuid_view_img(uuid){
    if(!uuid){return}
    const area = this.get_area_view()
    return area.querySelector(`.pic[data-uuid='${uuid}'] > img`)
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
  
  get_elm_contents_view(){
    return document.querySelector(`.contents [name='view']`)
  }
  get_elm_contents_scale(){
    return document.querySelector(`.contents [name='view'] .scale`)
  }

  // scale
  get_elm_input_scale(){
    return document.querySelector(`input[type='range'][name='view-scale']`)
  }
  get_header_scale_value(){
    return document.querySelector(`input[type='range'][name='view-scale'] ~ .scale-value`)
  }

  // file
  get_header_menu_file(){
    return document.querySelector(`header .text-menu [data-name='file']`)
  }
  get_header_menu_file_check(){
    return document.querySelector(`header .text-menu [data-name='file'] input[type='checkbox'][name='menu']`)
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
  get_transform_posz_input(){
    const area = this.get_info_area()
    return area.querySelector(`input[name='posz']`)
  }

  // ----------
  // Timeline

  get_timeline_lists(){
    return document.querySelector(`.contents [name='timeline'] .lists`)
  }
  get_timeline_lists_points(){
    return document.querySelectorAll(`.contents [name='timeline'] .lists .point`)
  }
  get_timeline_frame(){
    return document.querySelector(`.contents [name='timeline'] .timeline`)
  }
  get_timeline_cursor(){
    return document.querySelector(`.contents [name='timeline'] .timeline .cursor`)
  }
  get_timeline_header(){
    return document.querySelector(`.contents [name='timeline'] .timeline .header`)
  }

  get_timeline_header(){
    return document.querySelector(`.contents [name='timeline'] .header`)
  }
  get_duration_input(){
    return document.querySelector(`.contents .duration input[name='duration']`)
  }

  get_timeline_data_frame(name){
    const area = this.get_timeline_lists()
    if(!area){return}
    return area.querySelector(`.${name}`)
  }
  get_timeline_type_points(type){
    if(!type){return}
    return document.querySelectorAll(`.contents [name='timeline'] .lists .${type} .point`)
  }

  // ----------
  // Animation

  get_animation_lists(){
    return document.querySelector(`.contents [name='animation'] .lists`)
  }
  get_animation_lists_input_array(){
    return document.querySelectorAll(`.contents [name='animation'] .lists .input input`)
  }
  get_animation_lists_input_type(type){
    return document.querySelector(`.contents [name='animation'] .lists .input input[name='${type}']`)
  }


  get_animation_name_list_input(){
    // return document.querySelector(`.contents [name='animation'] .header .input input`)
    return document.querySelector(`.contents input[name='animation-name']`)
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

  get_animation_header_add(){
    return document.querySelector(`.contents .animation-name-control .add`)
  }
  get_animation_header_edit(){
    return document.querySelector(`.contents .animation-name-control .edit`)
  }
  get_animation_header_copy(){
    return document.querySelector(`.contents .animation-name-control .copy`)
  }
  get_animation_header_trash(){
    // return document.querySelector(`.contents [name='animation'] .header .trash`)
    return document.querySelector(`.contents .animation-name-control .trash`)
  }

  // ----------
  // Shape

  get_shape_property(){
    return document.querySelector(`.contents .over .over-right .shape`)
  }
  get_shape_property_info(){
    return document.querySelector(`.contents .over .over-right [name='shape'] .info`)
  }

  get_shape_property_x_plus(){
    return document.querySelector(`.contents .over .over-right [name='shape'] [data-name='x'][data-mode='+']`)
  }
  get_shape_property_x_minus(){
    return document.querySelector(`.contents .over .over-right [name='shape'] [data-name='x'][data-mode='-']`)
  }
  get_shape_property_y_plus(){
    return document.querySelector(`.contents .over .over-right [name='shape'] [data-name='y'][data-mode='+']`)
  }
  get_shape_property_y_minus(){
    return document.querySelector(`.contents .over .over-right [name='shape'] [data-name='y'][data-mode='-']`)
  }
  get_shape_property_matrix(){
    return document.querySelector(`.contents .over .over-right [name='shape'] .matrix`)
  }
  get_shape_property_matrix_root(){
    return document.querySelector(`.contents .over .over-right [name='shape'] .matrix tbody`)
  }
  get_shape_property_use(){
    return document.querySelector(`.contents .over .over-right [name='shape'] input[name='shape_flg']`)
  }
  get_shape_property_preview(){
    return document.querySelector(`.contents .over .over-right [name='shape'] .preview`)
  }
  get_shape_image_num2split_image(uuid , image_num){
    return document.querySelector(`.contents [name='view'] .pic[data-uuid='${uuid}'] > .shape .shape-item[data-num='${image_num}']`)
  }
  get_shape_point_num(uuid , point_num){
    return document.querySelector(`.contents [name='view'] .pic[data-uuid='${uuid}'] > .shape .shape-point[data-num='${point_num}']`)
  }
  get_shape_reset(){
    return document.querySelector(`.contents .over .over-right [name='shape'] button[name='reset']`)
  }
  get_shape_points(uuid){
    return document.querySelectorAll(`.contents [name='view'] .pic[data-uuid='${uuid}'] > .shape .shape-point`)
  }
  get_shape_images(uuid){
    return document.querySelectorAll(`.contents [name='view'] .pic[data-uuid='${uuid}'] > .shape > .shape-item`)
  }


  // ----------
  // timeline-scroll
  get_timeline_scroll_area(){
    return document.querySelector(`.timeline-scroll-area`)
  }
  get_timeline_scroll_bar(){
    return document.querySelector(`.timeline-scroll-bar`)
  }
}