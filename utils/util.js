function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function imageZoomHeightUtil(originalWidth, originalHeight, imageWidth) {
  let imageSize = {};
  if (imageWidth) {
    imageSize.imageWidth = imageWidth;
    imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
  } else {//如果没有传imageWidth,使用屏幕的宽  
    wx.getSystemInfo({
      success: function (res) {
        imageWidth = res.windowWidth;
        imageSize.imageWidth = imageWidth;
        imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
      }
    });
  }
  return imageSize;
} 

function imageZoomWidthUtil(originalWidth, originalHeight, imageHeight) {
  let imageSize = {};
  if (imageHeight) {
    imageSize.imageWidth = (imageHeight * originalWidth) / originalHeight;
    imageSize.imageHeight = imageHeight;
  } else {//如果没有传imageHeight,使用屏幕的高  
    wx.getSystemInfo({
      success: function (res) {
        imageHeight = res.windowHeight;
        imageSize.imageWidth = (imageHeight * originalWidth) / originalHeight;
        imageSize.imageHeight = imageHeight;
      }
    });
  }
  return imageSize;
}

module.exports = {
  formatTime: formatTime,
  imageZoomHeightUtil: imageZoomHeightUtil,
  imageZoomWidthUtil: imageZoomWidthUtil
}
