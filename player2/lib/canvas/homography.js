
/**
 * canvasでホモグラフィ（射影変換）処理を行って、canvas画像データを出力する
 * type : await
 * positionは、[左上 , 右上 , 右下 , 左下]の順番で統一処理する。
 */

export class Homography{
  constructor(options){
    if(!options.corner0){return}
    this.options      = options
    this.corner_bases = this.convert_pos(options.corner0)
    this.corner_moves = this.convert_pos(options.corner1 || options.corner0)
    this.corner_bases = this.set_points_base(this.corner_bases)
    this.corner_moves = this.set_points_base(this.corner_moves)
    this.gap          = this.get_gap(this.corner_bases , this.corner_moves)
    this.corner_bases = this.get_gap_move(this.corner_bases , this.gap)
    this.corner_moves = this.get_gap_move(this.corner_moves , this.gap)
    this.transform    = this.get_transform()
  }

  get image(){
    return this.get_image_matrix()
  }

  get width(){
    return this.transform.w
  }
  get height(){
    return this.transform.h
  }

  get x(){
    return this.transform.x
  }
  get y(){
    return this.transform.y
  }

  // [左上 , 右上 , 左下 , 右下] -> [左上 , 右上 , 右下 , 左下]に変換
  convert_pos(pos){
    return [
      [pos[0].x , pos[0].y],
      [pos[1].x , pos[1].y],
      [pos[3].x , pos[3].y],
      [pos[2].x , pos[2].y],
    ]
  }
  // convert_moves(pos1,pos2){
  //   return [
  //     [pos[0].x , pos[0].y],
  //     [pos[1].x , pos[1].y],
  //     [pos[3].x , pos[3].y],
  //     [pos[2].x , pos[2].y],
  //   ]
  // }

  set_points_base(points){
    const offset = this.options.offset
    if(offset && (offset.x || offset.y)){
      for(let point of points){
        point[0] -= offset.x
        point[1] -= offset.y
      }
    }
    return points
  }
  set_points_move(points){
    const offset = this.options.offset
    if(offset && (offset.x || offset.y)){
      for(let point of points){
        point[0] -= offset.x
        point[1] -= offset.y
      }
    }
    return points
  }

  get_gap_move(pos , gap){
    for(let i=0; i<pos.length; i++){
      pos[i] = [
        pos[i][0] - gap.min.x,
        pos[i][1] - gap.min.y,
      ]
    }
    return pos
  }
  get_transform(){
    return {
      x : this.options.x,
      y : this.options.y,
      w : this.options.w + -this.gap.min.x + this.gap.max.x,
      h : this.options.h + -this.gap.min.y + this.gap.max.y,
      // nw : this.options.nw + -this.gap.min.x + this.gap.max.x,
      // nh : this.options.nh + -this.gap.min.y + this.gap.max.y,
    }
  }

  // base-posからはみ出た値を取得
  get_gap(pos0 , pos1){//console.log('gap',pos0,pos1)

    const min = {x : 0 , y : 0}
    const min_x1 = pos0[0][0] + pos1[0][0]
    const min_x2 = pos0[3][0] + pos1[3][0]
    const min_y1 = pos0[0][1] + pos1[0][1]
    const min_y2 = pos0[1][1] + pos1[1][1]
    min.x = this.get_negative_number(min_x1 , min_x2)
    min.y = this.get_negative_number(min_y1 , min_y2)

    const max = {x : 0 , y : 0}
    const max_x1 = pos1[1][0] - pos0[1][0]
    const max_x2 = pos1[2][0] - pos0[2][0]
    const max_y1 = pos1[2][1] - pos0[2][1]
    const max_y2 = pos1[3][1] - pos0[3][1]
    max.x = this.get_positive_number(max_x1 , max_x2)
    max.y = this.get_positive_number(max_y1 , max_y2)

    return {
      min : min,
      max : max,
    }
  }

  // ２つの数値の大きい方かつ0以上の数値を返す
  get_positive_number(num1 , num2){
    const num = num1 > num2 ? num1 : num2
    return num > 0 ? num : 0 
  }
  // ２つの数値の小さい方かつ0以下の数値を返す
  get_negative_number(num1 , num2){
    const num = num1 < num2 ? num1 : num2
    return num < 0 ? num : 0
  }

