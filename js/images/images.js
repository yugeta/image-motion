import { Options }       from '../options.js'
import { Uuid    }       from '../common/uuid.js'
import * as ImageCommon  from '../images/common.js'
// import * as ImageShape   from '../images/shape.js'
import * as ActionCommon from '../action/common.js'
import { Timeline }      from '../action/timeline.js'
import { Shape }         from '../shape/shape.js'

export class Images{
  constructor(data){
    if(!data){return}
    if(data.file){
      this.new(data)
    }
    else if(data.data && data.data.uuid){
      this.upload(data.data)
    }
    else{
      return
    }
    Options.img_datas[this.uuid] = this
  }

  new(data){
    const uuid = new Uuid().id
    this.uuid = uuid
    this.cache = Options.datas.get_data(uuid)
    this.cache.uuid = uuid
    this.cache.file = data.file
    this.cache.name = Options.common.get_file2name(data.file.name)
    this.cache.filename = Options.property.get_filename(data)
    this.init()
    // this.set_lists(this.cache.file)
  }

  upload(data){
    this.uuid = data.uuid
    this.cache = Options.datas.set_cache(data.uuid , data)
    this.set_img(data)
    // this.set_lists(data)
  }

  set_lists(data){
    Options.lists.add(this.cache.uuid , data)
  }

  init(){
		const fileReader  = new FileReader()
    fileReader.onload = this.loaded_img.bind(this, fileReader)
		fileReader.readAsDataURL(this.cache.file)
  }

  loaded_img(data , src){
    data.uuid      = this.cache.uuid
    data.src       = data.result || src
    this.set_img(data)
  }

  set_img(data){
    var area       = Options.elements.get_area_view()
    let template   = Options.common.get_template('image_pic')
    template       = Options.common.doubleBlancketConvert(template , data)
    if(!template){return}

    area.insertAdjacentHTML('beforeend' , template)
    const pic      = area.querySelector(`[data-uuid='${data.uuid}']`)
    const img      = pic.querySelector(`img`)
    img.onload     = this.loaded_src.bind(this)
    img.src        = img.getAttribute('data-src')
    img.removeAttribute('data-src')

    this.cache.pic = pic
    this.cache.img = img

    this.set_visibility(data.uuid)

    // shape-splitを表示する
    const shape = new Shape(data.uuid)
    shape.set_shape_split()
    shape.set_shape_points()
  }


  set_visibility(uuid){
    const elm    = Options.elements.get_uuid_view(uuid)
    const data   = Options.datas.get_data(uuid)
    if(data.hidden){
      elm.classList.add('hidden')
    }
  }

  loaded_src(e){
    // const img = e.target
    // const pic = img.parentNode
    this.set_image_size()
    this.set_image_pos()
    this.set_image_order()
    this.set_cache()
    this.set_lists(this.cache)
    this.set_center_pos()
    this.set_transform()

    ImageCommon.set_level()
    e.target.onload = null
  }

  set_cache(){
    const center_pos = this.get_center_pos()
    this.cache.src     = this.cache.img.getAttribute('src')
    this.cache.x       = this.cache.x       || this.cache.img.offsetLeft
    this.cache.y       = this.cache.y       || this.cache.img.offsetTop
    this.cache.w       = this.cache.w       || this.cache.img.offsetWidth
    this.cache.h       = this.cache.h       || this.cache.img.offsetHeight
    this.cache.nw      = this.cache.nw      || this.cache.img.naturalWidth
    this.cache.nh      = this.cache.nh      || this.cache.img.naturalHeight
    this.cache.cx      = this.cache.cx      || center_pos.x
    this.cache.cy      = this.cache.cy      || center_pos.y
    this.cache.cw      = this.cache.cw      || center_pos.w
    this.cache.ch      = this.cache.ch      || center_pos.h
    this.cache.order   = this.cache.order   || 0
    this.cache.posz    = this.cache.posz    || 0
    this.cache.scale   = this.cache.scale   || 1
    this.cache.opacity = this.cache.opacity || 1
  }

  get_center_pos(){
    const center = this.cache.pic.querySelector('.center')
    const size   = Options.center_size
    return {
      x : center.offsetLeft - size / 2,
      y : center.offsetTop  - size / 2,
      w : size,
      h : size,
    }
  }

  set_image_size(){
    const w = this.cache.w || this.cache.img.naturalWidth
    const h = this.cache.h || this.cache.img.naturalHeight
    this.cache.pic.style.setProperty("width"  , `${w}px` , "")
    this.cache.pic.style.setProperty("height" , `${h}px` , "")
  }

  set_image_pos(){
    const x = this.cache.x || 0
    const y = this.cache.y || 0
    this.cache.pic.style.setProperty('top'  , `${y}px` , '')
    this.cache.pic.style.setProperty('left' , `${x}px` , '')

    // // scaleフレームのx軸マイナス値対応
    // Options.view.set_margin(this.cache.pic)
  }

  // set_image_center(){
  //   const center = this.cache.pic
  //   const cx = this.cache.cx || 0
  //   const cy = this.cache.cy || 0
  //   center.style.setProperty('top'  , `${cy}px` , '')
  //   center.style.setProperty('left' , `${cx}px` , '')
  // }

