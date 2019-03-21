// pages/scanresult/scanresult.js
const interfaces = require("../../utils/urlconfig.js");
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid:"",
    openid:"",
    disabled:false,
    oid:"",
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
    wx.request({
      url: interfaces.denglu,
      data:{
        openId:this.data.openid,
        uuid:this.data.uuid,
      },
      success: res => {
        //  6是管理员
        if(res.data.msg == 6){
          wx.redirectTo({
            url: '../admin/admin?uuid=' + this.data.uuid+"&openid="+this.data.openid,
          })
        }
      }
    })
  },
  //六位随机字母
  test(){
    var result = [];
    for (var i = 0; i < 6; i++) {
      var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
      result.push(String.fromCharCode(65 + ranNum));
    }
    return result.join('');
  },
  //  立即开门按钮
  goOpen(){
    //时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    timestamp = timestamp.toString();
    this.setData({
      oid: this.data.uuid + '-' + this.test() + '-' + timestamp,
      disabled:true,//  禁用点击
    });
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    //  发送开门请求
    wx.request({
      url: interfaces.open,
      data:{
        action:"open",
        uuid:this.data.uuid,
        oid:this.data.oid,
        openid:this.data.openid
      },
      header:{
        "content-type":"application/json"
      },
      method:"get",
      success: res => {
        this.setData({
          disabled: false
        });
        //  1是设备使用中
        if (res.data.msg == 1) {
          wx.showToast({
            title: '设备使用中',
            icon: "none",
            duration: 3000,
            mask: true
          })
        }else if(res.data.msg == 2){
          //  2是押金不足，请充值
          wx.showToast({
            title: '押金不足，请充值',
            icon: "none",
            duration: 1500,
            mask: true
          });
          setTimeout( () => {
            wx.navigateTo({
              url: '../recharge/recharge?from=' + "deposit"+"&openid="+this.data.openid,
            })
          }, 1500)
        }else if(res.data.msg == 3){
          //  3是余额不足 充值余额
          wx.showToast({
            title: '余额不足，请充值',
            icon: "none",
            duration: 1500,
            mask: true
          });
          setTimeout( () => {
            wx.navigateTo({
              url: '../recharge/recharge?from=' + "balance"+"&openid="+this.data.openid,
            })
          }, 1500)
        }else if(res.data.msg == 4){
          //  4是可以查状态了
          this.getStatus();
        }else if(res.data.msg == 5){
          wx.showToast({
            title: '开门失败',
            icon: "none",
            duration: 2000,
            mask: true
          })
        }else if(res.data.msg == 6){
          wx.showToast({
            title: '请绑定手机号',
            icon: "none",
            duration: 1500,
            mask: true
          });
          setTimeout( () => {
            wx.navigateTo({
              url: '../phone/phone',
            })
          }, 1500)
        }
      }
    })
  },
  // 轮询状态
  getStatus(){
    wx.request({
      url: interfaces.getstatus,
      data:{
        oid:this.data.oid
      },
      header:{
        "content-type":"application/json"
      },
      success: res => {
        //  3是开门失败 0是一直查 1是成功
        if (res.data == 3) {
          wx.hideLoading();
          wx.showToast({
            title: '开门失败，请检查设备。',
            icon: "none",
            duration: 3000
          })
          clearInterval(timer);
        }else if(res.data == 0){
          this.timeBacks();
        }else if(res.data == 1){
          wx.showToast({
            title: '成功',
            icon: "success",
            duration: 1500,
          });
          clearInterval(timer);
        }
      }
    })
  },
  timeBacks(){
    let num = 0;
    timer = setInterval( () => {
      num ++;
      if(num == 60){
        wx.hideLoading();
        wx.showToast({
          title: '开门失败，请检查设备。',
          icon: "none",
          duration: 3000
        })
        clearInterval(timer);
      }else{
        this.ajax();
      }
    },1000)
  },
  ajax(){
    wx.request({
      url: interfaces.getstatus,
      data: {
        oid: this.data.oid
      },
      success: res => {
        if(res.data == 1){
          wx.showToast({
            title: '成功',
            icon: "success",
            duration: 1500,
          });
          clearInterval(timer);
        }
      }
    })
  },
  //  管理员登录
  toAlogin: function () {
    wx.reLaunch({
      url: '../alogin/alogin?uuid=' + this.data.uuid+"&openid="+this.data.openid,
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