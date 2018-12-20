//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TypeList:null,
    hidden_loading:false,
    sraech_val:null,//搜索的值
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getVal:function(e){
    this.setData({
      sraech_val:e.detail.value
    })
  },
  search:function(){
    wx.navigateTo({
      url: '../typeList/typeList?sraech_val=' + this.data.sraech_val
    })
  },
  jumpTypeList:function(e){
    var type = e.currentTarget.dataset.type;
    var typeName = e.currentTarget.dataset.typename;
    wx.navigateTo({
      url: '../typeList/typeList?type=' + type + "&typeName=" + typeName
    })
  },
  onLoad: function () {
    var that = this
    wx:wx.request({
      url: 'https://api.zhangcc.top/xiaoshuo/cats/lv2/statistics',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        var list1 = res.data
        // console.log(list1)
        that.setData({
          TypeList: list1,
          hidden_loading:true,
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
