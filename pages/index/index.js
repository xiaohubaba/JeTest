//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk')
var qqmapsdk
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
    showModal2: false,
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
    duration: 600,
    province: '',
    city: '',
    isgetLocation: false
    
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
    qqmapsdk = new QQMapWX({
      key: 'XSPBZ-7HPRP-IDUDV-LIW45-IEF2K-HTBLT' //自己的key秘钥 
    });
    that.getLocation()
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
    var that = this
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
    if (that.data.authorize) {
       this.setData({
        showModal2: true
       })
    }
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
    var that = this
    var reqTask = wx.request({
      url: app.globalData.root +  '/v800/wx/decrypt',
      data: {
        encryptData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      header: {'content-type':'application/x-www-form-urlencoded','token':app.globalData.token},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        console.log(res.data.data)
        this.setData({
          phoneNumber: JSON.parse(res.data.data).phoneNumber
        })
        this.setData({
          showModal1: true
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
        if (app.globalData.list) {
          app.globalData.list.forEach(item => {
            let isconnect = item.isconnect
            if (item.deviceId == deviceId) {
              this.setData({
                [isconnect]: true
              })
              that.data.blueList.unshift(item)
              wx.setStorageSync('blueList',that.data.blueList)
              this.setData({
                list: wx.getStorageSync('blueList')
              })
            }
  
          })
        }
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
        console.log(res,'kkkkkkkkkkkkkk')
        var model = res.services[0]
        that.setData({
          services: model.uuid
        })
        that.getCharacteId(deviceId)//6.0
      },
      complete: function(res) {
        console.log(res)
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
        wx.showToast({
          title: '成功发送，哈哈',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
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
  },
  edit(e) {
   console.log(e)
  },
  //取消获取地理位置
  cancelLocation() {
    this.setData({
      showModal2: false
    })
  },
  // 获取地理位置
  getLocation() {
    let vm = this
    wx.getSetting({
      success: (res) => {
        console.log("设置信息"+JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        console.log(res)
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude,
          isgetLocation: true,
          showModal2: false
        })
 
      }
    })
  }
})
