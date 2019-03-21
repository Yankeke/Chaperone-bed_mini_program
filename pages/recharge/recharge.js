// pages/recharge/recharge.js
const interfaces = require("../../utils/urlconfig.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:"",
    disabled:false,// 禁用充值按钮
    currentItem: 0,// 充值余额默认选中第一个
    moneyVal:[],//  充值余额的选项
    yajinVal:"",//  充值的押金数
    treeid:"0001",//  用于区分商家,0001是公司自己的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from == "deposit"){
      wx.setNavigationBarTitle({
        title: '充值押金',
      });
    } else if (options.from == "balance"){
      wx.setNavigationBarTitle({
        title: '充值余额',
      });
    }
    this.setData({
      from:options.from,
      openid:options.openid
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
      mask:true,
    });
    if (this.data.from == 'balance'){
      //  调预充值余额
      this.reyue();
    } else if (this.data.from == 'deposit'){
      //  调预充值押金
      this.reyajin();
    }
  },
  //  预充值余额
  reyue(){
    wx.request({
      url: interfaces.yuyue,
      success:res => {
        this.setData({
          moneyVal:res.data
        });
        //  充值余额
        wx.request({
          url: interfaces.pay,
          data: {
            total_fee: this.data.moneyVal[0] * 100, // 100分即1元钱
            type: 2, // 1是押金，2是余额
            openid: this.data.openid,
            treeid: this.data.treeid,
          },
          header: {
            "content-type": "application/json"
          },
          method: 'GET',
          success: res => {
            wx.hideLoading();
            if (res.data.state == 1) {
              this.setData({
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                timeStamp: res.data.timeStamp
              })
            } else {
              wx.showToast({
                title: '系统错误，请重试',
                mask: true,
                icon: "none",
                duration: 2000
              });
            }
          },
        })
      }
    })
  },
  //  预充值押金
  reyajin(){
    wx.request({
      url: interfaces.yuyajin,
      success: res => {
        this.setData({
          yajinVal:res.data
        });
        //  充值押金
        wx.request({
          url: interfaces.pay,
          data: {
            total_fee: this.data.yajinVal * 100,// 0.01元乘100得出 1分
            openid: this.data.openid,
            type: 1,  // 1是押金  2 是余额
            treeid: this.data.treeid
          },
          success: (res) => {
            wx.hideLoading();
            if (res.data.state == 1) {
              this.setData({
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                timeStamp: res.data.timeStamp
              })
            } else if (res.data.state == 0) {
              wx.showToast({
                title: '系统错误，请重试',
                mask: true,
                icon: "none",
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  // 确定充值押金
  payDeposit() {
    this.setData({
      disabled: true
    })
    //调微信支付
    wx.requestPayment({
      'timeStamp': String(this.data.timeStamp),
      'nonceStr': String(this.data.nonceStr),
      'package': String(this.data.package),
      'signType': String(this.data.signType),
      'paySign': String(this.data.paySign),
      'success': res => {
        console.log("success", res)
        wx.showToast({
          title: '支付成功',
          icon: "success",
          duration: 1500
        })
        // 充值押金完成后去充值余额
        setTimeout(() => {
          wx.redirectTo({
            url: '../recharge/recharge?from=balance&openid=' + this.data.openid,
          })
        }, 1500)
      },
      'fail':err => {
        console.log("error", err)
        wx.showToast({
          title: '取消支付',
          icon: "none",
          duration: 1500
        });
      },
      'complete':req => {
        console.log("complete", req)
        this.setData({
          disabled: false
        })
      }
    })
  },
  choose(e) {
    this.setData({
      currentItem: e.currentTarget.dataset.index
    })
  },
  // 选择充值的金额
  radioChange(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 充值余额发送
    wx.request({
      url: interfaces.pay,
      data: {
        total_fee: e.detail.value, // 充值勾选的钱数
        type: 2,
        openid: this.data.openid,
        treeid: this.data.treeid,
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.state == 1) {
          this.setData({
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            timeStamp: res.data.timeStamp
          })
        } else {
          wx.showToast({
            title: '系统错误，请重试',
            mask: true,
            icon: "none",
            duration: 2000
          });
        }
      }
    })
  },
  // 提交充值余额
  formSubmit(e) {
    // 点击后禁用提交按钮，防止一个订单多次充值
    this.setData({
      disabled: true
    })
    // 调微信支付
    wx.requestPayment({
      'timeStamp': String(this.data.timeStamp),
      'nonceStr': String(this.data.nonceStr),
      'package': String(this.data.package),
      'signType': String(this.data.signType),
      'paySign': String(this.data.paySign),
      'success': res => {
        wx.showToast({
          title: '支付成功',
          icon: "success",
          duration: 1500
        })
        //  充值余额完成后去首页
        setTimeout( () =>{
          wx.switchTab({
            url: '../index/index',
          })
        }, 1500)
      },
      'fail': err =>{
        console.log("error", err);
        wx.showToast({
          title: '取消支付',
          icon: "none",
          duration: 1500
        });
      },
      'complete':req => {
        console.log("complete", req)
        this.setData({
          disabled: false
        })
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

  }
})