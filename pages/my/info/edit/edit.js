const app = getApp();
//Page Object
Page({
    data: {
        type: 0,
        inputValue: '',
        profession: '',
        conpany: '',
        companyAddress: ''
    },
    //options(Object)
    onLoad: function(options){
        this.setData({
            type: app.globalData.type
        })
        switch (app.globalData.type) {
            case 1:
                wx.setNavigationBarTitle({
                    title: '公司名称',
                });
                if (app.globalData.userInfo1 && app.globalData.userInfo1.conpany) {
                    this.setData({
                        conpany: app.globalData.userInfo1.conpany
                    })
                }
                break;
            case 2:
                wx.setNavigationBarTitle({
                    title: '公司地址',
                });
                if (app.globalData.userInfo1 && app.globalData.userInfo1) {
                    this.setData({
                        companyAddress: app.globalData.userInfo1.companyAddress
                    })
                }
                break;
            case 3:
                wx.setNavigationBarTitle({
                    title: '职业',
                });
                if (app.globalData.userInfo1 && app.globalData.userInfo1.profession) {
                    this.setData({
                        profession: app.globalData.userInfo1.profession
                    })
                }
                break;
        }
    },
    bindKeyinput: function (e) {
      this.setData({
          inputValue: e.detail.value
      })
    },
    save() {
        var that = this
        switch (app.globalData.type) {
            case 1:
                wx.setNavigationBarTitle({
                    title: '公司名称',
                });
                break;
            case 2:
                wx.setNavigationBarTitle({
                    title: '公司地址',
                });
                break;
            case 3:
                wx.setNavigationBarTitle({
                    title: '职业',
                });
                break;
        }
        console.log(that.data.inputValue)
        // if (that.data.inputValue) {
            let data = {}
            data = app.globalData.type == 1 ? {conpany: that.data.inputValue ? that.data.inputValue : that.data.conpany,id:app.globalData.userId} : app.globalData.type == 2 ? {companyAddress: that.data.inputValue ? that.data.inputValue : that.data.companyAddress,id:app.globalData.userId} : app.globalData.type == 3 ? {profession:that.data.inputValue ? that.data.inputValue : that.data.profession,id:app.globalData.userId} : ''
             wx.request({
               url: app.globalData.root + '/v800/wx/user/updateUser',
               data:data,
               header: {'content-type':'application/x-www-form-urlencoded','token':app.globalData.token},
               method: 'POST',
               dataType: 'json',
               responseType: 'text',
               success: (result)=>{
                //    app.getInfo = res => {
                //        console.log(res,'111111111111111')
                //    }
                wx.request({
                    url: app.globalData.root + '/v800/wx/user/getUserInfo',
                    data: {},
                    header: {'content-type':'application/json','token': app.globalData.token},
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    success: (res)=>{
                      app.globalData.userInfo1 = res.data.data
                      wx.showToast({
                        title: '修改成功',
                        icon: 'none',
                        duration: 2000
                    });
                     wx.navigateTo({
                         url: '/pages/my/info/info',
                     });
                    },
                    fail: ()=>{},
                    complete: ()=>{}
                  });
               },
               fail: ()=>{},
               complete: ()=>{}
           });
        // }
    }
});