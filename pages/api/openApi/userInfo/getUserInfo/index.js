//index.js

Page({
  data: {
    res: null,
    error: null,
    x: null,
    done: false,
    userInfo: {},
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        console.log(res)
        this.setData({
          res: JSON.stringify(res),
          userInfo: res.userInfo,
        })
      },
      fail: error => {
        console.log(error)
        this.setData({
          error: JSON.stringify(error),
        })
      },
      complete: (x) => {
        this.setData({
          x: JSON.stringify(x),
          done: true,
        })
      }
    })
  },
})
