// user.js
var userinfo = wx.BaaS.storage.get('userinfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "/images/user.png",
    loginStatus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (userinfo.nickName) {
      this.setData({ avatar: userinfo.avatarUrl, loginStatus: 1, nickname: userinfo.nickName })
    }
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
  
  },

  authorize: function () {
    var that = this;
    wx.openSetting({
      success: function (data) {
        if (data) {
          if (data.authSetting["scope.userInfo"] == true) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                wx.setStorageSync('ifx_baas_userinfo', data.userInfo)
                that.setData({ avatar: data.userInfo.avatarUrl, loginStatus: 1, nickname: data.userInfo.nickName })
              },
              fail: function () {
                wx.showToast({
                  title: '授权失败',
                  image: '/images/error.png'
                })
              }
            });
          }
        }
      },
      fail: function () {
        wx.showToast({
          title: '授权失败',
          image: '/images/error.png'
        })
      }
    })
  },

  myNavigateUrl: function(url) {
    userinfo = wx.BaaS.storage.get('userinfo')
    if (!userinfo.nickName) {
      wx.showToast({
        title: '请先登录',
        image: '/images/error.png'
      })
      return
    }
    
    wx.navigateTo({
      url: url,
    })
  },

  publish: function() {
    let url = '../publish/publish'
    this.myNavigateUrl(url)
  },

  myArticle: function() {
    let url = '../article/article'
    this.myNavigateUrl(url)
  },

  feedback: function() {
    let url = '../feedback/feedback'
    this.myNavigateUrl(url)
  },

  notice: function() {
    let url = '../notice/notice'
    this.myNavigateUrl(url)
  }
})