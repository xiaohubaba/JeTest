//Page Object
Page({
    data: {
        getCodeStatus: false,
        time: 0
    },
    //options(Object)
    onLoad: function(options){
        wx.setNavigationBarTitle({
            title: '登录'
        });
    },
    getCode: function() {
        let num = 60
        var that = this
        this.setData({
            getCodeStatus: true,
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
                   time: that.data.time
                })
        }
        },1000)
       
    },
    useOtherPhone: function() {
      wx.navigateTo({
          url: 'useOtherPhone/useOtherPhone'
      });
    }
});