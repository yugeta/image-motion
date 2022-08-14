import { Options } from './options.js'
import { Common }  from './common.js'
import { Event }   from './event.js'
import { Init }    from './init.js'

Options.common = new Common()
Options.event  = new Event()


/**
 * [memo]
 *  上部,Optionsは、parent.main.optionsで取得できる。
 */

// データ部分を接続する。
Options.sounds = parent.main.options.sounds
new Init()