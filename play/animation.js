import { Options }  from './options.js'
import { M_Matrix } from './m_matrix.js'

export class Animation{
  constructor(name , style , data){
    this.data = data
    if(!data.animations){return}
    style = style || this.set_style()
    for(let key in data.animations){
      for(let uuid in data.animations[key].items){
        const res = this.get_css_datas(name,key,uuid)
        style.textContent += res
      }
    }
  }

  // styleタグの設置
  set_style(){
    const check = document.querySelector(`style[data-service='${Options.service_name}']`)
    if(check){return}
    const style = document.createElement('style')
    style.setAttribute('type' , 'text/css')
    style.setAttribute('data-service' , Options.service_name)
    document.querySelector('head').appendChild(style)
    return style
  }
  

  // cssの値を取得
  get_css_datas(n , key , uuid){
    const data = this.data.animations[key]
    const options = {
      n         : n,
      key       : key,
      uuid      : uuid,
      keyframes : this.data.animations[key].items[uuid].keyframes,
      name      : n +'_'+ key +'_'+ uuid,
      timing    : data.timing    || 'ease-in-out',
      duration  : data.duration  || 1,
      count     : data.count     || 'infinite',
      direction : data.direction || 'normal',
    }

    let css = this.get_normal(options)

    if(this.is_shape(uuid)){
      const shape_table = this.get_shape_table(uuid)
      // console.log(uuid , shape_table)
      css += this.get_shape_root(options , shape_table)
    }
    return css
  }
  get_normal(options){
    let css = ''
    css += `[data-service='${Options.service_name}'][data-name='${options.n}'][data-action='${options.key}'] .pic[data-uuid='${options.uuid}']{`+"\n"
    css += `animation-name : ${options.name};`+"\n"
    css += `animation-timing-function: ${options.timing};`+"\n"
    css += `animation-duration : ${options.duration}s;`+"\n"
    css += `animation-iteration-count : ${options.count};`+"\n"
    css += `animation-direction: ${options.direction};`+"\n"
    css += '}'+"\n"
    css += `@keyframes ${options.name}{`+"\n"
    css += this.get_keyframes(options.keyframes)
    css += `}`+"\n"
    return css
  }

  // cssのkeyframesの取得
  get_keyframes(keyframes){
    let css = ''
    for(let i in keyframes){
      const transform = this.get_transform(keyframes[i])
      if(!transform){continue}
      css += `${i}%{`+"\n"
      css +=  `transform : ${transform};`+"\n"
      css += '}'+"\n"
    }
    return css
  }

  // css-keyframesのtransformの取得
  get_transform(transform_data){
    let datas = []
    if(transform_data.rotate){
      datas.push(`rotate(${transform_data.rotate}deg)`)
    }
    if(transform_data.posx){
      datas.push(`translateX(${transform_data.posx}px)`)
    }
    if(transform_data.posy){
      datas.push(`translateY(${transform_data.posy}px)`)
    }
    return datas.join(' ')
  }


  is_shape(uuid){
    for(let img of this.data.images){
      if(img.uuid !== uuid){continue}
      if(img.shape_use === 1){
        return true
      }
      break
    }
  }
  get_shape_table(uuid){
    for(let img of this.data.images){
      if(img.uuid !== uuid){continue}
      if(img.shape_use === 1){
        return img.shape_table
      }
      break
    }
  }

  // get_shape_root(options , shape_table){
  //   return this.set_shape_table(options , shape_table)
  // }
  get_shape_root(options ,table){
    if(!options || !table){return ''}
    let css = ''
    let split_image_num = 0
    for(let y=0; y<table.y; y++){
      for(let x=0; x<table.x; x++){
        css += this.get_css_shape(options , split_image_num)
        css += this.get_shape_keyframe(options , split_image_num)
        split_image_num++
      }
    }
    return css
  }

  get_css_shape(options , split_image_num){
    let css = ''
    const name = `${options.name}-${split_image_num}`
    css += `[data-service='${Options.service_name}'][data-name='${options.n}'][data-action='${options.key}'] .pic[data-uuid='${options.uuid}'] > .shape > .shape-item[data-num='${split_image_num}']{`+"\n"
    css += `animation-name : ${name};`+"\n"
    css += `animation-timing-function: ${options.timing};`+"\n"
    css += `animation-duration : ${options.duration}s;`+"\n"
    css += `animation-iteration-count : ${options.count};`+"\n"
    css += `animation-direction: ${options.direction};`+"\n"
    css += '}'+"\n"

    css += `@keyframes ${name}{`+"\n"
    css += this.get_shape_keyframe(options.keyframes , split_image_num , options.uuid)
    css += `}`+"\n"
    return css
  }
  get_shape_keyframe(keyframes , split_image_num , uuid){//console.log(split_image_num)
    let css = ''
    // const pos = this.get_uuid2pos(uuid , split_image_num)
    // const transform_origin = `-${0}px -${289.5}px`
    // div.style.setProperty('transform-origin' , transform_origin , '')
    for(let key_num in keyframes){
      const transform = this.get_shape_transform(keyframes[key_num] , split_image_num)
      if(!transform){continue}
      css += `${key_num}%{`+"\n"
      // css += `transform-origin : ${transform_origin};` +"\n"
      css += `transform : ${transform};` +"\n"
      css += '}'+"\n"
    }
    return css
  }
  // css-keyframesのtransformの取得
  get_shape_transform(transform_data , split_image_num){
    if(!transform_data.shape
    || !transform_data.shape.matrix
    || !transform_data.shape.matrix[split_image_num]){return ''}
    return transform_data.shape.matrix[split_image_num].transform
  }

  // get_uuid2pos(uuid , split_image_num){
  //   for(let img of this.data.images){
  //     if(img.uuid !== uuid){continue}
  //     if(img.shape_use === 1){
  //       return img.shape_table
  //     }
  //     break
  //   }
  // }

}