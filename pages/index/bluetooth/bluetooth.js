const app = getApp()
//Page Object
Page({
  data: {
    blueList: [],
    isfound: false,
    filterNoName: false,
    errMsg: ''
  },
  //options(Object)
  onShow: function (options) {
    console.log(options, 'options');

    var that = this
    wx.setNavigationBarTitle({
      title: '添加',
    });
    wx.getStorage({
      key: 'filterNoName',
      success(res) {
        let filterNoName = res.data
        that.setData({
          filterNoName: filterNoName
        })
      },
      fail(res) {
        wx.setStorage({
          key: "filterNoName",
          data: false
        })
        that.setData({
          filterNoName: false
        })
      }
    })
    that.setData({
      blueList: []
    })
    wx.openBluetoothAdapter({
      success(res) {
        console.log(res, 'res')
        wx.getBluetoothAdapterState({
          success(res) {
            let available = res.available
            if (available) {
              let discovering = res.discovering
              if (discovering) {
                that.startBluetoothDevicesDiscovery()
              } else {
                wx.startBluetoothDevicesDiscovery({
                  allowDuplicatesKey: true,
                  success(res) {
                    that.onBluetoothDeviceFound()
                  },
                  fail(res) {
                    that.setData({
                      errMsg: res.errMsg
                    })
                  }
                });
              }
            } else {
              that.setData({
                errMsg: res.errMsg
              })
            }

          }
        })
        // wx.onBluetoothAdapterStateChange(function(res) {
        //   console.log(res)
        // })
      },
      fail(res) {
        console.log(res, 'fail')
        if (res.errCode === 10001) {
          wx.showModal({
            title: '提示',
            content: '当前蓝牙权限未打开，请打开微信蓝牙权限再试',
            success(res) {
              if (res.confirm) {
                console.log('确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              that.startBluetoothDevicesDiscovery()
              that.setData({
                bluetoothOpen: true
              }) // 开启扫描附近的设备
              // that.getConnectedBluetoothDevices() // 获取所有小程序蓝牙模块生效期间所有蓝牙设备
            }
          })
        }
      }
    })
  },
  startBluetoothDevicesDiscovery: function () {
    var that = this;
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.showLoading({
      title: '正在寻找附近的设备',
    })
    // 开始搜索蓝牙设备，allowDuplicatesKey，会重复搜索同一设备
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        that.onBluetoothDeviceFound()
      },
    })
  },
  onBluetoothDeviceFound: function () {
    let that = this;
    wx.onBluetoothDeviceFound((res) => {
      if (res.devices.length) {
        console.log(res.devices, '搜索到的设备')
        wx.hideLoading()
        this.setData({
          isfound: true,
        })
      }
      let list = []
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          if (that.data.filterNoName) {
            return
          }
          device.name = '未知设备'
          // return
        }
        const foundDevices = that.data.blueList
        const idx = that.inArray(foundDevices, 'deviceId', device.deviceId)
        console.log(idx, 'idx')
        const data = {}
        if (idx === -1) {
          data[`blueList[${foundDevices.length}]`] = device
        } else {
          data[`blueList[${idx}]`] = device
          that.onBluetoothAdapterStateChange()
          //   that.createBLEConnection(res.devices[idx].deviceId)
        }
        that.setData(data)
      })
    })
  },
  onBluetoothAdapterStateChange() {
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
  },
  createBLEConnection(event) {
    let that = this;
    const ds = event.currentTarget.dataset
    const deviceId = ds.id
    const rss = ds.RISS
    console.log(deviceId)
    that.data.blueList.forEach(item => {
      let isconnect = item.isconnect
      let isedit = item.isedit
      this.setData({
        [isconnect]: false,
        [isedit]: false
      })
      if (item.deviceId == deviceId) {
        this.setData({
          [isconnect]: true
        })
        app.globalData.list.push(item)
      }
    })
    wx.setStorageSync('list', app.globalData.list);
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
    this.stopBluetoothDevicesDiscovery()
  },
  getBLEDeviceServices: function (deviceId) {
    let that = this
    wx.getBLEDeviceServices({
      deviceId,
      success(res) {
        console.log(res, 'service')
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            that.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    console.log(deviceId,serviceId,typeof(serviceId),'两个值')
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      services: serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            wx.readBLECharacteristicValue({ //读取低功耗蓝牙设备的特征值的二进制数据值
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.write) { //向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
            this.canWrite = true;
            this.deviceId = deviceId;
            this.serviceId = serviceId;
            this.characteristicId = item.uuid;
            this.writeBLECharacteristicValue();
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({ //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
      },
      fail: (res) => {
        console.log('getBLEDeviceCharacteristics', res)
      }
    });
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      const idx = inArray(this.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        this.chs.push({
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        });
      } else {
        this.chs[idx] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
    })
  },
  writeBLECharacteristicValue() { //向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
    // 向蓝牙设备发送一个0x00的16进制数据
    // let buffer =this.hexStringToArrayBuffer(“AAAA20201015555");
    let buffer = this.strToBinary('HE')
    wx.writeBLECharacteristicValue({
      deviceId: this.deviceId,
      serviceId: this.serviceId,
      characteristicId: this.characteristicId,
      value: buffer,
      success: function (res) {
        console.log('writeBLECharacteristicValue success', res)
      },
      fail: function (err) {
        console.log(err, 'errerrerrerrerr')
      }
    })
  },
  strToBinary(str){
    var result = [];
    var list = str.split("");
    for(var i=0;i<list.length;i++){
        if(i != 0){
            result.push(" ");
        }
        var item = list[i];
        var binaryStr = item.charCodeAt().toString(2);
        result.push(binartStr);
    }   
    return result
},
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },
  inArray(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === val) {
        return i;
      }
    }
    return -1;
  }
});