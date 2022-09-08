export const Options = {
  versions     : {
    main : 1, // メインバージョン
    sub  : 2, // サブバージョン
    revision : 0, // gitの任意branch(git_target)の最終コミットhash値
    git_target : 'master',
  },

  center_size : 20,
  
  // datas       : {}, // images , animations
  cache        : {}, // key:uuid
  animations   : {},
  sounds       : [],
  images       : [],
  img_datas    : {},
  storage_name : 'image_motion',

  trans_datas  : {},

  save_file_extension : '.json',

  sound_elms   : [],
}