  get_image_matrix(){
    if(!this.transform.w
    || !this.transform.h
    || !this.options.image){return}

    try{
      const canvas = document.createElement('canvas')
      const ctx    = canvas.getContext("2d")
      // ctx.imageSmoothingEnabled = false

      canvas.width  = this.transform.w
      canvas.height = this.transform.h

      ctx.drawImage(
        this.options.image,
        -this.gap.min.x,
        -this.gap.min.y,
        this.options.w,
        this.options.h,
      )
      // console.log(-this.gap.min.x,-this.gap.min.y,this.options.w,this.options.h)

      this.canvas = canvas
      this.ctx    = ctx

      const origin  = this.corner_bases
      const markers = this.corner_moves
      // console.log(origin,markers,this.options.corner0,this.options.corner1,this.gap,this.transform)

      //射影変換パラメータを取得
      var param = this.getParam(origin, markers)
      //描画処理用に射影変換パラメータの逆行列を取得
      var mx = new Matrix44();
      mx.set(
        param[0], param[1], param[2], 0, 
        param[3], param[4], param[5], 0, 
        param[6], param[7], 1,        0, 
        0,        0,        0,        1,
      )
      mx.Invert()

      var inv_param = new Array(9)
      inv_param[0] = mx.m11
      inv_param[1] = mx.m12
      inv_param[2] = mx.m13
      inv_param[3] = mx.m21
      inv_param[4] = mx.m22
      inv_param[5] = mx.m23
      inv_param[6] = mx.m31
      inv_param[7] = mx.m32
      inv_param[8] = mx.m33

      //描画処理
      this.draw(inv_param)
      return this.canvas
    }
    catch(err){
      console.log(err)
    }
  }

  draw (param){
    // const imgX   = this.transform.x
    // const imgY   = this.transform.y
    const imgW   = this.transform.w
    const imgH   = this.transform.h
    const input  = this.ctx.getImageData(0, 0, imgW, imgH) // file://***ではerror : Uncaught DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.
    const output = this.ctx.createImageData(imgW, imgH)
    for(var i = 0; i < imgH; ++i) {
      for(var j = 0; j < imgW; ++j) {
        var tmp =   j * param[6] + i * param[7] + param[8]
        var tmpX = (j * param[0] + i * param[1] + param[2]) / tmp
        var tmpY = (j * param[3] + i * param[4] + param[5]) / tmp
        var floorX = ~~tmpX
        var floorY = ~~tmpY
        if (floorX >= 0 && floorX < imgW && floorY >= 0 && floorY < imgH) {
          var pixelData = this.getPixel(input, floorX, floorY)
          this.setPixel(output, j, i, pixelData)
        }
      }
    }
    this.ctx.putImageData(output, 0 , 0 , 0 , 0, imgW, imgH)
    return output
  }

