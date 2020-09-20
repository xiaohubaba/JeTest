//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
     this.setData({
       userInfo: app.globalData.userInfo,
       hasUserInfo: true
     })
    }
    wx.login({
      timeout:10000,
      success: (res)=>{
        console.log(res,'登录')
      },
      fail: (res)=>{},
      complete: (res)=>{}
    });
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  bindUserimg: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['拍照','从手机相册选择'],
      itemColor: '#000',
      success: (res) => {
        if (!res.cancel) {
          if (res.tapIndex === 0) {
            that.chooseImg('camera')
          } else if (res.tapIndex === 1) {
            that.chooseImg('album')
          }
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
  chooseImg: function (type) {
    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res,'相机')
        that.data.userimg = res.tempFilePaths[0],
          that.upload_file(urldate.upimg + 'shop/shopIcon', res.tempFilePaths[0])
        userimg = res.tempFilePaths[0];
        that.setData({
          userimg: userimg
        })
      }
    })
  },
  upload_file: function (url, filePath) {
    var that = this;
    var signature = signa.signaturetik('token=' + token, 'userAccessToken=' + userAccessToken, 'studentAccessToken=' + studentAccessToken);
    wx.uploadFile({
    url: urldate.upimg,//后台处理接口
    filePath: filePath,
    name: 'file',
    header: {
    'content-type': 'multipart/form-data'
    }, // 设置请求的 header
    formData: {//需要的参数
    'token': token,
    'signature': signature,
    'userAccessToken': userAccessToken,
    'studentAccessToken': studentAccessToken
    }, // HTTP 请求中其他额外的 form data
    success: function (res) {
    var data = JSON.parse(res.data);
    that.setData({
    userimg: data.path,
    });
    that.showMessage('上传成功');
    },
    fail: function (res) {
    }
    })
    },
    toDetailInfo: function () {
       wx.navigateTo({
         url: 'info/info',
         success: (result)=>{
           
         },
         fail: ()=>{},
         complete: ()=>{}
       });
    },
    checkAllItem: function () {
       wx.navigateTo({
         url: 'all/all',
       })
    },
    checkItem: function (event) {
      console.log(Number(event.currentTarget.dataset.a))
    },
    contactUs: function () {
      var that = this
      wx.showModal({
        title: '客服咨询',
        content: '400-025-6788\r\n点击确定咨询客服',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (res) => {
          if(res.confirm){
            that.handlePhone()
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    },
    handlePhone: function () {
      wx.makePhoneCall({
        phoneNumber: '400-025-6788',
        success: (res)=>{
          console.log(res)
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    },
    aboutUs: function () {
      wx.navigateTo({
        url: 'about/about',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
})