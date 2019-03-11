const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
  },
  onTap: (e) => {
    console.log(e, 'onTap')
  },
  onParentTap: () => {
    console.log('onParentTap')
  }
})
