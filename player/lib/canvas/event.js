
export class CanvasEvent{
  constructor(options){
    this.options = options || {}
    this.set_mutations()
  }

  set_mutations(){
    if(!this.options.root){return}
    new MutationObserver(this.change_animation_name.bind(this))
    .observe(this.options.root , {
      attributes : true, 
      childList  : false,
      subtree    : false,
    })
  }

  get_animation_name(){
    return this.options.root.getAttribute(this.options.animation_name_attribute)
  }

  change_animation_name(e){
    const root = e[0].target
    this.animation_name = this.get_animation_name()
    this.start_view()
  }

  start_view(e){
    // console.log('animation',this.animation_name)
    // console.log(this.options)
    this.options.canvas.images.play(this.animation_name)
  }

}