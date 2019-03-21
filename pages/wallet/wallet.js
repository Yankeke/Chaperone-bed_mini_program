// pages/wallet/wallet.js
const interfaces = require("../../utils/urlconfig.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    yajinVal:"",
    usersInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid:options.openid,
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
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      //  获取押金数字
      url: interfaces.getyajin,
      success: res => {
        wx.hideLoading();
        this.setData({
          yajinVal:res.data
        })
      }
    });
    wx.request({
      url: interfaces.getuserinfo,
      data:{
        openid:this.data.openid
      },
      success: res => {
        this.setData({
          usersInfo: res.data
        });
      }
    })
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
  // 去充值记录
  toPayrec() {
    wx.navigateTo({
      url: '../payrec/payrec?openid='+this.data.openid,
    })
  },
  //充值押金 充值余额
  toRecharge(e) {
    wx.navigateTo({
      url: '../recharge/recharge?from=' + e.currentTarget.dataset.from+"&openid="+this.data.openid,
    })
  },
  //押金提现 余额提现
  toWithdraw(e) {
    let jsonObj = this.data.usersInfo;
    wx.navigateTo({
      url: '../withdraw/withdraw?from=' + e.currentTarget.dataset.from+"&openid="+this.data.openid+"&userinfo="+JSON.stringify(jsonObj),
    })
  },
})