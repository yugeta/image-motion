import { Homography } from './homography.js'

export class Shape{
  constructor(options , uuid , animation_name='' , keyframe=0){
    this.options        = options
    this.uuid           = uuid
    this.animation_name = animation_name
    this.keyframe       = keyframe
    this.image          = this.make()
  }

  get is(){
    if(!this.animation_name){
      return false
    }
    const data = this.get_uuid2images(this.uuid)
    return data.shape_use ? true : false
  }

  get base_points(){
    const datas = this.options.data.shape[this.uuid]
    if(!datas){return}
    const res = []
    for(const i in datas){
      res.push(datas[i].corners)
    }
    return res
  }

  get move_points(){
    const transform = this.options.data.animations
    if(!transform[this.animation_name]
    || !transform[this.animation_name].items
    || !transform[this.animation_name].items[this.uuid]
    || !transform[this.animation_name].items[this.uuid].keyframes
    || !transform[this.animation_name].items[this.uuid].keyframes[this.keyframe]
    || !transform[this.animation_name].items[this.uuid].keyframes[this.keyframe].shape){return null}
    return transform[this.animation_name].items[this.uuid].keyframes[this.keyframe].shape.points

  }
  
  get shape_table(){
    const data = this.get_uuid2images(this.uuid)
    return data.shape_table
  }

  // get gap(){
  //   if(this.gap_data){
  //     return this.gap_data
  //   }
  //   else{
  //     return {
  //       min : {x:0,y:0},
  //       max : {x:0,y:0},
  //     }
  //   }
  // }

  // uuidからimageデータを取得
  get_uuid2images(uuid){
    if(!uuid){return}
    return this.options.data.images.find(e => e.uuid === uuid)
  }

  get_animation_data(uuid){
    if(!uuid){return}
    const name = this.animation_name
    const anim = this.options.data.animations
    if(anim
    && anim[name]
    && anim[name].items
    && anim[name].items[uuid]
    && anim[name].items[uuid].keyframes){
      return anim[name].items[uuid].keyframes
    }
  }

  make(){
    if(!this.is){return}
    this.create_canvas()
    this.set_property()
    return this.make_shapes()
  }

  // canvas作成
  create_canvas(){
    this.canvas = document.createElement('canvas')
    this.ctx    = this.canvas.getContext("2d", { storage: "discardable" })
  }

  // 画像のtransform設定
  set_property(){
    const w = this.options.root.width
    const h = this.options.root.height
    this.canvas.width  = this.options.scale.fit.width
    this.canvas.height = this.options.scale.fit.height
    // width-fit
    if(this.options.scale.fit.width / w > this.options.scale.fit.height / h){
      this.canvas.style.setProperty('width'  , `${w}px`  , '')
    }
    // height-fit
    else{
      this.canvas.style.setProperty('height' , `${h}px` , '')
    }
  }
  make_shapes(){
    const data = this.get_uuid2images(this.uuid)
    // if(this.animation_name === 'sit'){
    //   console.log(this.keyframe , data)
    // }
    const shape_table = this.shape_table
    if(!shape_table || !shape_table.x || !shape_table.y){return}
    
    data.nw = data.element.naturalWidth
    data.nh = data.element.naturalHeight
    if(!data.nw || !data.nh){return}
    
    const split = {
      w  : data.w  / shape_table.x,
      h  : data.h  / shape_table.y,
      nw : data.nw / shape_table.x,
      nh : data.nh / shape_table.y,
      scale_x : data.w / data.nw,
      scale_y : data.h / data.nh,
    }

    const corners_base = this.base_points
    const corners_move = this.move_points || this.get_between_datas()
    if(!corners_base || !corners_base.length || !corners_move || !corners_move.length){return}
    let num = 0
    const split_images = []
    for(let y=0; y<shape_table.y; y++){
      for(let x=0; x<shape_table.x; x++){
        // const fill_add = {
        //   x : x < shape_table.x-1 ? 10 : 0,
        //   y : y < shape_table.y-1 ? 10 : 0,
        // }
        // console.log(x,y,fill_add)

        let split_image = this.get_split_image({
          image : data.element,
          x     : split.nw * x,
          y     : split.nh * y,
          w     : split.nw,
          h     : split.nh,
        })

        const homography = new Homography({
          image   : split_image,
          corner0 : corners_base[num],
          corner1 : corners_move[num],
          x       : 0,
          y       : 0,
          w       : split.w,
          h       : split.h,
          offset  : {
            x : split.w * x,
            y : split.h * y,
          },
        })
        // const homography = new Homography({
        //   image   : split_image,
        //   corner0 : this.get_corner_scale(corners_base[num] , split),
        //   corner1 : this.get_corner_scale(corners_move[num] , split),
        //   x       : 0,
        //   y       : 0,
        //   w       : split.nw,
        //   h       : split.nh,
        //   offset  : {
        //     x : split.nw * x * split.scale_x,
        //     y : split.nh * y * split.scale_y,
        //   },
        // })
        if(!homography.image){return}
        split_images.push(homography)

        num++
      }
    }
    return this.get_merge_image(split_images , shape_table , data , split)
  }

  get_corner_scale(corners , split){
    // console.log(corners)
    const newCorner = []
    for(let corner of corners){
      newCorner.push({
        x : corner.x * split.scale_x,
        y : corner.y * split.scale_y,
      })
    }
    return newCorner
  }

