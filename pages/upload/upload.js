// upload.js
let imageUtil = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "/images/logo.png",
    imgwidth: 0,
    imgheight: 0,
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
    let params = {};
    params.formData = {};
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res);
        // _this.setData({
        //   logo: res.tempFilePaths[0],
        // })
        console.log(res);
        let tempFilePaths = res.tempFilePaths;
        params.filePath = tempFilePaths[0];
        wx.BaaS.uploadFile(params).then((res) => {
          console.log(res)
          let imgInfo = JSON.parse(res.data)
          console.log(imgInfo)
          _this.setData({src: imgInfo.path})
        }, (err) => {
          console.log(err);
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
    let imageSize = imageUtil.imageZoomWidthUtil(originalWidth, originalHeight, sysInfo.windowHeight/8);
    _this.setData({ imgwidth: imageSize.imageWidth, imgheight: imageSize.imageHeight});
  }
})