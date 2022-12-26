export const Options = {
  type : 'canvas', // [canvas(defaunt) , html]
  service_name : 'image-motion',
  animation_name_attribute : 'data-action',
  animation_duration : 0.05, // shapeアニメーションの処理タイミング(s)
  style_types : ['posx','posy','posz','scale','rotate' , 'opacity'],
  transform_types : ['posx','posy','posz','scale','rotate'],
  shapes : {},
  mutation : true,
}
