const app = getApp()

//Page Object
Page({
    data: {
        list: ['全部','已完成','阳性','阴性','未完成'],
        list1: [{time:'2020-02-02 12:00',long:'15',color: '黄色',t1: '48',t2: '2',t3: '48',t4: '2',type: 1},
        {time:'2020-02-02 12:00',long:'15',color: '红色',t1: '48',t2: '2',t3: '48',t4: '2',type: 2},
        {time:'2020-02-02 12:00',long:'15',color: '温度过高',t1: '48',t2: '2',t3: '48',t4: '2',type: 3,detail:'温度不稳定，5分18秒温度过高实验失败'}],
        list2: [],
        list3: [{time:'2020-02-02 12:00',long:'15',color: '黄色',t1: '48',t2: '2',t3: '48',t4: '2',type: 1},
        {time:'2020-02-02 12:00',long:'15',color: '红色',t1: '48',t2: '2',t3: '48',t4: '2',type: 2},
        {time:'2020-02-02 12:00',long:'15',color: '温度过高',t1: '48',t2: '2',t3: '48',t4: '2',type: 3,detail:'温度不稳定，5分18秒温度过高实验失败'}],
        list4: [],
        list5: [],
        selected: 0
    },
    //options(Object)
    onLoad: function(options){
        wx.setNavigationBarTitle({
            title: '我的项目',
        });
    },
    selected: function (e) {
     let index = e.currentTarget.dataset.index
     this.setData({
         selected: index
     })
    }
});