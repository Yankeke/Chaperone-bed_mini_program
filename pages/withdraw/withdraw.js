// pages/withdraw/withdraw.js
const interfaces = require("../../utils/urlconfig.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:"",
    usersInfo:{},
    disabled:false,// 提现按钮禁用
    oid:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      from:options.from,
      openid:options.openid,
      usersInfo:JSON.parse(options.userinfo)
    });
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
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true,
    // })
  },
  // 押金提现
  withdrawBtn() {
    if (this.data.usersInfo.yajin <= 0) {
      wx.showToast({
        title: '押金为0不可提现',
        icon: "none",
        mask: true
      })
    }
    else {
      this.setData({
        disabled: true
      })
      // 拿到oid用户提现押金;
      wx.request({
        url: interfaces.yajinti,
        data: {
          openid: this.data.openid
        },
        success:res => {
          this.setData({
            disabled: false
          })
          // 1 是订单没有结束  2 是没有可以提的押金  有oid时可提现
          if (res.data.msg == 1) {
            wx.showToast({
              title: '正在使用不可提现',
              icon: "none",
              duration: 1500,
              mask: true
            })
          } else if (res.data.msg == 2) {
            wx.showToast({
              title: '没有可提现的订单',
              icon: "none",
              duration: 1500,
              mask: true
            })
          } else if (res.data.oId) {
            this.setData({
              oid:res.data.oId
            })
            // 弹出模态框 是否确定提现押金
            wx.showModal({
              title: '确定提现？',
              content: '提现金额将在五个工作日内到达原付款账户',
              mask: true,
              success: res => {
                if (res.confirm) {
                  wx.showLoading({
                    title: '操作中...',
                    mask: true
                  })
                  // 用户点确定提现
                  wx.request({
                    url: interfaces.yajinrefund,
                    data: {
                      oId: this.data.oid
                    },
                    success: data => {
                      if (data) {
                        wx.hideLoading()
                      }
                      // 申请提现押金成功
                      if (data.data.msg == "退款成功") {
                        wx.showToast({
                          title: '申请成功',
                          icon: "success",
                          duration: 2000
                        });
                      }
                      // 申请提现押金失败
                      else {
                        wx.showToast({
                          title: '提现失败',
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    }
                  })
                }
              }
            });
          }
        }
      });
    }
  },
  //  提现余额
  withdrawBalance() {
    // 提现余额
    if (this.data.usersInfo.yue <= 0) {
      wx.showToast({
        title: '余额为0不可提现',
        icon: "none",
        mask: true
      })
    }
    else {
      this.setData({
        disabled: true
      })
      // 拿到oid;
      wx.request({
        url: interfaces.yueti,
        data: {
          openid: this.data.openid
        },
        success:res => {
          this.setData({
            disabled: false
          })
          // 1 是有正在进行的订单 2 是没有可提现的余额 有oid时可提现
          if (res.data.msg == 1) {
            wx.showToast({
              title: '正在使用不可提现',
              icon: "none",
              duration: 1500,
              mask: true
            })
          } else if (res.data.msg == 2) {
            wx.showToast({
              title: '没有可提现的订单',
              icon: "none",
              duration: 1500,
              mask: true
            })
          } else if (res.data.oId) {
            this.setData({
              oid: res.data.oId,
            })
            // 是否确定提现余额
            wx.showModal({
              title: '确定提现？',
              content: '提现金额将在五个工作日内到达原付款账户',
              mask: true,
              success: function (res) {
                if (res.confirm) {
                  wx.showLoading({
                    title: '操作中...',
                    mask: true
                  })
                  // 确定提现余额
                  wx.request({
                    url: yuerefund,
                    data: {
                      oId: this.data.oid
                    },
                    success: data => {
                      wx.hideLoading();
                      // 申请提现余额成功
                      if (data.data.msg == "退款成功") {
                        wx.showToast({
                          title: '申请成功',
                          icon: "success",
                          duration: 1500,
                          mask: true
                        });
                      }
                      // 申请提现余额失败
                      else {
                        wx.showToast({
                          title: '提现失败',
                          icon: 'none',
                          duration: 1500,
                          mask: true
                        })
                      }
                    }
                  })
                }
              }
            });
          }
        }
      });
    }
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

  }
})