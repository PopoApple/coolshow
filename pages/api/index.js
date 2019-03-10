Page({
  data: {
    list: [
      {
        id: 'basic',
        name: '基础',
        open: false,
        pages: [
          { id: 'canIUse', name: 'wx.canIUse' },
          { id: 'system', name: '系统' },
          { id: 'update', name: '更新' },
          { id: 'miniProgram', name: '小程序' },
          { id: 'timer', name: '定时器' },
          { id: 'debug', name: '调试' },
        ]
      },
      {
        id: 'router',
        name: '路由',
        open: false,
        pages: [
          { id: 'switchTab', name: 'wx.switchTab' },
          { id: 'reLaunch', name: 'wx.reLaunch' },
          { id: 'redirectTo', name: 'wx.redirectTo' },
          { id: 'navigateTo', name: 'wx.navigateTo' },
          { id: 'navigateBack', name: 'wx.navigateBack' },
        ]
      },
      {
        id: 'interface',
        name: '界面',
        open: false,
        pages: [
          { id: 'interactive', name: '交互' },
          { id: 'nav', name: '导航栏' },
          { id: 'tabBar', name: 'Tab Bar' },
          { id: 'font', name: '字体' },
          { id: 'pullDownRefresh', name: '下拉刷新' },
          { id: 'animate', name: '动画' },
          { id: 'setTop', name: '置顶' },
          { id: 'customComponent', name: '自定义组件' },
          { id: 'menu', name: '菜单' },
          { id: 'window', name: '窗口' },
        ]
      },
      {
        id: 'media',
        name: '媒体',
        open: false,
        pages: [
          { id: 'map', name: '地图' },
          { id: 'image', name: '图片' },
          { id: 'video', name: '视频' },
          { id: 'audio', name: '音频' },
          { id: 'bgAudio', name: '背景音频' },
          { id: 'realTimeAudioVideo', name: '实时音视频' },
          { id: 'record', name: '录音' },
          { id: 'camera', name: '相机' },
        ]
      },
      {
        id: 'location',
        name: '位置',
        open: false,
        pages: [
          { id: 'openLocation', name: 'wx.openLocation' },
          { id: 'getLocation', name: 'wx.getLocation' },
          { id: 'chooseLocation', name: 'wx.chooseLocation' },
        ]
      },
      {
        id: 'share',
        name: '转发',
        open: false,
        pages: [
          { id: 'updateShareMenu', name: 'wx.updateShareMenu' },
          { id: 'showShareMenu', name: 'wx.showShareMenu' },
          { id: 'hideShareMenu', name: 'wx.hideShareMenu' },
          { id: 'getShareInfo', name: 'wx.getShareInfo' },
        ]
      },
      {
        id: 'canvas',
        name: '画布',
        open: false,
        pages: [
          { id: 'createCanvasContext', name: 'wx.createCanvasContext' },
          { id: 'canvasToTempFilePath', name: 'wx.canvasToTempFilePath' },
          { id: 'canvasPutImageData', name: 'wx.canvasPutImageData' },
          { id: 'canvasGetImageData', name: 'wx.canvasGetImageData' },
          { id: 'canvasContent', name: 'CanvasContent' },
          { id: 'canvasGradient', name: 'CanvasGradient' },
          { id: 'color', name: 'Color' },
        ]
      },
      {
        id: 'file',
        name: '文件',
        open: false,
        pages: [
          { id: 'saveFile', name: 'wx.saveFile' },
          { id: 'removeSavedFile', name: 'wx.removeSavedFile' },
          { id: 'openDocument', name: 'wx.openDocument' },
          { id: 'getSavedFileList', name: 'wx.getSavedFileList' },
          { id: 'getSavedFIleInfo', name: 'wx.getSavedFIleInfo' },
          { id: 'getFileSystemManager', name: 'wx.getFileSystemManager' },
          { id: 'getFileInfo', name: 'wx.getFileInfo' },
          { id: 'fileSystemManage', name: 'FileSystemManage' },
          { id: 'stats', name: 'Stats' },
        ]
      },
      {
        id: 'openApi',
        name: '开放接口',
        open: false,
        pages: [
          { id: 'login', name: '登录' },
          { id: 'miniProgramJump', name: '小程序跳转' },
          { id: 'accountInfo', name: '账号信息' },
          { id: 'userInfo', name: '用户信息' },
          { id: 'dataReport', name: '数据上报' },
          { id: 'dataAnalytics', name: '数据分析' },
          { id: 'payment', name: '支付' },
          { id: 'auth', name: '授权' },
          { id: 'seting', name: '设置' },
          { id: 'address', name: '收货地址' },
          { id: 'card', name: '卡券' },
          { id: 'invocie', name: '发票' },
          { id: 'soterAuth', name: '生物认证' },
          { id: 'sport', name: '微信运动' },
        ]
      },
      {
        id: 'device',
        name: '设备',
        open: false,
        pages: [
          { id: 'iBeacon', name: 'iBeacon' },
          { id: 'wifi', name: 'wifi' },
          { id: 'contact', name: '联系人' },
          { id: 'lightBluetooth', name: '低功耗蓝牙' },
          { id: 'bluetooth', name: '蓝牙' },
          { id: 'battery', name: '电量' },
          { id: 'clipboard', name: '剪贴板' },
          { id: 'nfc', name: 'NFC' },
          { id: 'network', name: '网络' },
          { id: 'screen', name: '屏幕' },
          { id: 'phone', name: '电话' },
          { id: 'accelerometer', name: '加速计' },
          { id: 'compass', name: '罗盘' },
          { id: 'deviceMotion', name: '设备方向' },
          { id: 'gyroscope', name: '陀螺仪' },
          { id: 'performance', name: '性能' },
          { id: 'scanCode', name: '扫码' },
          { id: 'vibrate', name: '振动' },
        ]
      },
      {
        id: 'worker',
        name: 'Worker',
        open: false,
        pages: [
          { id: 'createWorker', name: 'wx.createWorker' },
          { id: 'worker', name: 'Worker' },
        ]
      },
      {
        id: 'thirdPartyPlatform',
        name: '第三方平台',
        open: false,
        pages: [
          { id: 'getExtConfigSync', name: 'wx.getExtConfigSync' },
          { id: 'getExtConfig', name: 'getExtConfig' },
        ]
      },
      {
        id: 'wxml',
        name: 'WXML',
        open: false,
        pages: [
          { id: 'createSelectorQuery', name: 'wx.createSelectorQuery' },
          { id: 'createIntersectionObserver', name: 'wx.createIntersectionObserver' },
          { id: 'intersectionObserver', name: 'IntersectionObserver' },
          { id: 'nodesRef', name: 'NodesRef' },
          { id: 'selectotQuery', name: 'SelectotQuery' },
        ]
      },
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
});
