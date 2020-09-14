const publicUrl = require('./api/index')
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    var that = this
    wx.login({
      success: res => {
        console.log(res.code,'登录信息') // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.getOpenid(res.code)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getOpenid: function (e) {
    var that = this
     wx.request({
     url: this.globalData.root + '/v800/wx/code2session',
     data: {
       code: e
     },
     header: {'content-type':'application/x-www-form-urlencoded'},
     method: 'POST',
     success: (result)=>{
       console.log(result.data.data,'111')
       this.globalData.token = result.data.data
       that.getInfo()
     },
     fail: ()=>{},
     complete: ()=>{}
   });
  },
  getInfo() {
    var that = this
   wx.request({
     url: this.globalData.root + '/v800/wx/user/getUserInfo',
     data: {},
     header: {'content-type':'application/json','token': this.globalData.token},
     method: 'POST',
     dataType: 'json',
     responseType: 'text',
     success: (res)=>{
       console.log(res.data,'dddd')
       this.globalData.userId = res.data.data.id
       this.globalData.userInfo1 = res.data.data
     },
     fail: ()=>{},
     complete: ()=>{}
   });
  },
  globalData: {
    userInfo: null,
    type: 0,
    list: [],
    connect: false,
    root: publicUrl.root,
    token: '',
    userId: '',
    userInfo1: null
  }
})