  get_merge_image(images , table , data , split){
    const canvas    = document.createElement('canvas')
    const ctx       = canvas.getContext("2d", { storage: "discardable" })
    const total_gap = this.get_total_gap(table , images)
    canvas.width    = data.w - total_gap.min.x + total_gap.max.x
    canvas.height   = data.h - total_gap.min.y + total_gap.max.y
    
    // // debug
    // ctx.fillStyle = 'white'
    // ctx.fillRect(0,0,canvas.width,canvas.height)

    let num = 0
    for(let y=0; y<table.y; y++){
      for(let x=0; x<table.x; x++){
        const fill_add = {
          x : x < table.x-1 ? 1 : 0,
          y : y < table.y-1 ? 1 : 0,
        }
        const image = images[num]
        const transform = {
          x : split.w * x - total_gap.min.x + image.gap.min.x,
          y : split.h * y - total_gap.min.y + image.gap.min.y,
          w : split.w     - image.gap.min.x + image.gap.max.x,
          h : split.h     - image.gap.min.y + image.gap.max.y,
        }
        ctx.drawImage(
          images[num].image,
          transform.x,
          transform.y,
          transform.w + fill_add.x,
          transform.h + fill_add.y,
        )
        // console.log(transform)
        num++
      }
    }
    this.gap = total_gap

    // const image_data = this.get_uuid2images(this.uuid)
    // image_data.gap = total_gap

    // debug
    // ctx.fillStyle = 'rgba(0,0,255,0.5)'
    // ctx.fillRect(
    //   -total_gap.min.x,
    //   -total_gap.min.y,
    //   canvas.width + total_gap.max.x,
    //   canvas.height + total_gap.max.y
    // )

    return canvas
  }
  get_split_image(data){
    const canvas  = document.createElement('canvas')
    const ctx     = canvas.getContext("2d", { storage: "discardable" })
    canvas.width  = data.w || 1
    canvas.height = data.h || 1
    ctx.drawImage(
      data.image,
      data.x, data.y, 
      data.w, data.h, 
      0, 0,
      data.w, data.h,
    )
    return canvas
  }
  get_total_gap(table , images){
    const total_gap = {
      min:{x:0,y:0},
      max:{x:0,y:0},
    }
    let num = 0
    for(let y=0; y<table.y; y++){
      for(let x=0; x<table.x; x++){
        // min-x
        if(x === 0){
          total_gap.min.x = total_gap.min.x > images[num].gap.min.x ? images[num].gap.min.x : total_gap.min.x
        }
        // max-x
        if(x === table.x-1){
          total_gap.max.x = total_gap.max.x < images[num].gap.max.x ? images[num].gap.max.x : total_gap.max.x
        }

        // min-y
        if(y === 0){
          total_gap.min.y = total_gap.min.y > images[num].gap.min.y ? images[num].gap.min.y : total_gap.min.y
        }
        // max-y
        if(y === table.y-1){
          total_gap.max.y = total_gap.max.y < images[num].gap.max.y ? images[num].gap.max.y : total_gap.max.y
        }

        num++
      }
    }
    return total_gap
  }

  get_between_datas(){
    const animation_type = 'shape'
    const datas = []
    const anim_datas = this.get_animation_data(this.uuid)
    if(anim_datas){
      for(const keyframe in anim_datas){
        if(anim_datas[keyframe][animation_type] === undefined){continue}
        datas.push({
          frame : Number(keyframe),
          points : anim_datas[keyframe][animation_type].points,
        })
      }
    }

    // 値がない場合は、デフォルト値を返す
    if(!datas.length){
      return []
    }
    // 値が1つしかセットされていない場合は、セットされている単一値を返す
    if(datas.length === 1){
      this.set_image_link(datas[0].frame)
      return null
    }
    // keyframeが先頭データよりも前の場合は、先頭データ値を返す
    if(datas[0].frame > this.keyframe){
      this.set_image_link(datas[0].frame)
      return null
    }
    // keyframeが最終データよりも後の場合は、先頭データ値を返す
    if(datas[datas.length-1].frame < this.keyframe){
      this.set_image_link(datas[datas.length-1].frame)
      return null
    }

    // 中間値の値をframe比率に応じて返す
    datas.push({frame : this.keyframe})
    datas.sort((a,b)=>{
      if(a.frame < b.frame) return -1
      if(a.frame > b.frame) return +1
      return 0;
    })
    const index = datas.findIndex(e => e.frame === this.keyframe)
    if(index === -1){return}
    if(index === 0){
      return null
    }
    const current = datas[index]
    const prev = datas[index-1]
    const next = datas[index+1]

    // fromt-toで同じ値の場合は、データをリンクする。
    const same_flg = this.check_same_points(prev.points , next.points)
    if(same_flg === true){
      this.set_image_link(prev.frame)
      return null
    }
    const rate = (current.frame - prev.frame) / (next.frame - prev.frame)
    const res_array = []
    for(let i=0; i<prev.points.length; i++){
      const new_data = [];
      for(let j=0; j<prev.points[i].length; j++){
        const prev_data = prev.points[i][j]
        const next_data = next.points[i][j]
        const diff = {
          x : next_data.x - prev_data.x,
          y : next_data.y - prev_data.y,
        }
        new_data.push({
          x : diff.x * rate + prev_data.x,
          y : diff.y * rate + prev_data.y,
        })
      }
      res_array.push(new_data)
    }
    return res_array
  }

  check_same_points(points1 , points2){
    let flg = 0
    for(let i=0; i<points1.length; i++){
      for(let j=0; j<points1[i].length; j++){
        const a = points1[i][j]
        const b = points2[i][j]
        if(a.x !== b.x || a.y !== b.y){
          flg ++
        }
      }
    }
    if(flg === 0){
      return true
    }
    else{
      return false
    }
  }

  // 変化のないアニメーションは、参照するフレーム数を登録して、処理（メモリ）軽減をする
  set_image_link(target_frame){
    this.image_link = target_frame
  }

}
