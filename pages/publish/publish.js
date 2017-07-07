// publish.js
let imageUtil = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // src: "/images/upload.png"
    imagePath: "",
    imgwidth: 0,
    imgheight:0
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

  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },

  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        _this.setData({ src: tempFilePaths[0]})
        // wx.BaaS.uploadFile(params).then((res) => {
        //   console.log(res)
        //   let imgInfo = JSON.parse(res.data)
        //   console.log(imgInfo)
        //   _this.setData({ src: imgInfo.path })
        // }, (err) => {
        //   console.log(err);
        // })
      }
    })
  },

  imageLoad: function (e) {
    var _this = this;
    //获取图片的原始宽度和高度  
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let sysInfo = wx.getSystemInfoSync();
    let imageSize = imageUtil.imageZoomWidthUtil(originalWidth, originalHeight, sysInfo.windowHeight / 4);
    _this.setData({ imgwidth: imageSize.imageWidth, imgheight: imageSize.imageHeight });
  },

  preview: function() {
    let _this = this
    wx.previewImage({
      urls: [_this.data.src],
    })
  },

  deleteImage: function() {
    let _this = this
    let imagePath = _this.data.src
    wx.removeSavedFile({
      filePath: imagePath,
      complete: function(res) {
        _this.setData({ src: "" })
      }
    })
  },

  contentInput: function (e) {
    let _this = this;
    _this.setData({
      content: e.detail.value
    })
  },

  publishArticle: function() {
    let _this = this;
    let content = _this.data.content
    if (!content) {
      wx.showToast({
        title: '内容不能为空',
        image: '/images/error.png'
      })
      return
    }

    let src = _this.data.src
    let params = {}
    if (src) {
      params.filePath = src
      wx.BaaS.uploadFile(params).then((res) => {
        let imgInfo = JSON.parse(res.data)
        wx.removeSavedFile({
          filePath: src
        })
        _this.setData({ imagePath: imgInfo.path })
        let data = {
          content: content,
          comments: 0,
          image: _this.data.imagePath
        }

        _this.publish(data)
      }, (err) => {
        wx.showToast({
          title: '图片上传失败',
          image: '/images/error.png'
        })
      })
    } else {
      let data = {
        content: content,
        comments: 0
      }

      _this.publish(data)
    }
  },

  publish: function(data) {
    let tableID = 216
    let objects = {
      tableID,
      data
    }
    wx.BaaS.createRecord(objects).then((res) => {
      wx.showToast({
        title: '发布成功',
      })
      wx.switchTab({
        url: '/pages/list/list',
      })
    }, (err) => {
      wx.showToast({
        title: '发布失败，请稍后再试',
        image: '/images/error.png'
      })
    })
  }
})