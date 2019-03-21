var uuid;
var phone;
var warnNote;
var mbreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(16[0-9]{1})|(17[0-9]{1}))+\d{8})$/;   //手机号码正则
Page({
  data: {
    noteMaxLen: 140,
    uuid: "",
    warnNote: '',
    phone: "",
    disabled: false
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

  uuidInput(e) {
    uuid = e.detail.value;
    this.setData({
      uuid: uuid
    })
  },
  phoneInput(e) {
    phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  //字数限制
  bindWordLimit(e) {
    warnNote = e.detail.value;
    var value = e.detail.value, len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len,
      warnNote: e.detail.value
    })
  },
  //提交表单
  formSubmit(e) {
    uuid = e.detail.value.uuid;
    phone = e.detail.value.phone;
    warnNote = e.detail.value.warnNote;

    if (uuid == '') {
      wx.showModal({
        title: '提示',
        content: '请填写床柜编号',
      })
    }
    else if (uuid.length < 10) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的编号',
      })
    }
    else if (phone == '') {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
      })
    }
    else if (!mbreg.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号有误',
      })
    }
    else if (phone.length < 11) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号码',
      })
    }
    else if (warnNote == '') {
      wx.showModal({
        title: '提示',
        content: '请填写故障描述',
      })
    }
    else if (warnNote.length < 3) {
      wx.showModal({
        title: '提示',
        content: '请仔细填写故障描述',
      })
    }
    else {
      this.setData({
        disabled: true
      })
      let that = this;
      // 提交 编号 手机号 描述
      wx.request({
        url: 'https://phc.laiqubao.com/index.php/Home/index/baoxiu',
        data: {
          "uuid": uuid,
          "fContext": warnNote,
          "fPhone": phone,
        },
        header: {
          'content-type': "application/json"
        },
        method: "get",
        success(res) {
          that.setData({
            disabled: false
          })
          if (res.data.msg == "报修成功") {
            wx.showModal({
              title: '提交成功',
              content: '感谢您的反馈',
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
              }
            });
          }
        }
      })
    }
  }
})