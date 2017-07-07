// detail.js
let imageUtil = require("../../utils/util")
var id, comments, page = 1, limit = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    content: '',
    hide: 'hide',
    hasMore: true,
    session: 1
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
      that.setData({detail: res.data.content, image: res.data.image})
    }, (err) => {
      wx.showToast({
        title: '系统错误',
        image: '/images/error.png'
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
        that.setData({count: count, hide: "", comments: res.data.objects, page: page + 1, size: limit, hasMore: (count <= limit) ? false : true})
      } else {
        that.setData({page: page, size:limit, hasMore: false})
      }
    }, (err) => {
      wx.showToast({
        title: '系统错误',
        image: '/images/error.png'
      })
    })

    var info = wx.BaaS.storage.get('userinfo')
    if (!info.nickName || !info.avatarUrl) {
      that.setData({session: 2})
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

  contentInput: function(e) {
    let that = this;
    that.setData({
      content: e.detail.value
    })
  },

  commentArticle: function() {
    let that = this
    if (that.data.content == "" || that.data.content == undefined || that.data.content == null) {
      wx.showToast({
        title: '很抱歉，评论内容不能为空',
        image: '/images/error.png'
      })
      return
    }
    let tableID = 221
    let count = that.data.count
    let userInfo = wx.BaaS.storage.get('userinfo')
    let data = {
      article_id: wx.BaaS.storage.get("article_id"),
      content: that.data.content,
      wx_name: userInfo.nickName,
      wx_avatar: userInfo.avatarUrl
    }
    let objects = {
      tableID,
      data
    }
    wx.BaaS.createRecord(objects).then((res) => {
      that.setData({count: count + 1, hide: ""})

      objects = {
        tableID: 216,
        recordID: data.article_id,
        data: {
          comments: that.data.count
        }
      }
      wx.BaaS.updateRecord(objects).then((res) => {
        // success

      }, (err) => {
        // err
        wx.showToast({
          title: '系统错误',
          image: '/images/error.png'
        })
      });

      let limit = this.data.size
      let offset = 0
      objects = {
        tableID: 221,
        order_by: '-created_at',
        article_id: wx.BaaS.storage.get('article_id'),
        limit,
        offset
      }
      wx.BaaS.getRecordList(objects).then((res) => {
        let total = res.data.meta.total_count
        // success
        this.setData({
          comments: res.data.objects,
          page: 2
        })
      }, (err) => {
        // err
        wx.showToast({
          title: '系统出错',
          image: '/images/error.png'
        })
      })
    }, (err) => {
      wx.showToast({
        title: '系统错误',
        image: '/images/error.png'
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
        comments: obj.concat(res.data.objects),
        hasMore: (this.data.page * limit >= total) ? false : true,
        page: this.data.page + 1
      })
    }, (err) => {
      // err
      wx.showToast({
        title: '系统出错',
        image: '/images/error.png'
      })
    })
  },

  authorize: function() {
    var that = this;
    wx.openSetting({
      success: function(data) {
        if(data) {
            if (data.authSetting["scope.userInfo"] == true) {
              wx.getUserInfo({
                withCredentials: false,
                success: function(data) {
                  wx.setStorageSync('ifx_baas_userinfo', data.userInfo)
                  that.setData({hide: "", session: 1})
                },
                fail: function() {
                  wx.showToast({
                    title: '授权失败',
                    image: '/images/error.png'
                  })
                }                
              });
            }
        } 
      },
      fail: function() {
        wx.showToast({
          title: '授权失败',
          image: '/images/error.png'
        })
      } 
    })
  },

  imageLoad: function (e) {
    var _this = this;
    //获取图片的原始宽度和高度  
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let sysInfo = wx.getSystemInfoSync();
    let imageSize = imageUtil.imageZoomHeightUtil(originalWidth, originalHeight, sysInfo.windowWidth*0.88);
    _this.setData({ imgwidth: imageSize.imageWidth, imgheight: imageSize.imageHeight });
  },

  preview: function () {
    let _this = this
    wx.previewImage({
      urls: [_this.data.src],
    })
  }
})