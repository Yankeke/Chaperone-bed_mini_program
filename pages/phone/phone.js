// pages/phone/phone.js
const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
var mbreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(16[0-9]{1})|(17[0-9]{1}))+\d{8})$/;   //手机号码正则
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:"",
    openid:"",
    mobile:"",//  输入的手机号码
    verifyCode:"",//  输入的验证码
    ranNumber:'',// 接收到的验证码
    sec:60, // 倒计时初始秒数
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from == "change") {
      wx.setNavigationBarTitle({
        title: '换绑手机',
      });
      this.setData({
        from: options.from,
      })
    } else {
      wx.setNavigationBarTitle({
        title: '绑定手机',
      })
    }
    this.setData({
      openid: app.globalData.openid
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
  // 输入手机号码
  mbInput(e){
    this.setData({
      mobile:e.detail.value
    })
  },
  //  输入验证码
  vcInput(e){
    this.setData({
      verifyCode:e.detail.value,
      codeVal: e.detail.value
    })
  },
  //  获取验证码
  getCode(){
    let mobile = this.data.mobile;
    if (mobile == ''){
      wx.showModal({
        title: '提示',
        content: '请填写手机号',
      })
    } else if (!mbreg.test(mobile)){
      wx.showModal({
        title: '提示',
        content: '手机号有误',
      })
    }else{
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      //  提交手机号 发送请求
      this.getVerifyCode();
    }
  },
  //  提交手机号，获取验证码
  getVerifyCode(){
    wx.request({
      url: interfaces.getcode,
      data:{
        tel:this.data.mobile
      },
      header:{
        "content-type":"application/json"
      },
      method:"get",
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '验证码已发送',
          icon: "success",
          mask: true,
          duration: 2000
        });
        //  执行获取验证码倒计时方法
        this.getCodes();
        this.setData({
          //  赋值验证码
          ranNumber:res.data
        })
      }
    })
  },
  //  倒计时方法
  getCodes(){
    this.setData({
      isShow:true
    })
    let remain = this.data.sec;
    timer = setInterval( () => {
      remain--;
      this.setData({
        sec: remain
      })
      if(remain == 1){
        clearInterval(timer);
        this.setData({
          sec:60,
          isShow:false
        })
        return false;
      }
    },1000)
  },
  // 提交手机号和openid
  formSubmit(){
    let mobile =  this.data.mobile,
    verifyCode = this.data.verifyCode;
    if(mobile.length == 0 || verifyCode.length == 0){
      wx.showModal({
        title: "提示",
        content: "手机号码或验证码不得为空"
      })
    } else if (!mbreg.test(mobile)){
      wx.showModal({
        title: '提示',
        content: '手机号有误',
      })
    }else if(verifyCode.length < 6){
      wx.showModal({
        title: "提示",
        content: "请输入6位验证码"
      })
    }else if(verifyCode != this.data.ranNumber){
      wx.showModal({
        title: "提示",
        content: "请输入正确的验证码"
      })
    }else{
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      wx.request({
        url: interfaces.tijiao,
        data:{
          tel:this.data.mobile,
          openid:this.data.openid
        },
        header:{
          "content-type":"application/json"
        },
        method:'get',
        success: res => {
          wx.hideLoading();
          if(res.data.msg){
            //  跳转前 初始化定时器数字 显示获取验证码 清空输入的验证码 清空请求到的验证码 清空验证码输入框的值
            this.setData({
              sec: 60,
              isShow: false,
              verifyCode:'',
              ranNumber:'',
              codeVal:'',
            })
            clearInterval(timer);
            if(this.data.from == "change"){
              wx.showToast({
                title: '换绑成功',
                icon: "success",
                duration: 1500
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            } else {
              wx.showToast({
                title: '绑定成功',
                icon: "success",
                duration: 1500
              });
              setTimeout( () => {
                wx.navigateTo({
                  url: '../recharge/recharge?from=' + "deposit"+"&openid="+this.data.openid,
                })
              }, 1500)
            }
          }
        }
      })
    }
  }
})