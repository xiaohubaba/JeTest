//Page Object
const app = getApp()
Page({
    data: {
        deal: false,
        dealTimePass: false,
        anaysis: false,
        afterDeal: false,
        kuosan: false,
        upload: false,
        showImage: false,
        userimg: '',
        imageList: [],
        num: 0,
        isBluetoothCanUse: false, // 检测蓝牙状态.是否能使用
        isSuccess: false, // 最终试验结果是否成功,
        isfinished: false, //试验是否结束,
        currentData: {}
    },
    //options(Object)
    onLoad: function (options) {
        var that = this
        wx.setNavigationBarTitle({
            title: '开始实验'
        });
        this.setData({
            num: app.globalData.imageNum
        })
        if (wx.getStorageSync('current-data')) {
            that.setData({
                currentData: wx.getStorageSync('current-data')
            })
        }
        for (var i=0;i<that.data.num;i++) {
           that.data.imageList.push({
               i:i,
               img: '../../../../images/upload.png',
               showColor: '',
               colorImg: ''
           })
        }
        console.log(that.data.imageList,'list')
        this.setData({
            imageList: that.data.imageList
        })
        that.onBLEConnectionStateChange()
        setTimeout(function () {
            wx.showModal({
                title: '提示',
                content: '预热结束，请放入耗材，并在03：00\r\n前点击下一步进行样本处理',
                showCancel: false,
                confirmText: '下一步',
                confirmColor: '#3CC51F',
                success: (res) => {
                    if (res.confirm) {
                        if (!that.data.isBluetoothCanUse) {
                            that.setData({
                                deal: true
                            })
                            console.log(parseInt(that.data.currentData.sampleProcessingTime) * 1000,that.data.dealTimePass)
                            setTimeout(function() {
                                that.setData({
                                    dealTimePass: true
                                })
                               console.log(that.data.dealTimePass)
                               if (that.data.dealTimePass) {
                                setTimeout(function () {
                                    that.setData({
                                        anaysis: true
                                    })
                                }, 180000)
                               }
                            },parseInt(that.data.currentData.sampleProcessingTime) * 1000)
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '蓝牙连接异常，实验失败，请重新实验',
                                showCancel: true,
                                cancelText: '取消',
                                cancelColor: '#000000',
                                confirmText: '确定',
                                confirmColor: '#3CC51F',
                                success: (res) => {
                                    if (res.confirm) {
                                        wx.setNavigationBarTitle({
                                            title: '实验异常'
                                        });
                                        that.setData({
                                            isSuccess: false,
                                            isfinished: true
                                        })
                                    }
                                },
                                fail: () => {},
                                complete: () => {}
                            });
                        }
                    }
                },
                fail: () => {},
                complete: () => {}
            });
        }, 10000)
    },
    onBLEConnectionStateChange() {
        wx.onBLEConnectionStateChange((res) => {
            if (res.connect) {
                this.setData({
                    isBluetoothCanUse: true
                })
            }
        });
    },
    nextStep: function () {
        let that = this
        this.setData({
            kuosan: true
        })
        setTimeout(function () {
            that.setData({
                upload: true,
                kuosan: false
            })
        }, parseInt(that.data.currentData.nucleicDiffusionTime) * 1000)
    },
    saveResult() {
        console.log('result')
    },
    inputValue() {

    },
    uploadImg(e) {
        let that = this
        wx.showActionSheet({
            itemList: ['拍照', '从手机相册选择'],
            itemColor: '#000',
            success: (res) => {
                if (!res.cancel) {
                    if (res.tapIndex === 0) {
                        that.chooseImageShop('camera',e.currentTarget.dataset.id)
                    } else if (res.tapIndex === 1) {
                        that.chooseImageShop('album',e.currentTarget.dataset.id)
                    }
                }
                that.setData({
                    showImage: true
                })
            },
            fail: () => {},
            complete: () => {}
        });
    },
    chooseImageShop: function (type,index) {
        var that = this;
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: [type],
            success: function (res) {
                console.log(res,'resresresres')
                wx.compressImage({
                    src: res.tempFilePaths[0], // 图片路径
                    quality: 0, // 压缩质量
                    success: (res) => {
                        console.log(res,'resss')
                        wx.showLoading({
                            title: '正在上传中',
                            mask: true
                        });
                        that.setData({
                            userimg: res.tempFilePath
                        })
                        console.log(that.data.userimg)
                    that.upload_file(app.globalData.root + '/v800/wx/picture/upload', that.data.userimg,index)
                    }
                  })
                // var ctx = wx.createCanvasContext(canvasId);
                // ctx.drawImage(res.tempFilePaths[0],0,0,cW,cH);
                // ctx.draw(false,setTimeout(function() {
                //     wx.canvasToTempFilePath({
                //         x: 0,
                //         y: 0,
                //         width: cW,
                //         height: cH,
                //         destWidth: cW,
                //         destHeight: cH,
                //         canvasId: 'compressCanvasId',
                //         fileType: 'jpg',
                //         quality: 1,
                //         success: (res)=>{
                //              console.log(res,'canvas压缩后的结果')
                //         },
                //         fail: ()=>{},
                //         complete: ()=>{}
                //     }, this);
                // }))
            //   let userimg = res.tempFilePaths[0];
            //     that.setData({
            //         userimg: userimg
            //     })
            }
        })
    },
    upload_file: function (url, filePath,index) {
        var that = this;
        // var signature = signa.signaturetik('file=' + filePath);
        wx.uploadFile({
            url: url, //后台处理接口
            filePath: filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data',
                'token': app.globalData.token
            }, // 设置请求的 header
            // formData: {
            //     'file': filePath
            // }, // HTTP 请求中其他额外的 form data
            success: function (res) {
                var data = JSON.parse(res.data);
                // console.log(that.data.imageList,index,that.data.userimg,data.data)
                that.data.imageList[index].img = that.data.userimg
                that.data.imageList[index].showColor = data.data
                that.setData({
                    imageList: that.data.imageList
                })
                wx.hideLoading()
                console.log(that.data.imageList,data.data)
                wx.showToast({
                                title: '上传成功',
                                icon: 'none',
                                duration: 1500,
                            });
                console.log(res,'图片上传后的结果')
            },
            fail: function (res) {
            }
        })
    },
    toResult() {
        var that = this
        this.setData({
            isSuccess: true,
            isfinished: true
        })
        console.log(that.data.imageList,wx.getStorageSync('current-data'))
        let curdata = wx.getStorageSync('current-data');
            that.data.imageList.forEach(item=> {
               if (curdata.positiveColor == '黄色') {
                if (item.showColor == '黄色') {
                    item.colorImg = '../../../../images/red.png'
                } else if (item.showColor == '红色') {
                    item.colorImg = '../../../../images/green.png'
                } else if (item.showColor == '' || item.showColor == null) {
                    item.colorImg = '../../../../images/upload.png'
                } 
               } else if (curdata.negativeColor == '黄色') {
                if (item.showColor == '黄色') {
                    item.colorImg = '../../../../images/green.png'
                } else if (item.showColor == '红色') {
                    item.colorImg = '../../../../images/red.png'
                } else if (item.showColor == '' || item.showColor == null) {
                    item.colorImg = '../../../../images/upload.png'
                } 
               }
            })
        that.setData({
            imageList: that.data.imageList
        })
        console.log(that.data.imageList)
        wx.setNavigationBarTitle({
            title: '实验结果'
        });
    }
});