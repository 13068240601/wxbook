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
    recommend:[],  //推荐内容
    mins:null//小分类
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //获取搜索推荐
  getVal:function(e){
    var that = this
    this.setData({
      sraech_val:e.detail.value
    },function(){
      wx.request({
        url: app.globalData.url+'xiaoshuo/book/auto-complete?query=' + that.data.sraech_val,
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          // console.log(res)
          that.setData({
            recommend: res.data.keywords
          })
        },
        fail: function (res) {
          
        },
        complete: function (res) {},
      })
    })
  },
  //跳转搜索结果页
  search:function(){
    wx.navigateTo({
      url: '../typeList/typeList?sraech_val=' + this.data.sraech_val
    })
  },
  //点击推荐列表跳转搜索结果页
  recommend(e){
    var recommend = e.currentTarget.dataset.recommend;
    var that = this
    that.setData({
      sraech_val: recommend
    },function(){
      that.search()
    })
  },
  //点击分类跳转结果页
  jumpTypeList:function(e){
    var type = e.currentTarget.dataset.type;
    var typeName = e.currentTarget.dataset.typename;
    var i = e.currentTarget.dataset.i
    var mins = JSON.stringify(this.data.mins[type][i])
    wx.navigateTo({
      url: '../typeList/typeList?type=' + type + "&typeName=" + typeName + '&mins=' + mins
    })
  },
  onLoad: function () {
    var that = this
    wx:wx.request({
      url: app.globalData.url+'xiaoshuo/cats/lv2/statistics',
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
        });
        wx.request({
          url: app.globalData.url+'xiaoshuo/cats/lv2',
          header: {},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            that.setData({
              mins:res.data,
              hidden_loading: true,
            })
          },
          fail: function (res) {
          },
          complete: function (res) { },
        })
      },
      fail: function(res) {
        that.setData({
          hidden_loading: true,
        },function(){
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1500
          })
        });
      },
      complete: function(res) {},
    })
  }
})
