//Page Object
const app = getApp()
Page({
    data: {
      ischecked: false,
      inputValue: '',
      inputTestCode: '',
      iscode: false,
      phoneAndCode: false,
    },
    //options(Object)
    onLoad: function(options){
      wx.setNavigationBarTitle({
          title: '使用其他号码'
      });  
    },
    inputPhone(e) {
     this.setData({
       inputValue: e.detail.value
     })
    },
    inputTestCode() {
      this.setData({
        inputTestCode: e.detail.value
      })
    },
    getCode: function() {
      let num = 60
      var that = this
      if(!that.data.inputValue) {
         wx.showToast({
           title: '请输入手机号!',
           duration: 1500,
           icon: 'none'
         });
         return false
      }
     var request = wx.request({
        url: app.globalData.root + '/v800/wx/sms/send',
        data: {
          phone: that.data.inputValue,
          smsType: that.data.ischecked ? '02' : '01'
        },
        header: {'content-type':'application/x-www-form-urlencoded'},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (result)=>{
          if (result) {
            this.setData({
              getCodeStatus: true,
              iscode: true,
              time: num
          })
          let timer = setInterval(function() {
          that.data.time--
          if (that.data.time > 0) {
              that.setData({
                  time: that.data.time,
                  getCodeStatus: true
              })
          } else {
                  clearInterval(timer)
                  that.setData({
                     getCodeStatus: false,
                     time: that.data.time,
                     iscode: false
                  })
          }
          },1000)
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });     
  },
  completePhone() {
    let that = this
     if (that.data.inputTestCode && that.data.inputValue) {
         var reqTask = wx.request({
           url: app.globalData.root + '/v800/wx/login',
           data: {
             phone: that.data.inputValue,
             code: that.data.inputTestCode
           },
           header: {'content-type':'application/x-www-form-urlencoded'},
           method: 'POST',
           dataType: 'json',
           responseType: 'text',
           success: (result)=>{
             if (result) {
              wx.showToast({
                title: '保存成功',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
                success: (res)=>{
                  wx.navigateBack({
                    delta: 1
                  });
                }
              });
             }
           },
           fail: ()=>{},
           complete: ()=>{}
         });
     }
  }
});