  getParam(src, dest) {
    const Z = val => {return val == 0 ? 0.5 : val}

    var X1 = Z( src[0][0])
    var X2 = Z( src[1][0])
    var X3 = Z( src[2][0])
    var X4 = Z( src[3][0])
    var Y1 = Z( src[0][1])
    var Y2 = Z( src[1][1])
    var Y3 = Z( src[2][1])
    var Y4 = Z( src[3][1])
    var x1 = Z(dest[0][0])
    var x2 = Z(dest[1][0])
    var x3 = Z(dest[2][0])
    var x4 = Z(dest[3][0])
    var y1 = Z(dest[0][1])
    var y2 = Z(dest[1][1])
    var y3 = Z(dest[2][1])
    var y4 = Z(dest[3][1])

    //X座標
    var tx = new Matrix44()
    tx.set(
       X1, 
       Y1, 
      -X1 * x1, 
      -Y1 * x1, 
       X2, 
       Y2, 
      -X2 * x2, 
      -Y2 * x2, 
       X3, 
       Y3, 
      -X3 * x3, 
      -Y3 * x3, 
       X4, 
       Y4, 
      -X4 * x4, 
      -Y4 * x4)

    tx.Invert()
    var kx1 = tx.m11 * x1 + tx.m12 * x2 + tx.m13 * x3 + tx.m14 * x4
    var kc1 = tx.m11      + tx.m12      + tx.m13      + tx.m14
    var kx2 = tx.m21 * x1 + tx.m22 * x2 + tx.m23 * x3 + tx.m24 * x4
    var kc2 = tx.m21      + tx.m22      + tx.m23      + tx.m24
    var kx3 = tx.m31 * x1 + tx.m32 * x2 + tx.m33 * x3 + tx.m34 * x4
    var kc3 = tx.m31      + tx.m32      + tx.m33      + tx.m34
    var kx4 = tx.m41 * x1 + tx.m42 * x2 + tx.m43 * x3 + tx.m44 * x4
    var kc4 = tx.m41      + tx.m42      + tx.m43      + tx.m44

    //Y座標
    var ty = new Matrix44()
    ty.set(X1, Y1, -X1 * y1, -Y1 * y1, X2, Y2, -X2 * y2, -Y2 * y2, X3, Y3, -X3 * y3, -Y3 * y3, X4, Y4, -X4 * y4, -Y4 * y4)
    ty.Invert()
    var ky1 = ty.m11 * y1 + ty.m12 * y2 + ty.m13 * y3 + ty.m14 * y4
    var kf1 = ty.m11      + ty.m12      + ty.m13      + ty.m14
    var ky2 = ty.m21 * y1 + ty.m22 * y2 + ty.m23 * y3 + ty.m24 * y4
    var kf2 = ty.m21      + ty.m22      + ty.m23      + ty.m24
    var ky3 = ty.m31 * y1 + ty.m32 * y2 + ty.m33 * y3 + ty.m34 * y4
    var kf3 = ty.m31      + ty.m32 +      ty.m33      + ty.m34
    var ky4 = ty.m41 * y1 + ty.m42 * y2 + ty.m43 * y3 + ty.m44 * y4
    var kf4 = ty.m41      + ty.m42      + ty.m43      + ty.m44
    var det_1 = kc3 * (-kf4) - (-kf3) * kc4

    if(det_1 == 0) {
      det_1 = 0.0001
    }
    det_1 = 1 / det_1
    var param = new Array(8)
    var C = (-kf4 * det_1) * (kx3 - ky3) + (kf3 * det_1) * (kx4 - ky4)
    var F = (-kc4 * det_1) * (kx3 - ky3) + (kc3 * det_1) * (kx4 - ky4)
    param[2] = C
    param[5] = F
    param[6] = kx3 - C * kc3
    param[7] = kx4 - C * kc4
    param[0] = kx1 - C * kc1
    param[1] = kx2 - C * kc2
    param[3] = ky1 - F * kf1
    param[4] = ky2 - F * kf2
    return param
  }

  getPixel(image, u, v){
    const pixels = image.data
    const index  = image.width * v * 4 + u * 4
    if(index < 0 || pixels.length < index + 3) return {}
    return { 
      r: pixels[index + 0], 
      g: pixels[index + 1], 
      b: pixels[index + 2], 
      a: pixels[index + 3],
    }
  }

  setPixel(image, x, y, pixelData){
    const pixels = image.data
    const index  = image.width * y * 4 + x * 4
    if(index < 0 || pixels.length < index + 3) return undefined
    pixels[index + 0] = pixelData.r
    pixels[index + 1] = pixelData.g
    pixels[index + 2] = pixelData.b
    pixels[index + 3] = pixelData.a
  }
}

class Matrix44{
  constructor(){
    this.m11 = 1
    this.m12 = 0
    this.m13 = 0
    this.m14 = 0
    this.m21 = 0
    this.m22 = 1
    this.m23 = 0
    this.m24 = 0
    this.m31 = 0
    this.m32 = 0
    this.m33 = 1
    this.m34 = 0
    this.m41 = 0
    this.m42 = 0
    this.m43 = 0
    this.m44 = 1
    this.identity()
  }
  identity(){
    this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    return this
  }

