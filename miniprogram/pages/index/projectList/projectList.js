//Page Object
const app = getApp()
Page({
    data: {
        type: 1,
        array: [1,2,3,4,5,6,7,8],
        currentIndex: 1,
        isInput: false,
        list: [{
            id:'1',
            idIndex: 0,
            name: '核酸检测'
        },{
            id:'1',
            idIndex: 0,
            name: '核酸检测1'
        },{
            id:'1',
            idIndex: 0,
            name: '核酸检测2'
        },{
            id:'1',
            idIndex: 0,
            name: '核酸检测'
        },{
            id:'1',
            idIndex: 0,
            name: '核酸检测'
        },{
            id:'1',
            idIndex: 0,
            name: '核酸检测'
        },{
            id:'1',
            idIndex: 0,
            name: '核酸检测'
        },{
            id:'1',
            idIndex: 0,
            name: '核酸检测'
        }]
    },
    //options(Object)
    onLoad: function(options){
      wx.setNavigationBarTitle({
          title: '项目列表'
      });   
    },
    startTest: function(e) {
        var that = this;
        let index = e.currentTarget.dataset.b;
        console.log(e)
       if (!app.globalData.connect) {
          wx.showModal({
              title: '开始实验',
              content: `项目名称：${that.data.list[index].name}\r\n样本数量：${that.data.currentIndex}`,
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: (result) => {
                  if(result.confirm){
                      wx.navigateTo({
                          url: 'startTest/startTest',
                      });
                  }
              },
              fail: ()=>{},
              complete: ()=>{}
          });
       } else {
           wx.showModal({
               title: '提示',
               content: '请检查设备连接是否正常',
               showCancel: true,
               cancelText: '取消',
               cancelColor: '#000000',
               confirmText: '确定',
               confirmColor: '#3CC51F',
               success: (result) => {
                   if(result.confirm){
                       console.log(result)
                   }
               },
               fail: ()=>{},
               complete: ()=>{}
           });
       }
    },
    isChoose: function(e) {
        console.log(e)
        let num = Number(e.currentTarget.dataset.a);
      this.setData({
          type: num
      })
    },
    bindPickerChange: function(e) {
       let that = this
       let index = e.target.dataset.current;
       let list = that.data.list;
       list[index].idIndex = e.detail.value;
       list[index].id = that.data.array[e.detail.value];
       that.setData({
           list: list,
           currentIndex: that.data.array[e.detail.value]
       })
    },
    inputValue: function (event) {
        let ev = event.detail.value
        if (ev) {
            this.setData({
                isInput: true
            })
        } else {
            this.setData({
                isInput: false
            })
        }
    }
});