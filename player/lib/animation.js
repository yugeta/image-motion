import { Options }  from '../options.js'
import { Matrix }   from './matrix.js'

export class Animation{
  constructor(options){
    if(!options || !options.data || !options.data.animations){return}
    this.options = options
    this.animation_names = this.get_animation_names()
    this.css = this.get_css()
    this.set_shape_datas()
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
      // key_name  : 'anim_'+ name +'_'+ key +'_'+ uuid.replace(/\-/g,''),
      key_name  : 'anim_'+ name +'_'+ key +'_'+ uuid,
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
      css.push(`  ${i}%{`)
      const transform = this.get_transform(keyframes[i])
      if(transform){
        css.push(`    transform : ${transform};`)
      }
      const styles = this.get_styles(keyframes[i])
      if(styles && styles.length){
        for(let style of styles){
          console.log(style)
          css.push(`    ${style}`)
        }
      }
      css.push('  }')
    }
    return css.join('\n')
  }

  // css-keyframesのtransformの取得
  get_transform(transform_data){
    const datas = []
    if(typeof transform_data.rotate !== 'undefined'){
      datas.push(`rotate(${transform_data.rotate}deg)`)
    }
    if(typeof transform_data.posx !== 'undefined'){
      datas.unshift(`translateX(${transform_data.posx}px)`)
    }
    if(typeof transform_data.posy !== 'undefined'){
      datas.unshift(`translateY(${transform_data.posy}px)`)
    }
    if(typeof transform_data.scalex !== 'undefined'){
      datas.unshift(`scaleX(${transform_data.scalex})`)
    }
    if(typeof transform_data.scaley !== 'undefined'){
      datas.unshift(`scaleY(${transform_data.scaley})`)
    }
    // if(typeof transform_data.shape !== 'undefined'){
    //   datas.push('scale(1.0)')
    // }
    return datas.join(' ')
  }
  get_styles(data){
    const styles = []
    if(typeof data.opacity !== 'undefined'){
      styles.push(`opacity:${data.opacity};`)
    }
    return styles
  }





  // ----------
  // Shape
  set_shape_datas(){
    try{
      const animation_names = this.get_animation_names()
      if(!animation_names || !animation_names.length){return}
      // console.log(animation_names)
      // const uuids     = this.get_shape_uuid_arr()
      for(let animation_name of animation_names){
        if(!this.options.data.animations[animation_name].items){continue}
        const uuid_arr = Object.keys(this.options.data.animations[animation_name].items)
        for(let image_num=0; image_num<this.options.data.images.length; image_num++){
          const image_data = this.options.data.images[image_num]
          if(image_data.shape_use !== 1){continue}
          // if(!uuid_arr || uuid_arr.indexOf(image_data.uuid) === -1){continue}
          // const anim_data = this.options.data.animations[name].items
          this.set_shape_keyframes(
            animation_name,
            image_data,
          )
        }
      }
    }
    catch(err){
      console.warn(err)
    }
  }

  get_shape_uuid_arr(){
    const arr = []
    for(let image_data of this.options.data.images){
      // const image_data = options.data.images[i]
      if(image_data.shape_use !== 1){continue}
      arr.push(image_data.uuid)
    }
    return arr
  }

  get_animation_data(animation_name){
    return this.options.data.animations[animation_name].items
  }


  // is_shape(uuid){
  //   for(let img of this.data.images){
  //     if(img.uuid !== uuid){continue}
  //     if(img.shape_use === 1){
  //       return true
  //     }
  //     break
  //   }
  // }
  get_shape_table(uuid){
    for(let img of this.options.data.images){
      if(img.uuid !== uuid){continue}
      if(img.shape_use === 1){
        return img.shape_table
      }
      break
    }
  }

  is_shape(keyframes){
    if(!keyframes){return}
    for(let per in keyframes){
      if(keyframes[per].shape){
        return true
      }
    }
  }

  // keyframe(%)全てにmatrixをセットする。
  set_shape_keyframes(animation_name , image_data){
    const anim_data   = this.get_animation_data(animation_name)
    if(!anim_data){return}
    const keyframes   = anim_data[image_data.uuid] ? anim_data[image_data.uuid].keyframes : null
    if(!keyframes || !this.is_shape(keyframes)){return}
    const splits      = image_data.shape_splits
    const base_points = image_data.shape_points
    const new_matrixs = []
    for(let per=0; per<=100; per++){
      const key_data = this.get_shape_between_keyframes(per , keyframes)
      for(let split_num=0; split_num<splits.length; split_num++){
        if(keyframes[per]
        && keyframes[per].shape
        && keyframes[per].shape.matrix
        && keyframes[per].shape.matrix[split_num]){continue}
        new_matrixs[per] = new_matrixs[per] || []
        const matrix = this.get_matrix_data(per , split_num , base_points , keyframes , key_data)
        new_matrixs[per][split_num] = matrix
      }
    }
    for(let per=0; per<=100; per++){
      for(let split_num=0; split_num<splits.length; split_num++){
        keyframes[per] = keyframes[per] || {}
        keyframes[per].shape = keyframes[per].shape || {}
        keyframes[per].shape.matrix = keyframes[per].shape.matrix || []
        const matrix = this.get_shape_value(per , split_num , keyframes , new_matrixs)
        keyframes[per].shape.matrix[split_num] = matrix
      }
    }
  }

  get_shape_value(per , split_num , keyframes , new_matrixs){
    if(keyframes
    && keyframes[per]
    && keyframes[per].shape
    && keyframes[per].shape.matrix
    && typeof keyframes[per].shape.matrix[split_num] !== 'undefined'){
      return keyframes[per].shape.matrix[split_num]
    }
    else if(new_matrixs
    && new_matrixs[per]
    && typeof new_matrixs[per][split_num] !== 'undefined'){
      return new_matrixs[per][split_num]
    }
  }

  get_matrix_data(per , split_num , base_points , keyframes , key_data){
    const next_positions = this.get_shape_next_points(per , split_num , keyframes , key_data)
    return new Matrix(base_points[split_num] , next_positions)
  }

  get_image_data(uuid){
    const datas = this.options.data.images
    for(let data of datas){
      if(data.uuid === uuid){continue}
      return data
    }
  }

  get_shape_next_points(per , split_num , keyframes , key_data){
    // const res = this.get_shape_between_keyframes(per , keyframes , key_data)
    // console.log(per,res)
    if(!key_data){return}
    const start_points = keyframes[key_data.start].shape.points
    const end_points   = keyframes[key_data.end].shape.points
    const points = []
    for(let j=0; j<start_points[split_num].length; j++){
      points.push({
        x : start_points[split_num][j].x + (end_points[split_num][j].x - start_points[split_num][j].x) * key_data.rate,
        y : start_points[split_num][j].y + (end_points[split_num][j].y - start_points[split_num][j].y) * key_data.rate,
      })
    }
    return points
  }

  get_shape_between_keyframes(per , keyframes){
    const frames = Object.keys(keyframes)
    // console.log(keyframes,frames)
    // console.log(keyframes)
    // keyがあるフレームの場合
    if(keyframes[per]){
      return {
        mode  : 'exist',
        start : per, 
        end   : per,
        rate  : 1.0,
      }
    }

    // 手前
    if(per < frames[0]){
      return {
        mode  : 'before',
        start : Number(frames[0]), 
        end   : Number(frames[0]),
        rate  : 1.0,
      }
    }

    // 後ろ
    if(per > frames[frames.length -1]){
      return {
        mode  : 'after',
        start : Number(frames[frames.length -1]), 
        end   : Number(frames[frames.length -1]),
        rate  : 1.0,
      }
    }

    // keyが無いブレームの場合
    for(let i=0; i<frames.length-1; i++){
      const current = Number(per)
      const before  = Number(frames[i])
      const after   = Number(frames[i+1])
      // 中間
      if(before < current && current < after){
        return {
          mode  : 'between',
          start : before, 
          end   : after,
          rate  : (current - before) / (after - before),
        }
      }
    }
    return {
      mode  : 'none',
      start : Number(frames[0]), 
      end   : Number(frames[0]),
      rate  : 1.0,
    }
  }

  // // get_shape_root(options , shape_table){
  // //   return this.set_shape_table(options , shape_table)
  // // }
  // get_shape_root(options ,table){
  //   if(!options || !table){return ''}
  //   let css = ''
  //   let split_image_num = 0
  //   for(let y=0; y<table.y; y++){
  //     for(let x=0; x<table.x; x++){
  //       css += this.get_css_shape(options , split_image_num)
  //       css += this.get_shape_keyframe(options , split_image_num)
  //       split_image_num++
  //     }
  //   }
  //   return css
  // }

  // get_css_shape(options , split_image_num){
  //   let css = ''
  //   const name = `${options.name}-${split_image_num}`
  //   css += `[data-service='${Options.service_name}'][data-name='${options.n}'][data-action='${options.key}'] .pic[data-uuid='${options.uuid}'] > .shape > .shape-item[data-num='${split_image_num}']{`+"\n"
  //   css += `animation-name : ${name};`+"\n"
  //   css += `animation-timing-function: ${options.timing};`+"\n"
  //   css += `animation-duration : ${options.duration}s;`+"\n"
  //   css += `animation-iteration-count : ${options.count};`+"\n"
  //   css += `animation-direction: ${options.direction};`+"\n"
  //   css += '}'+"\n"

  //   css += `@keyframes ${name}{`+"\n"
  //   css += this.get_shape_keyframe(options.keyframes , split_image_num , options.uuid)
  //   css += `}`+"\n"
  //   return css
  // }
  // get_shape_keyframe(keyframes , split_image_num , uuid){//console.log(split_image_num)
  //   let css = ''
  //   // const pos = this.get_uuid2pos(uuid , split_image_num)
  //   // const transform_origin = `-${0}px -${289.5}px`
  //   // div.style.setProperty('transform-origin' , transform_origin , '')
  //   for(let key_num in keyframes){
  //     const transform = this.get_shape_transform(keyframes[key_num] , split_image_num)
  //     if(!transform){continue}
  //     css += `${key_num}%{`+"\n"
  //     // css += `transform-origin : ${transform_origin};` +"\n"
  //     css += `transform : ${transform};` +"\n"
  //     css += '}'+"\n"
  //   }
  //   return css
  // }
  // css-keyframesのtransformの取得
  // get_shape_transform(transform_data , split_image_num){
  //   if(!transform_data.shape
  //   || !transform_data.shape.matrix
  //   || !transform_data.shape.matrix[split_image_num]){return ''}
  //   return transform_data.shape.matrix[split_image_num].transform
  // }

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