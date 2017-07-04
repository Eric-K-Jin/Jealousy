//index.
let imageUtil = require("../../utils/util")
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    src: "/images/logo.png",
    imgwidth: 0,
    imgheight: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },

  onLogin: function() {
    wx.BaaS.login().then((result) => {
      let objects = {
        tableID: 215,
        wx_uid: wx.BaaS.storage.get('uid')
      }
      wx.BaaS.getRecordList(objects).then((res) => {
        if (res.data.objects.length > 0) {
          wx.navigateTo({
            url: '../list/list',
          })
        } else {
          let tableID = 215
          let data = {
            wx_name: result.nickName,
            wx_avatar: result.avatarUrl,
            mobile: "",
            wx_uid: objects.wx_uid
          }

          let object = {
            tableID,
            data
          }

          wx.BaaS.createRecord(object).then((res) => {
            wx.navigateTo({
              url: '../list/list',
            })
          }, (err) => {
            console.log(err)
          })
        }
      }, (err) => {
        console.log(err)
      })
    }, (err) => {
      console.log(err)
    })
  },

  imageLoad: function (e) {
    var _this = this;
    //获取图片的原始宽度和高度  
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let sysInfo = wx.getSystemInfoSync();
    let imageSize = imageUtil.imageZoomWidthUtil(originalWidth, originalHeight, sysInfo.windowHeight / 8);
    _this.setData({ imgwidth: imageSize.imageWidth, imgheight: imageSize.imageHeight });
  }
})
