import { Options }  from '../options.js'
// import { Matrix }   from './matrix.js'

export class Animation{
  constructor(options){
    if(!options || !options.data || !options.data.animations){return}
    this.options = options
    this.animation_names = this.get_animation_names()
    this.css = this.get_css()
    // this.shape = this.get_shape()
  }

  // animation-nameの一覧を取得
  get_animation_names(){
    const animations = this.options.data.animations
    return Object.keys(animations)
  }

  // animation設定されているデータからcssを生成
  get_css(){
    const animations = this.options.data.animations
    const css = []
    for(let key in animations){
      for(let uuid in animations[key].items){
        css.push(this.create_css(
          this.options.uuid , 
          key , 
          uuid,
        ))
      }
    }
    return css.join('')
  }
  

  // cssの値を取得
  create_css(name , key , uuid){
    const anim = this.options.data.animations
    const data = {
      key_name  : 'anim_'+ name +'_'+ key +'_'+ uuid.replace(/\-/g,''),
      name      : name,
      key       : key,
      uuid      : uuid,
      keyframes : anim[key].items[uuid].keyframes,
      timing    : anim.timing    || 'ease-in-out',
      duration  : anim.duration  || 1,
      count     : anim.count     || 'infinite',
      direction : anim.direction || 'normal',
    }
    return this.get_normal(data) +'\n'
  }
  get_normal(d){
    const css = []
    css.push(`[data-service='${Options.service_name}'][data-uuid='${d.name}'][data-action='${d.key}'] .pic[data-uuid='${d.uuid}']{`)
    css.push(`  animation-name : ${d.key_name};`)
    css.push(`  animation-timing-function: ${d.timing};`)
    css.push(`  animation-duration : ${d.duration}s;`)
    css.push(`  animation-iteration-count : ${d.count};`)
    css.push(`  animation-direction: ${d.direction};`)
    css.push('}')

    css.push(`@keyframes ${d.key_name}{`)
    css.push(this.get_keyframes(d.keyframes))
    css.push(`}`)
    return css.join('\n')
  }

  // cssのkeyframesの取得
  get_keyframes(keyframes){
    const css = []
    for(let i in keyframes){
      const transform = this.get_transform(keyframes[i])
      if(!transform){continue}
      css.push(`  ${i}%{`)
      css.push(`    transform : ${transform};`)
      css.push('  }')
    }
    return css.join('\n')
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
    if(transform_data.shape){
      datas.push('scale(1.0)')
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