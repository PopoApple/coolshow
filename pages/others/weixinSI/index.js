// pages/plugin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: 'xx',
    texts: '',
  },
  count: 0,
  startTime: null,
  lastStr: '',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.startTime = (new Date()).getTime()
    var plugin = requirePlugin("WechatSI")
    let manager = plugin.getRecordRecognitionManager()
    manager.onRecognize = (res) => {
      console.log("current result", (new Date()).getTime() - this.startTime, res.result)
      this.setData({ text: this.data.text + res.result })
      const r = res.result
      if (r !== this.lastStr) {
        console.log(111, r, this.lastStr)
        const dStr = r.replace(this.lastStr, '')
        this.lastStr = r
        this.setData({ texts: this.data.texts + ',' + dStr })
      }
    }
    manager.onStop = (res) => {
      console.log("record file path", res.tempFilePath)
      console.log("result", res.result)
      this.setData({ text: this.data.text + this.count + ' -- stop -- res.tempFilePath' })
      if (this.count < 3) {
        manager.start({ duration: 30000, lang: "zh_CN" })
        this.count = this.count + 1
      }
    }
    manager.onStart = (res) => {
      this.setData({ text: 'start -- ' })
      console.log("成功开始录音识别", res)
    }
    manager.onError = (res) => {
      console.error("error msg", res.msg)
    }
    manager.start({ duration: 30000, lang: "zh_CN" })
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