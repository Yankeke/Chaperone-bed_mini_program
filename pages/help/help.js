Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "https://phc.laiqubao.com/Uploads/images/0001xcx_help.jpg"
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
  ok_btn() {
    wx.navigateBack({
      delta: "1"
    })
  }
})