// pages/admin/admin.js
const interfaces = require("../../utils/urlconfig.js");
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid:'',
    openid:"",
    bedInfo:"",
    disabled:false,
    oid:'',
    infoVal:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid:options.openid,
      uuid:options.uuid
    })
    wx.setNavigationBarTitle({
      title: '管理共享陪护床',
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
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    wx.request({
      url: interfaces.getinfo,
      data:{
        uuid:this.data.uuid
      },
      header:{
        "content-type":"application/json"
      },
      method:"get",
      success: res => {
        wx.hideLoading();
        this.setData({
          bedInfo:res.data.address,
          infoVal:res.data.address,
        })
      }
    })
  },

  //  修改床柜信息
  editInfo(e){
    this.setData({
      infoVal:e.detail.value
    })
  },
  toSubmit(){
    this.setData({
      disabled: true
    });
    //  提交修改
    if(this.data.infoVal.length < 2){
      wx.showModal({
        title: '提示',
        content: '请输入正确的床柜信息',
      });
      this.setData({
        disabled: false
      });
    }else{
      wx.request({
        url: interfaces.xgdizhi,
        data:{
          uuid:this.data.uuid,
          address:this.data.infoVal,
        },
        header:{
          "content-type":"application/json"
        },
        method:"get",
        success: res => {
          if(res.data.msg == "修改成功"){
            wx.showToast({
              title: "修改成功",
              icon: "success",
              duration: 2000
            });
            this.setData({
              bedInfo:this.data.infoVal
            })
          } else if (res.data.msg == "暂无修改"){
            wx.showToast({
              title: '暂无修改',
              icon: "none",
              duration: 2000
            });
          }
          this.setData({
            disabled: false
          });
        }
      })
    }
  },
  //  管理员直接开门
  openDoor(){
    //时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    timestamp = timestamp.toString();
    this.setData({
      oid: this.data.uuid + '-' + this.test() + '-' + timestamp,
      disabled: true, //  禁用点击
    });
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
    wx.request({
      url: interfaces.glopen,
      data:{
        action: "open",
        uuid: this.data.uuid,
        oid: this.data.oid,
        openid: this.data.openid
      },
      header:{
        "content-type":"application/json"
      },
      method:"get",
      success: res　=> {
        wx.hideLoading();
        this.setData({
          disabled: false
        });
        if(res.data.msg == 1){
          //  1可以开始查了
          wx.showLoading({
            title: '开门中...',
            mask: true,
          });
          //  开始查
          this.getStatus();
        }else if(res.data.msg == 3){
          wx.showToast({
            title: "设备使用中",
            icon: "none",
            duration: 1500
          })
        }else if(res.data.msg == 2){
          wx.showToast({
            title: "打开失败",
            icon: "none",
            duration: 3000
          })
        }
      }
    })
  },
  // 轮询状态
  getStatus() {
    wx.request({
      url: interfaces.getstatus,
      data: {
        oid: this.data.oid
      },
      header: {
        "content-type": "application/json"
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
        } else if (res.data == 0) {
          this.timeBacks();
        } else if (res.data == 1) {
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
  timeBacks() {
    let num = 0;
    timer = setInterval(() => {
      num++;
      if (num == 60) {
        wx.hideLoading();
        wx.showToast({
          title: '开门失败，请检查设备。',
          icon: "none",
          duration: 3000
        })
        clearInterval(timer);
      } else {
        this.ajax();
      }
    }, 1000)
  },
  ajax() {
    wx.request({
      url: interfaces.getstatus,
      data: {
        oid: this.data.oid
      },
      success: res => {
        if (res.data == 1) {
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
  //六位随机字母
  test() {
    var result = [];
    for (var i = 0; i < 6; i++) {
      var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
      result.push(String.fromCharCode(65 + ranNum));
    }
    return result.join('');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  }
})