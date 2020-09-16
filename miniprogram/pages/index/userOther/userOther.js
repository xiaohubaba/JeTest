const app = getApp()

//Page Object
Page({
    data: {
      inputValue: '',
      showImage: false,
      shuru: false
    },
    //options(Object)
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '新建用户信息'
        });
    },
    chooseImage: function () {
        var that = this
        wx.showActionSheet({
            itemList: ['拍照','从手机相册选择'],
            itemColor: '#000',
            success: (res) => {
                if (!res.cancel) {
                    if (res.tapIndex === 0) {
                        that.chooseImageShop('camera')
                    } else if (res.tapIndex === 1) {
                        that.chooseImageShop('album')
                    }
                }
                this.setData({
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
    save: function () {
        var that = this
        if (that.data.inputValue === '') {
            wx.showToast({
                title: '请输入昵称',
                icon: 'none',
                duration: 1000
            });
            return false
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    inputValue: function (e) {
        var that = this
        that.data.inputValue = e.detail.value
        if (that.data.inputValue === '' || that.data.inputValue === null) {
            that.setData({
                shuru: false
            }) } else {
                that.setData({
                    shuru: true
                })
            }
        }
});