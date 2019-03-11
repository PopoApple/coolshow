// pages/api/openApi/auth/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getSettingRes: null,
    authorizeSucRes: null,
    authorizeRes: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: (getSettingRes) => {
        this.setData({
          getSettingRes: JSON.stringify(getSettingRes),
        })
        //if (!getSettingRes.authSetting['scope.userInfo']) {
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success: (authorizeSucRes) => {
          //     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问

          //     this.setData({
          //       authorizeSucRes: JSON.stringify(authorizeSucRes),
          //     })
          //   },
          //   complete: (authorizeRes) => {
          //     this.setData({
          //       authorizeRes: JSON.stringify(authorizeRes),
          //     })
          //   }
          // })
        //}
      }
    })
  },

  toAuth() {
    console.log(123)
    // wx.authorize({
    //   scope: 'scope.userInfo',
    //   success: (authorizeSucRes) => {
    //     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问

    //     this.setData({
    //       authorizeSucRes: JSON.stringify(authorizeSucRes),
    //     })
    //   },
    //   complete: (authorizeRes) => {
    //     this.setData({
    //       authorizeRes: JSON.stringify(authorizeRes),
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})