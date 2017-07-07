// feedback.js
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

  nameInput: function(e) {
    let _this = this
    _this.setData({
      name: e.detail.value
    })
  },

  contentInput: function(e) {
    let _this = this
    _this.setData({
      content: e.detail.value
    })
  },

  contactInput: function(e) {
    let _this = this
    _this.setData({
      contact: e.detail.value
    })
  },

  qqorwechatInput: function(e) {
    let _this = this
    _this.setData({
      qqorwechat: e.detail.value
    })
  },

  submitFeedback: function() {
    let _this = this
    let tableID = 229
    let data = {
      name: _this.data.name,
      content: _this.data.content,
      contact: _this.data.contact,
      qqorwechat: _this.data.qqorwechat
    }
    let objects = {
      tableID,
      data
    }
    wx.BaaS.createRecord(objects).then((res) => {
      wx.showToast({
        title: '提交成功'
      })
      wx.switchTab({
        url: '/pages/user/user',
      })
    }, (err) => {
      wx.showToast({
        title: '系统错误',
        image: '/images/error.png'
      })
    })
  }
})