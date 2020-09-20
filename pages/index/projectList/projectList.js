//Page Object
const app = getApp()
Page({
    data: {
        type: 1,
        array: [1,2,3,4,5,6,7,8],
        currentIndex: 1,
        isInput: false,
        total: 0,
        list: [],
        inputValue: ''
    },
    //options(Object)
    onLoad: function(options){
        let that = this
      wx.setNavigationBarTitle({
          title: '项目列表'
      });   
      let params = {
          pageNum: 1,
          pageSize: 10,
          searchContext: ''
      }
      that.getList(params)
    },
    startTest: function(e) {
        var that = this;
        let index = e.currentTarget.dataset.b;
        console.log(e)
       if (!app.globalData.connect) {
          wx.showModal({
              title: '开始实验',
              content: `项目名称：${that.data.list[index].projectName}\r\n样本数量：${that.data.list[index].cId}`,
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
                      app.globalData.imageNum = that.data.list[index].cId
                      console.log(that.data.list[index],index)
                      wx.setStorageSync('current-data', that.data.list[index]);
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
       list[index].cId = that.data.array[e.detail.value];
       that.setData({
           list: list,
           currentIndex: that.data.array[e.detail.value]
       })
       console.log(that.data.list,that.data.currentIndex)
    },
    inputValue: function (event) {
        let ev = event.detail.value
        this.setData({
            inputValue: ev
        })
    },
    getList(params) {
        let that = this
       wx.request({
          url: app.globalData.root + '/v800/wx/presetmode/list',
          data: params,
          header: {'content-type':'application/x-www-form-urlencoded','token':app.globalData.token},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (res)=>{
            if(res.data.code == 200 && res.data.data) {
              this.setData({
                  list: res.data.data.list,
                  total: res.data.data.list.length
              })
              that.data.list.forEach(item=> {
                  item.idIndex = 0
                  item.cId = '1'
              })
              that.setData({
                  list: that.data.list
              })
              console.log(that.data.list)
            }
          },
          fail: ()=>{},
          complete: ()=>{}
      });
    },
    searchData(e) {
        let that = this
        let params = {
            pageNum: 1,
            pageSize: 10,
            searchContext: e.detail.value
        }
        that.getList(params)
    }
});