  set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
    this.m11 = m11
    this.m12 = m12
    this.m13 = m13
    this.m14 = m14
    this.m21 = m21
    this.m22 = m22
    this.m23 = m23
    this.m24 = m24
    this.m31 = m31
    this.m32 = m32
    this.m33 = m33
    this.m34 = m34
    this.m41 = m41
    this.m42 = m42
    this.m43 = m43
    this.m44 = m44
    return this
  }

  multi(mx){
    var m11 = this.m11 * mx.m11 + this.m12 * mx.m21 + this.m13 * mx.m31 + this.m14 * mx.m41
    var m12 = this.m11 * mx.m12 + this.m12 * mx.m22 + this.m13 * mx.m32 + this.m14 * mx.m42
    var m13 = this.m11 * mx.m13 + this.m12 * mx.m23 + this.m13 * mx.m33 + this.m14 * mx.m43
    var m14 = this.m11 * mx.m14 + this.m12 * mx.m24 + this.m13 * mx.m34 + this.m14 * mx.m44
    var m21 = this.m21 * mx.m11 + this.m22 * mx.m21 + this.m23 * mx.m31 + this.m24 * mx.m41
    var m22 = this.m21 * mx.m12 + this.m22 * mx.m22 + this.m23 * mx.m32 + this.m24 * mx.m42
    var m23 = this.m21 * mx.m13 + this.m22 * mx.m23 + this.m23 * mx.m33 + this.m24 * mx.m43
    var m24 = this.m21 * mx.m14 + this.m22 * mx.m24 + this.m23 * mx.m34 + this.m24 * mx.m44
    var m31 = this.m31 * mx.m11 + this.m32 * mx.m21 + this.m33 * mx.m31 + this.m34 * mx.m41
    var m32 = this.m31 * mx.m12 + this.m32 * mx.m22 + this.m33 * mx.m32 + this.m34 * mx.m42
    var m33 = this.m31 * mx.m13 + this.m32 * mx.m23 + this.m33 * mx.m33 + this.m34 * mx.m43
    var m34 = this.m31 * mx.m14 + this.m32 * mx.m24 + this.m33 * mx.m34 + this.m34 * mx.m44
    var m41 = this.m41 * mx.m11 + this.m42 * mx.m21 + this.m43 * mx.m31 + this.m44 * mx.m41
    var m42 = this.m41 * mx.m12 + this.m42 * mx.m22 + this.m43 * mx.m32 + this.m44 * mx.m42
    var m43 = this.m41 * mx.m13 + this.m42 * mx.m23 + this.m43 * mx.m33 + this.m44 * mx.m43
    var m44 = this.m41 * mx.m14 + this.m42 * mx.m24 + this.m43 * mx.m34 + this.m44 * mx.m44
    this.set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
    return this
  }

  copy(src){
    this.m11 = src.m11
    this.m12 = src.m12
    this.m13 = src.m13
    this.m14 = src.m14
    this.m21 = src.m21
    this.m22 = src.m22
    this.m23 = src.m23
    this.m24 = src.m24
    this.m31 = src.m31
    this.m32 = src.m32
    this.m33 = src.m33
    this.m34 = src.m34
    this.m41 = src.m41
    this.m42 = src.m42
    this.m43 = src.m43
    this.m44 = src.m44
    return this
  }

  Invert(){
    var temp = new Matrix44()
    temp.copy(this)

    const a = temp.m11,  b = temp.m12,  c = temp.m13,  d = temp.m14
    const e = temp.m21,  f = temp.m22,  g = temp.m23,  h = temp.m24
    const i = temp.m31,  j = temp.m32,  k = temp.m33,  l = temp.m34
    const m = temp.m41,  n = temp.m42,  o = temp.m43,  p = temp.m44
    const q = a * f - b * e, r = a * g - c * e
    const s = a * h - d * e, t = b * g - c * f
    const u = b * h - d * f, v = c * h - d * g
    const w = i * n - j * m, x = i * o - k * m
    const y = i * p - l * m, z = j * o - k * n
    const A = j * p - l * n, B = k * p - l * o

    const det = 1 / (q * B - r * A + s * z + t * y - u * x + v * w)

    this.m11 = ( f * B - g * A + h * z) * det
    this.m12 = (-b * B + c * A - d * z) * det
    this.m13 = ( n * v - o * u + p * t) * det
    this.m14 = (-j * v + k * u - l * t) * det
    this.m21 = (-e * B + g * y - h * x) * det
    this.m22 = ( a * B - c * y + d * x) * det
    this.m23 = (-m * v + o * s - p * r) * det
    this.m24 = ( i * v - k * s + l * r) * det
    this.m31 = ( e * A - f * y + h * w) * det
    this.m32 = (-a * A + b * y - d * w) * det
    this.m33 = ( m * u - n * s + p * q) * det
    this.m34 = (-i * u + j * s - l * q) * det
    this.m41 = (-e * z + f * x - g * w) * det
    this.m42 = ( a * z - b * x + c * w) * det
    this.m43 = (-m * t + n * r - o * q) * det
    this.m44 = ( i * t - j * r + k * q) * det
    return this
  }
}

