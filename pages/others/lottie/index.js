import lottie from './lottie-miniapp'
import animationData from './data.js'

// pages/others/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  error(e) {
    console.error(e)
  },
  onReady: function () {
    const canvasContext = wx.createCanvasContext('test-canvas');
    //  请求到的lottie json数据
    //const animationData = {};
    // 请求lottie的路径。注意开启downloadFile域名并且返回格式是json
    const animationPath = 'https://assets3.lottiefiles.com/packages/lf20_tB6xnL.json';

    // 指定canvas大小
    canvasContext.canvas = {
      width: 100,
      height: 100
    };
    lottie.loadAnimation({
      renderer: 'canvas', // 只支持canvas
      loop: true,
      autoplay: true,
      animationData: animationData,
      path: animationPath,
      rendererSettings: {
        context: canvasContext,
        clearCanvas: true
      }
    });
    // const canvasContext = wx.createCanvasContext('test-canvas')
    // const ctx = canvasContext
    // // proxyCtx(ctx)
    // lottieTest(ctx, this.options)
    // console.log(222, canvasContext)
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
function lottieTest(canvasContext, opts) {

  const systemInfo = wx.getSystemInfoSync()

  const context = canvasContext

  canvasContext.canvas = {
    width: systemInfo.windowWidth,
    height: systemInfo.windowHeight
  }

  Object.defineProperty(canvasContext, 'globalAlpha', {
    get() {
      return this._globalAlpha
    },
    set(value) {
      this._globalAlpha = value
    }
  })
  canvasContext.globalAlpha = 1
  const { path } = opts
  console.log(1111, opts)
  lottie.loadAnimation({
    renderer: 'canvas',
    loop: true,
    autoplay: true,
    animationData: animationData,
    path,
    rendererSettings: {
      context: canvasContext,
      clearCanvas: true
    }
  })
}