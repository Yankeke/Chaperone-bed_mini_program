// pages/alogin/alogin.js
const interfaces = require("../../utils/urlconfig.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid:"",
    openid:"",
    userVal:"",
    pwdVal:"",
    disabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uuid:options.uuid,
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

  },
  //  输入用户名 
  userInput(e){
    this.setData({
      userVal:e.detail.value
    })
  },
  //  输入密码
  pwdInput(e){
    this.setData({
      pwdVal:e.detail.value
    })
  },
  //  提交表单
  formSubmit(){
    let user = this.data.userVal, pwd = this.data.pwdVal;
    if (user == '' || pwd == ''){
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: "none",
        duration: 2000
      })
    } else if (user.length < 2 || pwd.length < 2){
      wx.showToast({
        title: '用户名或密码不正确',
        icon: "none",
        duration: 2000
      })
    }else{
      this.setData({
        disabled:true
      });
      wx.showLoading({
        title: '登录中...',
        mask: true
      });
      wx.request({
        url: interfaces.guanli,
        data:{
          uUserName:this.data.userVal,
          uPass:this.data.pwdVal,
          uuid:this.data.uuid,
          openid:this.data.openid
        },
        header:{
          "content-type":"application/json"
        },
        success: res => {
          wx.hideLoading();

          if (res.data.msg == 1) {
           // 1不是管理员
            wx.showToast({
              title: '账号密码错误',
              icon: "none",
              duration: 1500
            })
          }else if(res.data.msg == 2){
            // 2 是管理员
            wx.showToast({
              title: '登录成功',
              icon: "none",
              duration: 1500
            });
            let timer = setTimeout( () => {
              wx.redirectTo({
                url: "../admin/admin?uuid=" + this.data.uuid + "&openid="+this.data.openid,
              });
              this.setData({
                userVal:'',
                pwdVal:''
              })
              clearTimeout(timer);
            },1500)  
          }
        }
      })
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