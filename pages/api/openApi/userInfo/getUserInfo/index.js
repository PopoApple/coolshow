//index.js

Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
        })
      }
    })
  },
})
