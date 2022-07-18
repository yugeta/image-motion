import { Options }       from '../options.js'
import * as ActionCommon from './common.js'
import * as ImageCommon  from '../images/common.js'

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
    for(let uuid in datas.items){
      if(!datas.items[uuid].keyframes){continue}
      const types = this.get_transform_types(datas.items[uuid].keyframes)
      const css = this.get_transform_css(animation_name , uuid , per , types)
      const pic       = Options.elements.get_uuid_view(uuid)
      pic.style.setProperty('transform' , css , '')
    }
  }
  transform_img_reset(){
    ImageCommon.reset_transform()
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
      // console.log(name , uuid , per , type)
      // console.log(type , value)
      switch(type){
        case 'rotate':
          transforms.push(`rotate(${value}deg)`)
          break

        case 'posx':
          transforms.push(`translateX(${value}px)`)
          break

        case 'posy':
          transforms.push(`translateY(${value}px)`)
          break

        case 'scalex':
          transforms.push(`translateY(${value})`)
          break
        case 'scaley':
          transforms.push(`translateY(${value})`)
          break
      }
    }
    return transforms.join(' ')
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
  
    // if(Options.animation){
    //   Options.animation.change_timeline()
    // }
    // ActionCommon.set_current_num(this.name , this.uuid)
    this.transform_img_all(per)
  }


}