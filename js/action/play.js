import { Options }       from '../options.js'
import * as ActionCommon from './common.js'
import * as ImageCommon  from '../images/common.js'
import * as ShapeCommon  from '../shape/common.js'

export class Play{

  play(){
    if(!this.flg_duration){return}
    let per = ActionCommon.get_timeline_per()
    per++
    per = per > 100 ? 0 : per
    this.set_timeline_per(per)
    setTimeout(this.play.bind(this) , this.flg_duration)
  }

  stop(){
    if(this.flg_duration){
      delete this.flg_duration
    }
  }

  // 任意per（フレーム）に対する、viewのimgすべてをanimationする
  transform_img_all(per){
    // 指定（現在）フレーム数を取得
    per = per !== undefined ? per : ActionCommon.get_timeline_per()
    const animation_name = ActionCommon.get_animation_name()
    if(!animation_name){
      this.transform_img_reset()
      return
    }
    const datas = Options.datas.get_animation_name_datas(animation_name)
    if(!datas || !datas.items){
      this.transform_img_reset()
      return
    }
    // console.log(datas)
    for(let uuid in datas.items){
      if(!datas.items[uuid].keyframes){continue}
      const types = this.get_transform_types(datas.items[uuid].keyframes)
      const transform = this.get_transform_css(animation_name , uuid , per , types)
      const styles    = this.get_style_css(animation_name , uuid , per , types)
      const pic   = Options.elements.get_uuid_view(uuid)
      if(transform){
        pic.style.setProperty('transform' , transform , '')
      }
      if(styles.length){
        for(let s of styles){
          pic.style.setProperty(s.property , s.value , '')
        }
      }
      this.set_shape(animation_name , uuid , per , types)
    }
  }
  transform_img_reset(){
    // ImageCommon.reset_transform()
  }

  get_transform_types(datas){
    const keys = []
    for(let per in datas){
      for(let key in datas[per]){
        if(keys.indexOf(key) === -1){
          keys.push(key)
        }
      }
    }
    return keys
  }
  
  get_transform_css(name , uuid , per , types){
    const transforms = []
    for(let type of types){
      const value = Options.datas.get_animation_name_data_between(name , uuid , per , type)
      switch(type){
        case 'rotate':
          transforms.push(`rotate(${value}deg)`)
          break

        case 'posx':
          transforms.unshift(`translateX(${value}px)`)
          break

        case 'posy':
          transforms.unshift(`translateY(${value}px)`)
          break

        case 'posz':
          transforms.unshift(`translateZ(${value}px)`)
          break

        case 'scalex':
          transforms.unshift(`scaleX(${value})`)
          break

        case 'scaley':
          transforms.unshift(`scaleY(${value})`)
          break
      }
    }
    return transforms.join(' ')
  }
  get_style_css(name , uuid , per , types){
    const styles = []
    for(let type of types){
      const value = Options.datas.get_animation_name_data_between(name , uuid , per , type)
      switch(type){
        case 'opacity':
          styles.push({property : 'opacity' , value:`${value}`})
          break
      }
    }
    return styles
  }


  set_shape(name , uuid , per , types){
    if(!types.indexOf('shape') === -1){return}
    const datas  = Options.datas.get_animation_name_shape_between(name , uuid , per)
    if(!datas || !datas.matrix){return}
    const images = Options.elements.get_shape_images(uuid)
    for(let i=0; i<images.length; i++){
      const img = images[i]
      img.style.setProperty('transform' , datas.matrix[i].transform , '')
    }

    // point-pos
    const point_elms  = Options.elements.get_shape_points(uuid)
    // const point_datas = ShapeCommon.get_date2points(datas.points)
    const point_datas = ShapeCommon.get_table2pointDatas(uuid , datas.points)
    // console.log(point_datas)
    for(let i=0; i<point_elms.length; i++){
      const point_elm = point_elms[i]
      const pos       = point_datas[i]
      point_elm.style.setProperty('left',`${pos.x}px`,'')
      point_elm.style.setProperty('top' ,`${pos.y}px`,'')
    }
  }

  set_timeline_per(per){
    const cursor = Options.elements.get_timeline_cursor()
    const rate   = ActionCommon.get_frame_rate()
    if(per < 0){
      per = 0
    }
    else if(per > 100){
      per = 100
    }
    cursor.setAttribute('data-num' , per)
    const left = ~~(per * rate)
    cursor.style.setProperty('left', `${left}px`,'')
  
    // console.log('--6')
    this.transform_img_all(per)
    this.timeline_key_point_current(per)
  }

  // key-pointでcurrent-perにフラグをセットする。
  timeline_key_point_current(per){
    per = per !== undefined ? per : ActionCommon.get_timeline_per()
    const points = Options.elements.get_timeline_lists_points()
    if(!points || !points.length){return}
    for(let point of points){
      if(point.getAttribute('data-num') == per){
        point.setAttribute('data-status' , 'active')
      }
      else if(point.hasAttribute('data-status')){
        point.removeAttribute('data-status')
      }
    }
  }


}