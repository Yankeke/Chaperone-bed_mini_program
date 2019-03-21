//index.js
//获取应用实例
const app = getApp()
const interfaces = require("../../utils/urlconfig.js");
Page({
  data: {
    imgUrls: [
      'https://phc.laiqubao.com/Uploads/images/0001xcx_banner1.jpg',
      'https://phc.laiqubao.com/Uploads/images/0001xcx_banner2.jpg',
      'https://phc.laiqubao.com/Uploads/images/0001xcx_banner3.jpg'
    ],
    // 显示面板指示点
    indicatorDots: true,
    autoplay: true,
    indicatorActiveColor: "#00bcd4",
    interval: 4000,
    duration: 1000,
    circular: true,
    // uuid:"869300030102424",
    openid: "",
    fromScan:false,
  },
  //事件处理函数
  onLoad: function (options) {
    if(options.scene){
      let str = decodeURIComponent(options.scene);
      let uuid = str.substring(5);
      this.setData({
        fromScan: true,
        uuid:uuid,
      })
    }
    
  },
  // onShow
  onShow(){
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    wx.login({
      success:res => {
        if(res.code){
          wx.request({
            url: interfaces.getopenid,
            data:{
              appid:app.globalData.appid,
              secret:app.globalData.secret,
              js_code:res.code
            },
            method:"get",
            header:{
              "content-type":"application/json"
            },
            success: res => {
              wx.hideLoading();
              //  返回错误
              if (res.data == false) {
                wx.showModal({
                  title: '系统出错',
                  content: '请按确定重新进入',
                  showCancel: false,
                  confirmText: "确定",
                  success: function (data) {
                    if (data.confirm) {
                      wx.reLaunch({
                        url: '../index/index',
                      });
                    }
                  }
                })
              }else {
                let resObj = JSON.parse(res.data);
                this.setData({
                  openid:resObj.openid
                });
                app.globalData.openid = resObj.openid;
                //  设置openid后 如果是扫码打开的就做判断 是否绑手机号 是否有押金 是否有余额
                if (this.data.fromScan) {
                  wx.request({
                    url: interfaces.denglu,
                    data:{
                      openId:this.data.openid,
                      uuid:this.data.uuid
                    },
                    success: res => { 
                      if (res.data.msg == 1) {
                        //  1到扫码结果页带上uuid和openid
                        wx.navigateTo({
                          url: '../scanresult/scanresult?uuid=' + this.data.uuid + "&openid=" + this.data.openid,
                        });
                      } else if (res.data.msg == 2) {
                        // 2 到绑定手机号界面
                        wx.navigateTo({
                          url: '../phone/phone',
                        })
                      }else if (res.data.msg == 3) {
                        // 3 到充值押金界面
                        wx.navigateTo({
                          url: '../recharge/recharge?from=' + 'deposit'+'&openid='+this.data.openid,
                        })
                      }else if (res.data.msg == 4) {
                        // 4 到充值余额界面
                        wx.navigateTo({
                          url: '../recharge/recharge?from=' + 'balance' + '&openid=' + this.data.openid,
                        })
                      } else if (res.data.msg == 6) {
                        // 6 到管理员登录界面 带上uuid
                        wx.navigateTo({
                          url: '../admin/admin?uuid=' + this.data.uuid+"&openid="+this.data.openid,
                        })
                      }
                      //  跳转后更改页面值 使返回后页面不再跳转 清空uuid
                      this.setData({
                        fromScan: false,
                        uuid: ''
                      })
                    }
                  })

                  
                }
              }
            }
          })
        }
      }
    });
    
  },
  // 报修
  toWarn() {
    wx.navigateTo({
      url: '../warn/warn'
    })
  },
  // 使用说明
  toHelp() {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  //  首页扫码
  scan_btn(){
    wx.scanCode({
      success: res => {
        wx.showLoading({
          title: '识别中',
          mask:true,
        })
        let str = decodeURIComponent(res.path);
        //  如果是设备上的二维码
        if (str.includes('scene')) {
          function getUuid(obj) {
            var index = obj.lastIndexOf("\=");
            obj = obj.substring(index + 1, obj.length);
            return obj;
          };
          // 得到转码和截取后的uuid 为 uuidStr ；
          let uuidStr = getUuid(str);
          wx.hideLoading();
          //带床柜号到开锁页
          wx.navigateTo({
            url: '../scanresult/scanresult?uuid=' + uuidStr + "&openid="+this.data.openid,
          });
        }else{
          //  不是设备的二维码
          wx.hideLoading();
          wx.showModal({
            title: '温馨提示',
            content: '不是本设备的二维码',
            showCancel: false,
            confirmColor: "#00bcd4"
          })
        }
      }
    })
  },
  //  开启转发
  onShareAppMessage() {
    
  },
})
