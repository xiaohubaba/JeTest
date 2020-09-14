//Page Object
const app = getApp()
Page({
    data: {
        userInfo: app.globalData.userInfo,
        hasUserInfo: false,
        userInfo1: null
    },
    //options(Object)
    onLoad: function(options){
      console.log(app.globalData.userInfo1)
       wx.setNavigationBarTitle({
           title: '个人信息',
           success: (result)=>{
               
           },
           fail: ()=>{},
           complete: ()=>{}
       });
       if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
       }
       if (app.globalData.userInfo1) {
          console.log(app.globalData.userInfo1)
          this.setData({
            userInfo1: app.globalData.userInfo1
          })
       }
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
      loginOut: function () {

      },
      handleInfo: function (event) {
        app.globalData.type = Number(event.currentTarget.dataset.a)
        console.log(app.globalData.type,'tp')
         wx.navigateTo({
            url: 'edit/edit',
            success: (res)=>{
                
            },
            fail: ()=>{},
            complete: ()=>{}
        });
      }
});