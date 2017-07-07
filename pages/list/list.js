// list.js
let imageUtil = require("../../utils/util")
var list, page, limit
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // page: 1,
    // size: 5,
    imgwidth: 0,
    imgheight: 0,
    hasMore: false,
    hasRefesh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let limit = 5
    let offset = 0
    let objects = {
      tableID: 216,
      limit,
      offset,
      order_by: '-created_at'
    }
    wx.BaaS.getRecordList(objects).then((res) => {
      // success
      // page = 2
      // list = res.data.objects
      this.setData({ list: res.data.objects, page: 2, size: limit, hasMore: true })
    }, (err) => {
      // err
      wx.showToast({
        title: '系统出错',
        image: '/images/error.png'
      })
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
      tableID: 216,
      order_by: '-created_at',
      limit,
      offset
    }
    wx.BaaS.getRecordList(objects).then((res) => {
      // success
      let total = res.data.meta.total_count
      let obj = this.data.list
      this.setData({ 
        list: obj.concat(res.data.objects), 
        hasMore: (this.data.page * limit >= total) ? false : true, 
        hasRefesh: false, 
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
  //刷新处理
  refesh: function (e) {
    // let that = this;
    this.setData({
      hasRefesh: true,
    });
    limit = 5
    let offset = 0
    let objects = {
      tableID: 216,
      order_by: '-created_at',
      limit,
      offset
    }
    wx.BaaS.getRecordList(objects).then((res) => {
      // console.log(res)
      // success
      this.setData({
        list: res.data.objects,
        page: 2,
        size: limit,
        hasRefesh: false,
        hasMore: true
      })
    }, (err) => {
      // err
      wx.showToast({
        title: '系统出错',
        image: '/images/error.png'
      })
    })
  },

  imageLoad: function (e) {
    var _this = this;
    //获取图片的原始宽度和高度  
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let sysInfo = wx.getSystemInfoSync();
    let imageSize = imageUtil.imageZoomHeightUtil(originalWidth, originalHeight, sysInfo.windowWidth*0.89);
    _this.setData({ imgwidth: imageSize.imageWidth, imgheight: imageSize.imageHeight });
  }
})