import * as sylvester from './sylvester/sylvester.mod.js'

// 参考 : https://qiita.com/as_kuya/items/45bc930b11123e3f072b
export class M_Matrix{
  constructor(prev_position , next_position){

    const prev = this.convert_positions(prev_position)
    const next = this.convert_positions(next_position)

    const M = []
    const V = []
    for(let i=0; i<=3; i++) {
      let x = prev[i][0]
      let y = prev[i][1]
      let a = next[i][0]
      let b = next[i][1]
      M.push([x, y, 1, 0, 0, 0, -x*a, -y*a])
      M.push([0, 0, 0, x, y, 1, -x*b, -y*b])
      V.push(a)
      V.push(b)
    }
    const v2  = sylvester.$V(V)
    const ans = sylvester.$M(M).inv().x(v2);
    this.transform = this.get_answer(ans)
    this.perspective = 1
  }

  get_answer(ans){
    const z = 1
    const a = ans.e(1)
    const b = ans.e(2)
    const c = ans.e(3)
    const d = ans.e(4)
    const e = ans.e(5)
    const f = ans.e(6)
    const g = ans.e(7)
    const h = ans.e(8)
    let transform = ''
    transform += `perspective(${z}px)`
    transform += 'scaleZ(-1)'
    transform += `translateZ(-${z}px)`
    transform += 'matrix3d('
    transform += `${a},${d},${g},0,`
    transform += `${b},${e},${h},0,`
    transform += `${c},${f},1,0,`
    transform += `0,0,0,1)`
    transform += `translateZ(${z}px)`
    return transform
  }

  get_center_position(pos){
    const P1 = pos.top_left
    const P2 = pos.top_right
    const P3 = pos.bottom_right
    const P4 = pos.bottom_left

    var S1 = ((P4.x-P2.x)*(P1.y-P2.y)-(P4.y-P2.y)*(P1.x-P2.x))*0.5
    var S2 = ((P4.x-P2.x)*(P2.y-P3.y)-(P4.y-P2.y)*(P2.x-P3.x))*0.5

    return {
      x : P1.x + (P3.x-P1.x)*(S1/(S1 + S2)),
      y : P1.y + (P3.y-P1.y)*(S1/(S1 + S2)),
    }
  }

  convert_array(pos){
    return [
      [
        pos.top_left.x,
        pos.top_left.y
      ],
      [
        pos.top_right.x, 
        pos.top_right.y,
      ],
      [
        pos.bottom_left.x, 
        pos.bottom_left.y,
      ],
      [
        pos.bottom_right.x, 
        pos.bottom_right.y,
      ],
    ]
  }

  convert_positions(pos){
    return [
      [
        pos[0].x,
        pos[0].y
      ],
      [
        pos[1].x, 
        pos[1].y,
      ],
      [
        pos[3].x, 
        pos[3].y,
      ],
      [
        pos[2].x, 
        pos[2].y,
      ],
      
    ]
  }
}