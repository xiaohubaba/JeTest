const app = getApp();
//Page Object
Page({
    data: {
        type: 0,
        inputValue: ''
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
        if (that.data.inputValue) {
            let data = {}
            data = app.globalData.type == 1 ? {conpany: that.data.inputValue} : app.globalData.type == 2 ? {companyAddress: that.data.inputValue} : app.globalData.type == 3 ? {profession:that.data.inputValue} : ''
             wx.request({
               url: app.globalData.root + '/v800/wx/user/updateUser',
               data:data,
               header: {'content-type':'application/x-www-form-urlencoded'},
               method: 'POST',
               dataType: 'json',
               responseType: 'text',
               success: (result)=>{
                   wx.showToast({
                       title: '修改成功',
                       icon: 'none',
                   });
                   wx.navigateBack({
                       delta: 1
                   });
               },
               fail: ()=>{},
               complete: ()=>{}
           });
        }
    }
});