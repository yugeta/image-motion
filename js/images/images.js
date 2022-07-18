import { Options }      from '../options.js'
import { Uuid    }      from '../common/uuid.js'
import * as ImageCommon from './common.js'

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
  }

  set_cache(){
    const center_pos = this.get_center_pos()
    this.cache.src   = this.cache.img.getAttribute('src')
    this.cache.x     = this.cache.x  || this.cache.img.offsetLeft
    this.cache.y     = this.cache.y  || this.cache.img.offsetTop
    this.cache.w     = this.cache.w  || this.cache.img.offsetWidth
    this.cache.h     = this.cache.h  || this.cache.img.offsetHeight
    this.cache.nw    = this.cache.nw || this.cache.img.naturalWidth
    this.cache.nh    = this.cache.nh || this.cache.img.naturalHeight
    this.cache.cx    = this.cache.cx || center_pos.x
    this.cache.cy    = this.cache.cy || center_pos.y
    this.cache.order = this.cache.order || 0
  }

  get_center_pos(){
    const center = this.cache.pic.querySelector('.center')
    return {
      x : center.offsetLeft,
      y : center.offsetTop,
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
// console.log(x,y)
    this.cache.pic.style.setProperty('top'  , `${y}px` , '')
    this.cache.pic.style.setProperty('left' , `${x}px` , '')
  }
  set_image_order(){
    const order = Number(this.cache.order) || 0
    this.cache.pic.style.setProperty('z-index'  , order || 'auto' , '')
  }

  set_center_pos(){
    const center = this.cache.pic.querySelector('.center')
    const cx = this.cache.cx
    const cy = this.cache.cy
    if(center){
      center.style.setProperty('top'  , `${cy}px` , '')
      center.style.setProperty('left' , `${cx}px` , '')
    }
    if(this.cache.pic){
      this.cache.pic.style.setProperty('transform-origin',`${cx}px ${cy}px`,'')
    }
  }
  set_transform(datas){
    // const datas = this.get_transform()
    // if(!datas){return}
    datas = datas || {}
    let transforms = []
    if(datas.rotate){
      transforms.push(`rotate(${datas.rotate}deg)`)
    }
    if(datas.posx){
      transforms.push(`translateX(${datas.posx}px)`)
    }
    if(datas.posy){
      transforms.push(`translateX(${datas.posy}px)`)
    }
    if(!transforms || !transforms.length){return}
    const transform_value = transforms.join(' ')
    this.cache.pic.style.setProperty('transform' , `${transform_value}` , '')
  }
  reset_transform(){
    this.cache.pic.style.setProperty('transform' , `none` , '')
    // switch(Options.common.get_hash()){
    //   case 'update':
    //     return Options.trans_datas[this.uuid] || {}

    //   case 'action':
    //     return this.cache
    // }
  }

  del(){
    const uuid = this.uuid
    const elm = Options.elements.get_uuid_view(uuid)
    if(!elm){return}
    elm.parentNode.removeChild(elm)
  }

}