

// exclusion_style_tag : svgに内包するstyleタグの除外 [true: 除外する , false: 除外しない]
const setting = {
  exclusion_style_tag : false,
}

export class SvgEmbed{
  constructor(options){
    switch(document.readyState){
      case "complete":
        this.init(options)
        break
      default:
        window.addEventListener("load" , this.init.bind(this , options))
        break
    }
  }

  init(options){
    this.options = this.setOptions(options)
    this.datas = {}
    this.start()
  }

  setOptions(options){
    const newOptions = JSON.parse(JSON.stringify(setting))
    if(options){
      for(let i in options){
        newOptions[i] = options[i]
      }
    }
    return newOptions
  }

  start(){
    this.initImg2Svg()
    this.initSvg2Svg()
  }

  // ページ内のIMGタグをsvgタグに変更
  initImg2Svg(){
    var imgTags = document.images
    for(let i=0; i<imgTags.length; i++){
      if(this.getExt(imgTags[i].src) !== 'svg'){continue}
      const src = imgTags[i].getAttribute('src')
      const ext = this.getExt(src)
      if(!ext || ext.toLowerCase() !== "svg"){continue}
      if(typeof this.datas[src] === 'undefined'){
        this.ajax(src ,(function(target , url , e){
          if(e.target.status === 404){
            console.warn('404 : '+ url)
            return
          }
          else if(e.target.readyState !== 4 || e.target.status !== 200){return}
          this.setImg2Svg(target , url , e.target.response)
        }).bind(this , imgTags[i] , src))
      }
      else{
        this.setImg2Svg(imgTags[i] , src , this.datas[src])
      }
      break
    }
  }

  setImg2Svg(target , url , data){
    const svgElement = this.vertualSvg(data)
    if(!svgElement){return}
    let svg = this.makeSvg()
    svg.innerHTML = svgElement.innerHTML
    svg = this.cutStyle(svg)
    this.setSameAttributes(svgElement , svg)
    this.setSameAttributes(target , svg)
    target.parentNode.insertBefore(svg , target)
    target.parentNode.removeChild(target)
    this.datas[url] = data
    this.initImg2Svg()
  }

  // 指定SVGタグに情報追記
  initSvg2Svg(){
    var svgFiles = document.querySelectorAll("svg[src]")
    if(!svgFiles || !svgFiles.length){return}
    for(let i=0; i<svgFiles.length; i++){
      const url = svgFiles[i].getAttribute("src")
      if(!url){continue}
      if(typeof this.datas[url] === 'undefined'){
        this.ajax(url ,(function(target , url , e){
          if(e.target.status === 404){
            console.warn('404 : '+ url)
            return
          }
          if(e.target.readyState !== 4 || e.target.status !== 200){return}
          this.setSvg2Svg(target , url , e.target.response)
        }).bind(this , svgFiles[i] , url))
      }
      else{
        this.setSvg2Svg(svgFiles[i] , url , this.datas[url])
      }
      break
    }
  }

  setSvg2Svg(target , url , data){
    if(!target || !url || !data){return}
    const svgElement = this.vertualSvg(data)
    if(!svgElement){return}
    target.innerHTML = svgElement.innerHTML
    target = this.cutStyle(target)
    target.removeAttribute("src")
    this.setSameAttributes(svgElement , target)
    this.datas[url] = data
    this.initSvg2Svg()
  }

  makeSvg(){
    return document.createElementNS("http://www.w3.org/2000/svg" , "svg")
  }

  setSameAttributes(baseElm , targetElm){
    if(!baseElm || !targetElm){return}
    const attributes = baseElm.attributes
    if(!attributes || !attributes.length){return}
    for(let attr of attributes){
      if(attr.nodeName === 'src'){continue}
      targetElm.setAttribute(attr.nodeName , attr.nodeValue)
    }
  }

  getExt(path){
    if(!path){return}
    const sp1 = path.split("#")
    const sp2 = sp1[0].split("?")
    const sp3 = sp2[0].split(".")
    return sp3[sp3.length-1]
  }

  cutStyle(elm){
    if(this.options.exclusion_style_tag){
      var styles = elm.getElementsByTagName("style");
      for(var i=styles.length-1; i>=0; i--){
        styles[i].parentNode.removeChild(styles[i]);
      }
    }
    return elm
  }

  // 仮想DOM（SVG)を構築
  vertualSvg(html){
    const div = document.createElement("div")
    div.innerHTML = html
    const elms = div.getElementsByTagName("svg")
    return elms.length ? elms[0] : null
  }

  ajax(src , proc){
    // try{
      const req = new XMLHttpRequest()
      req.open('GET' , src , true)
      req.setRequestHeader('Content-Type', 'text/plane');
      // req.onreadystatechange = proc
      // req.addEventListener('readystatechange' , proc , false)
      req.addEventListener('load' , proc , false)
    // req.onreadystatechange = ((proc , e)=>{
    //   proc(e)
    // }).bind(this , proc)
      req.send()
    // } catch(err){
    //   console.warn(err)
    // }
  }
}
