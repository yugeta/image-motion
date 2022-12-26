

export class SortImages{
  constructor(options , animation_name='' , keyframe=0){
    this.options = options || null
    this.animation_name = animation_name
    this.keyframe       = keyframe
    this.set_posz()
    // console.log(this.datas)
  }

  get datas(){
    return this.get_z_sort_images()
  }

  // poszの値を元に、表示順番を並び替える（同数の場合は、書かれた絢に上に被さる）: 階層構造に準じた並び順
  get_z_sort_images(){
    let newImages =  this.get_sort_images()
    newImages.sort(this.get_z_sort)
    this.images = newImages
    return this.images
  }

  get_sort_images(target_uuid){
    const children = this.get_children(target_uuid)
    let new_datas = []
    for(let i=0; i<children.length; i++){
      const child      = children[i]
      let grand_children = this.get_sort_images(child.uuid)
      if(grand_children.length){
        // 上位より下表示のフラグ
        let flg = true
        const before_children = []
        const after_children  = []
        for(let grand_child of grand_children){
          if(child.uuid === grand_child.parent){
            if(grand_child.order < 0){
              flg = true
            }
            else{
              flg = false
            }
          }
          if(flg){
            before_children.push(grand_child)
          }
          else{
            after_children.push(grand_child)
          }
        }
        new_datas = [...new_datas , ...before_children , child , ...after_children]
      }
      else{
        new_datas.push(child)
      }
    }
    return new_datas
  }

  get_children(target_uuid){
    return this.options.data.images.filter(e => e.parent == target_uuid).sort(this.get_order_sort)
  }
  get_order_sort(a , b){
    if(a.order < b.order) return -1
    if(a.order > b.order) return +1
    return 0
  }
  get_z_sort(a , b){
    if(a.z < b.z) return -1
    if(a.z > b.z) return +1
    return 0
  }

  set_posz(){
    for(let image of this.options.data.images){
      image.z = 0
    }
    for(let image of this.options.data.images){
      const posz  = image.posz || 0
      const anim  = this.get_animation_posz_data(image.uuid) || 0
      image.z += posz + anim
      // 子階層にも適用
      if(posz + anim){
        this.set_posz_children(image.uuid , posz + anim)
      }
    }
  }
  set_posz_children(uuid , add_z){
    const children = this.get_children(uuid)
    if(!children || !children.length){return}
    for(let child of children){
      child.z += add_z
      this.set_posz_children(child.uuid , add_z)
    }
  }

  get_animation_posz_data(uuid){
    const anim = this.options.data.transform_animation
    if(this.animation_name
    && anim[this.animation_name]
    && anim[this.animation_name][this.keyframe]
    && anim[this.animation_name][this.keyframe][uuid]
    && anim[this.animation_name][this.keyframe][uuid].z){
      return anim[this.animation_name][this.keyframe][uuid].z
    }
    else{
      return 0
    }
  }


}