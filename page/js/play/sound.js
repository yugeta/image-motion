
export class Sound{
  constructor(main , animation_name){
    this.main = main
    this.animation_name = animation_name
  }

  get animation_all_datas(){
    return this.main.datas.animations[this.animation_name] || null
  }
  get animation_datas(){
    const animation_data = this.animation_all_datas
    if(!animation_data || !animation_data.items){return}
    const animation_datas = []
    for(let uuid in animation_data.items){
      const keyframe_datas = animation_data.items[uuid].keyframes
      for(let keyframe in keyframe_datas){
        if(!keyframe_datas[keyframe].sound){continue}
        animation_datas.push({
          keyframe : Number(keyframe || 0),
          image : uuid,
          sound : keyframe_datas[keyframe].sound,
        })
      }
    }
    return animation_datas
  }

  get use_sounds(){
    const animation_data = this.animation_all_datas
    if(!animation_data || !animation_data.items){return}
    const sound_lists = []
    for(let uuid in animation_data.items){
      const keyframe_datas = animation_data.items[uuid].keyframes
      // console.log(uuid , animation_data.items[uuid])
      for(let keyframe in keyframe_datas){
        if(keyframe_datas[keyframe].sound){
          sound_lists.push(keyframe_datas[keyframe].sound)
        }
      }
    }
    // arrayのunique処理
    return sound_lists.filter((elem, index, self) => self.indexOf(elem) === index)
  }

  get sound_datas(){
    return this.main.datas.sounds
  }

  get datas(){
    const sound_uuids = this.use_sounds
    if(!sound_uuids){return null}
    const sound_datas = this.sound_datas
    const lists = sound_datas.filter(e => sound_uuids.indexOf(e.uuid) !== -1)
    return lists.length ? lists : null
  }
}