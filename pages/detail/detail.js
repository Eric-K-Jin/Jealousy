// detail.js
var id, comments, page = 1, limit = 5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    content: '',
    hide: 'hide',
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id
    wx.BaaS.storage.set("article_id", id)
    let that = this
    let tableID = 216
    let recordID = id
    let objects = {
      tableID,
      recordID
    };
    wx.BaaS.getRecord(objects).then((res) => {
      // console.log(res)
      that.setData({detail: res.data.content})
    }, (err) => {
      wx.showToast({
        title: '系统错误',
      })
    });

    let offset = limit * (page - 1)
    objects = {
      tableID: 221,
      article_id: wx.BaaS.storage.get('article_id'),
      order_by: '-created_at',
      limit,
      offset
    };
    wx.BaaS.getRecordList(objects).then((res) => {
      let count = res.data.meta.total_count
      if (count > 0) {
        that.setData({count: count, hide: "", comments: res.data.objects, page: page + 1, size: limit})
      }
    }, (err) => {
      wx.showToast({
        title: '系统错误',
      })
    })

    wx.checkSession({
      success: function() {
        that.setData({session: 1})
      },
      fail: function() {
        that.setData({session: 2})
      }
    })

    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight)
        that.setData({windowHeight: res.windowHeight})
      },
    })
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

  contentInput: function(e) {
    let that = this;
    that.setData({
      content: e.detail.value
    })
  },

  commentArticle: function() {
    let tableID = 221
    let that = this
    let count = that.data.count
    let userInfo = wx.BaaS.storage.get('userInfo')
    let data = {
      article_id: wx.BaaS.storage.get("article_id"),
      content: that.data.content,
      wx_name: userInfo.nickname,
      wx_avatar: userInfo.avatar
    }
    let objects = {
      tableID,
      data
    }
    wx.BaaS.createRecord(objects).then((res) => {
      that.setData({count: count + 1, hide: ""})
    }, (err) => {
      wx.showToast({
        title: '系统错误',
      })
    })
  },

  //加载更多
  loadMore: function (e) {
    // let that = this;
    if (!this.data.hasMore) {
      return
    }

    this.setData({
      hasMore: false
    })

    let limit = this.data.size
    let offset = limit * (this.data.page - 1)
    let objects = {
      tableID: 221,
      order_by: '-created_at',
      article_id: wx.BaaS.storage.get('article_id'),
      limit,
      offset
    }
    wx.BaaS.getRecordList(objects).then((res) => {
      // success
      let total = res.data.meta.total_count
      let obj = this.data.comments
      this.setData({
        list: obj.concat(res.data.objects),
        hasMore: (this.data.page * limit >= total) ? false : true,
        page: this.data.page + 1
      })
    }, (err) => {
      // err
      wx.showToast({
        title: '系统出错',
      })
    })
  },
})