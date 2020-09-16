//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bluetoothOpen: false,
    sureInfo: false,
    phone: false,
    showModal: false,
    showModal1: false,
    authorize: false,
    list: [],
    blueList: [],
    phoneNumber: '',
    services: '',
    notifyId: '',
    writeId: '',
    swiperList: ['../../images/swiper1.jpg','../../images/swiper2.jpg','../../images/swiper3.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 600
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '../my/my',
      success: (result)=>{
        console.log(result,'1234')
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  onLoad: function () {
    var that = this
    wx.hideTabBar();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        sureInfo: false
      })
      console.log(app.globalData.userInfo)
      wx.showTabBar();
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          sureInfo: false
        })
        console.log('用户1',res.userInfo)
      }
      wx.showTabBar();
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log('用户2',res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            sureInfo: false
          })
        }
      })
      wx.showTabBar();
    }
    wx.getSetting({
      success: (res)=>{
        if (res.authSetting['scope.userInfo']) {
            this.setData({
              authorize: true
            })
        } else {
          this.setData({
            authorize: false
          })
        }
      }
    });
     console.log(that.data.hasUserInfo,that.data.sureInfo)
    // 获取手机信息并且监听蓝牙状态，如果是关闭的，就打开
    wx.getSystemInfo({
      success(res) {
        console.log('手机是:'+ " " + res.model,res)
      }
    })
  },
  onShow: function() {
    let that = this
   if (wx.getStorageSync('list')) {
    this.setData({
      list: wx.getStorageSync('list')
    })
   }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    wx.showTabBar();
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      sureInfo: true,
      showModal:false,
      showModal1: false
    })
  },
  // 使用期他头像昵称
  userOther: function() {
   wx.navigateTo({
     url: 'userOther/userOther'
   });
  },
  // 手机号登录
  phoneLogin: function() {
    wx.navigateTo({
      url: 'phoneLogin/phoneLogin'
    });
  },
  // 微信登录
  weixinLogin: function() {
          wx.hideTabBar();
          this.setData({
            showModal: true,
         })
  },
  weixinPhoneLogin: function(e) {
    console.log(e)
    this.setData({
      showModal1: true
    })
  },
  // 取消登录
  cancelLogin: function() {
    var that = this
   this.setData({
     showModal: false,
     showModal1: false
   })
    if (!that.data.showModal) {
      setTimeout(function() {
        wx.showTabBar();
      },250)
    }
  },
  userOtherPhone: function() {
    wx.navigateTo({
      url: 'phoneLogin/useOtherPhone/useOtherPhone'
    });
  },
  allProject: function() {
    wx.navigateTo({
      url: 'projectList/projectList',
    });
  },
  myProject() {
    wx.navigateTo({
      url: '/pages/my/all/all',
    });
  },
  addEquipmet: function() {
   wx.navigateTo({
     url: 'bluetooth/bluetooth'
   });
  },
  createBLEConnection(event) {
    let that = this;
    const ds = event.currentTarget.dataset
    const deviceId = ds.id
    const rss = ds.RISS
    console.log(deviceId)
    that.data.blueList.forEach(item => {
      let isconnect = item.isconnect
      this.setData({
        [isconnect]: false
      })
      if (item.deviceId == deviceId) {
        this.setData({
          [isconnect]: true
        })
        app.globalData.list.push(item)
        if (wx.getStorageSync('list')) {
          wx.getStorageSync.push(item)
        } else {
         wx.setStorageSync('list', app.globalData.list);
        }
      }
    })
    // app.globalData.bluetoothId = deviceId
    // 开始连接蓝牙设备
    let device = {
      deviceId: deviceId,
      rs: rss
    }
    wx.showLoading({
      title: '正在连接中'
    })
    wx.createBLEConnection({
      deviceId: deviceId,
      timeout: 20000,
      success: (res) => {
        app.globalData.connect = true;
        wx.hideLoading();
        that.data.blueList.forEach(item => {
          let isconnect = item.isconnect
          this.setData({
            [isconnect]: false
          })
          if (item.deviceId == deviceId) {
            this.setData({
              [isconnect]: true
            })
            if (wx.getStorageSync('list')) {
              wx.getStorageSync('list').push(item)
            } else {
              wx.setStorageSync('list', app.globalData.list);
            }
            wx.setData({
              list: wx.getStorageSync('list')
            })
          }

        })
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 800
        })
        wx.navigateBack({
          delta: 1
        });
        that.getBLEDeviceServices(deviceId)
      },
      fail: (res) => {
        wx.showLoading({
          title: '连接失败，请重新配对'
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 3000)
        app.globalData.connect = false;
      },
      complete: (res) => {
        console.log(res)
      }
    })
    // 在连接蓝牙设备后，停止搜索蓝牙。
    that.stopBluetoothDevicesDiscovery()
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      success: (res)=>{
        console.log(res)
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  getBLEDeviceServices(deviceId) {
    var that = this
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      success: function (res) {
        var model = res.services[0]
        that.setData({
          services: model.uuid
        })
        that.getCharacteId(deviceId)//6.0
      }
    })
  },
  getCharacteId(deviceId) {
    var that = this 
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.services,
      success: function (res) {
        for (var i = 0; i < res.characteristics.length; i++) {//2个值
          var model = res.characteristics[i]
          if (model.properties.notify == true) {
            that.setData({
              notifyId: model.uuid//监听的值
            })
            that.startNotice(model.uuid)//7.0
          }
          if (model.properties.write == true){
            that.setData({
              writeId: model.uuid//用来写入的值
            })
          }
        }
      }
    })
  },
  startNotice(uuid){
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
      deviceId: that.data.deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.services,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: uuid,  //第一步 开启监听 notityid  第二步发送指令 write
      success: function (res) {
// 设备返回的方法
      　　  wx.onBLECharacteristicValueChange(function (res) {
         　　 　　// 此时可以拿到蓝牙设备返回来的数据是一个ArrayBuffer类型数据，所以需要通过一个方法转换成字符串
         　　　　 var nonceId = that.ab2hex(res.value) 
　　　　　　//拿到这个值后，肯定要去后台请求服务（当前步骤根据当前需求自己书写），获取下一步操作指令写入到蓝牙设备上去
　　　　　wx.request({
                  　　method: "POST",
　　　　　　　　　
                 　　 data: {
                   　　　xx:nonceId
               　　   },
                　　  url: url,
                  　　success: (res) => {
                    　　//res.data.data.ciphertext：我这边服务返回来的是16进制的字符串，蓝牙设备是接收不到当前格式的数据的，需要转换成ArrayBuffer
                    　　that.sendMy(that.string2buffer(res.data.data.ciphertext))//8.0
                    　　// 服务器返回一个命令  我们要把这个命令写入蓝牙设备
                　　  }
              })
                   })
　　}
    })
  },
  sendMy(buffer){
    var that = this 
    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.services,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: that.data.writeId,//第二步写入的特征值
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success: function (res) {
        console.log("写入成功")
      },
      fail: function () {
        console.log('写入失败')
      },
      complete:function(){
        console.log("调用结束");
      }
    })
  },
  string2buffer(str) {
    let val = ""
    if(!str) return;
    let length = str.length;
    let index = 0;
    let array = []
    while(index < length){
      array.push(str.substring(index,index+2));
      index = index + 2;
    }
    val = array.join(",");
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },
 
  /**
   * 将ArrayBuffer转换成字符串
   */
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  }
})
