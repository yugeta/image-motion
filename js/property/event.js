import { Options } from '../options.js'

export function mousedown(e){
  const area = Options.elements.upper_selector(e.target , `[name='property']`)
  if(!area){return}

  // trash
  const trash = Options.elements.upper_selector(e.target , `[name='property'] .trash`)
  if(trash){
    const uuid = Options.elements.get_info_uuid()
    Options.property_trash = uuid
  }
}

export function mousemove(e){
  // if(!Options.property_trash){return}

}

export function mouseup(e){
  if(!Options.property_trash){return}
  del_item()
}

function del_item(){
  if(confirm('選択している画像と、階層に含まれる画像も削除されます。よろしいですか？（この操作は取り消せません）')){
    const uuid = Options.property_trash
    Options.lists.del(uuid)
    Options.img_datas[uuid].del()
  }
  delete Options.property_trash
}
