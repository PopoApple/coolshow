Page({
  data: {
    x: 0,
    y: 0,
    scale: 2,
  },
  tap(e) {
    this.setData({
      x: 30,
      y: 30
    })
  },
  tap2() {
    this.setData({
      scale: 3
    })
  },
  onChange(e) {
    console.log(e.detail)
  },
  onScale(e) {
    console.log(e.detail)
  },
  onOutOfBoundsChange: e => {
    console.log('onOutOfBoundsChange', e)
  },
  onTouchmove: e => {
    //console.log('onTouchmove', e)
  },
  onHtouchmove: e => {
    console.log('onHtouchmove', e)
  }
})