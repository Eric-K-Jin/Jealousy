  //app.js
App({
  onLaunch: function() {
    //引入知晓云SDK
    require('./sdk-v1.0.6')
    //初始化SDK
    wx.BaaS.init('06eaaf834dc546a87c1a')

    wx.BaaS.login().then((res) => {
      // wx.BaaS.storage.set('userInfo', {nickname: res.nickName, avatar: res.avatarUrl})
    }, (err) => {
      wx.showToast({
        title: '系统错误',
      })
    })

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})