  set_image_order(){
    const order = Number(this.cache.order) || 0
    this.cache.pic.style.setProperty('z-index'  , order || 'auto' , '')
  }
  set_image_transform(){
    const z = Number(this.cache.traz) || 0
    this.cache.pic.style.setProperty('transform'  , `transformZ(${z}px)` , '')
  }

  set_center_pos(){
    const center = this.cache.pic.querySelector('.center')
    const cx = this.cache.cx
    const cy = this.cache.cy
    const cw = this.cache.cw
    const ch = this.cache.ch
    if(center){
      center.style.setProperty('top'    , `${cy}px` , '')
      center.style.setProperty('left'   , `${cx}px` , '')
      center.style.setProperty('width'  , `${cw}px` , '')
      center.style.setProperty('height' , `${ch}px` , '')
    }
    if(this.cache.pic){
      this.cache.pic.style.setProperty('transform-origin',`${cx}px ${cy}px`,'')
    }
  }
  set_transform(datas){
    datas = datas || {}
    let transforms = []
    
    if(typeof datas.posx === 'number'){
      transforms.push(`translateX(${datas.posx}px)`)
    }
    if(typeof datas.posy === 'number'){
      transforms.push(`translateY(${datas.posy}px)`)
    }
    if(typeof datas.posz === 'number'){
      transforms.push(`translateZ(${datas.posz}px)`)
    }
    if(typeof datas.scale === 'number'){
      transforms.push(`scale(${datas.scale})`)
    }
    if(typeof datas.rotate === 'number'){
      transforms.push(`rotate(${datas.rotate}deg)`)
    }
    if(!transforms || !transforms.length){return}
    const transform_value = transforms.join(' ')
    this.cache.pic.style.setProperty('transform' , `${transform_value}` , '')
  }
  
  // アニメーションのリセット処理（表示系）
  reset_style(){
    this.reset_transform()
    this.reset_opacity()
  }
  reset_transform(){
    this.cache.pic.style.setProperty('transform' , `none` , '')
    const shape_splits = Options.elements.get_shape_images(this.uuid)
    if(shape_splits && shape_splits.length){
      for(let item of shape_splits){
        item.style.setProperty('transform' , '' , '')
      }
    }
  }
  reset_opacity(){
    this.cache.pic.style.removeProperty('opacity')
  }


  del(){
    const uuid = this.uuid
    const elm = Options.elements.get_uuid_view(uuid)
    if(!elm){return}
    elm.parentNode.removeChild(elm)
  }

  renew(data){
    // データ取得
    const fileReader  = new FileReader()
    fileReader.onload = this.set_renew_img.bind(this, fileReader)
		fileReader.readAsDataURL(data)

    // 画像構成の削除

  }

  // srcのみを入れ替える
  set_renew_img(data){

    // 表示切り替え
    const img = Options.elements.get_uuid_view_img(this.uuid)
    const before_data = this.get_image_data(img)
    img.onload = this.set_renew_img_onload.bind(this , this.uuid , before_data)
    if(img){
      img.src = data.result
    }
    // データ処理
    this.cache.src = data.result
  }

  // shape画像一式を入れ替える
  set_renew_img_same(uuid , src){
    const shape_splits = Options.elements.get_shape_images(uuid)
    if(shape_splits && shape_splits.length){
      for(let item of shape_splits){
        const shape_img = item.querySelector(':scope > img')
        if(shape_img){
          shape_img.src = src
        }
      }
    }
  }

  // shapeクリア , サイズクリア , cache(data)クリア
  set_renew_img_resize(img , uuid){
    this.cache.w = img.naturalWidth
    this.cache.h = img.naturalHeight
    this.set_image_size()
    this.set_cache()
    this.set_center_pos()
    this.set_transform()
    if(Options.shape){
      // Options.shape.clear_shape()
      Options.shape.clear_shape_split()
      Options.shape.clear_shape_animation()
      Options.shape.clear_shape_use()
    }
    // timelineに表示されている場合は、表示削除する
    // ActionCommon.timeline_remake()
    const animation_name = ActionCommon.get_animation_name()
    if(Options.timeline
    && Options.timeline.name === animation_name
    && Options.timeline.uuid === uuid){
      Options.timeline = new Timeline(animation_name , uuid)
    }
  }

  // 画像の情報を取得
  get_image_data(img){
    return {
      src : img.src,
      naturalWidth : img.naturalWidth,
      naturalHeight : img.naturalHeight,
    }
  }
  
  set_renew_img_onload(uuid , before_data , e){
    const img = e.target
    const src = img.getAttribute('src')

    // 古い画像との比較をする
    const current_data = this.get_image_data(img)
    if(current_data.naturalWidth  === before_data.naturalWidth
    && current_data.naturalHeight === before_data.naturalHeight){
      this.set_renew_img_same(uuid , src)
    }
    else{
      this.set_renew_img_resize(img , uuid)
    }

    // サムネイル更新
    this.set_renew_thumbnail(img , uuid)
  }

  set_renew_thumbnail(img , uuid){
    const target = Options.elements.get_list_image(uuid)
    if(!target){return}
    target.src = img.src
  }

}