// pages/user/user.js
const app = getApp();
const interfaces = require("../../utils/urlconfig.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    userInfo:{},
    userPhone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid:app.globalData.openid
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
      title: '加载中',
      mask:true
    });
    wx.request({
      url: interfaces.getuserinfo,
      data:{
        openid:this.data.openid
      },
      header:{
        "content-type":"application/json"
      },
      method:"get",
      success: res => {
        wx.hideLoading();
        if(res.data.msg == 1){
          // 没有这个用户
        }else{
          //  有这个用户
          this.setData({
            userPhone:res.data.tel,
            userInfo:res.data
          })
        }
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
  //  绑定/换绑手机
  bindPhone: function (e) {
    wx.navigateTo({
      url: '../phone/phone?from=' + e.currentTarget.dataset.from
    })
  },
  //  我的钱包
  toWallet(){
    //  没有绑定手机号，跳转到绑定手机号页面
    if(this.data.userPhone.length < 1){
      wx.showToast({
        title: '先绑定手机号码',
        icon: "none",
        duration: 1500,
      })
      let timer = setTimeout( () => {
        clearTimeout(timer);
        wx.navigateTo({
          url: '../phone/phone',
        })
      },1500)
    }else{
      //  已经绑定手机号，跳转到钱包页面
      let jsonObj = JSON.stringify(this.data.userInfo)
      wx.navigateTo({
        url: '../wallet/wallet?openid='+this.data.openid
      })
    }
  },
  //  租借记录
  toRentRec(){
    //  没有绑定手机号，跳转到绑定手机号页面
    if (this.data.userPhone.length < 1) {
      wx.showToast({
        title: '先绑定手机号码',
        icon: "none",
        duration: 1500,
      })
      let timer = setTimeout(() => {
        clearTimeout(timer);
        wx.navigateTo({
          url: '../phone/phone',
        })
      }, 1500)
    }else{
      //  已经绑定手机号，跳转到租借记录
      wx.navigateTo({
        url: '../rentrec/rentrec?openid=' + this.data.openid,
      })
    }
  },
  // 新手教程
  toHelp() {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  // 关于我们
  toAbout() {
    wx.showModal({
      title: '关于我们',
      content: '客服电话 0371-56029338',
      showCancel: false
    })
  }
})