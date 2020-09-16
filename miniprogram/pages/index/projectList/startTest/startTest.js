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
        imageList: [1,2,3,4,5,6],
        isBluetoothCanUse: false, // 检测蓝牙状态.是否能使用
        isSuccess: false, // 最终试验结果是否成功,
        isfinished: false //试验是否结束
    },
    //options(Object)
    onLoad: function (options) {
        var that = this
        wx.setNavigationBarTitle({
            title: '开始实验'
        });
        that.onBLEConnectionStateChange()
        setTimeout(function () {
            that.setData({
                deal: true
            })
        }, 5000)
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
                                dealTimePass: true,
                            })
                            setTimeout(function () {
                                that.setData({
                                    anaysis: true
                                })
                            }, 3000)
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
        }, 3000)
    },
    saveResult() {
        console.log('result')
    },
    inputValue() {

    },
    uploadImg() {
        let that = this
        wx.showActionSheet({
            itemList: ['拍照', '从手机相册选择'],
            itemColor: '#000',
            success: (res) => {
                if (!res.cancel) {
                    if (res.tapIndex === 0) {
                        that.chooseImageShop('camera')
                    } else if (res.tapIndex === 1) {
                        that.chooseImageShop('album')
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
    chooseImageShop: function (type) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function (res) {
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
            url: urldate.upimg, //后台处理接口
            filePath: filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            formData: { //需要的参数
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
    toResult() {
        this.setData({
            isSuccess: true,
            isfinished: true
        })
        wx.setNavigationBarTitle({
            title: '实验结果'
        });
    }
});