2//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    typeBookList:[],
    start:0,//起始页码
    limit:10,//每页条数
    hidden_loading:true,
    loading:"数据加载中...",
    gender: null,
    major: null,
    author:null,//作者
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  network_error:function(){
    this.setData({
      hidden_loading: true,
    }, function () {
      wx.showToast({
        title: '网络错误',
        icon: 'none',
        duration: 1500
      })
    })
  },
  //页面跳转
  jumpInfo:function(e){
    var book_id = e.currentTarget.dataset.book_id;
    var contentType = e.currentTarget.dataset.content_type;
    // console.log(contentType)
    wx.navigateTo({
      url: '../bookInfo/bookInfo?book_id=' + book_id + '&contentType=' + contentType
    })
  },
  getList(){
    var that = this
    that.setData({
      hidden_loading:false,
    })
    wx: wx.request({
      url: 'https://api.zhangcc.top/xiaoshuo/book/by-categories',
      data: {
        // gender: options.type,
        gender: that.data.gender,
        type: "hot",
        // major: options.typeName,
        major: that.data.major,
        minor: "",
        start: that.data.start,
        limit: that.data.limit,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          hidden_loading: true,
        })
        var list1 = that.data.typeBookList;
        for (var i = 0; i < res.data.books.length;i++){
          list1.push(res.data.books[i])          
        }
        // console.log(list1)
        that.setData({
          typeBookList: list1
        });
      },
      fail: function (res) { 
        that.network_error()
      },
      complete: function (res) { },
    })
  },
  //获取搜索结果
  getSearch(){
    var that = this;
    that.setData({
      hidden_loading: false,
    })
    wx:wx.request({
      url: 'https://api.zhangcc.top/xiaoshuo/book/fuzzy-search',
      data: {
        query: that.data.sraech_val
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          hidden_loading: true,
        })
        var list1 = that.data.typeBookList;
        for (var i = 0; i < res.data.books.length; i++) {
          list1.push(res.data.books[i])
        }
        // console.log(list1)
        that.setData({
          typeBookList: list1
        });
        // console.log(res.data)
      },
      fail: function(res) {
        this.network_error()
      },
      complete: function(res) {},
    })
  },
  //获取作者名下的书籍
  getAuthor:function(){
    var that = this;
    that.setData({
      hidden_loading: false,
    })
    wx:wx.request({
      url: 'https://api.zhangcc.top/xiaoshuo/author-books',
      data: {
        author: that.data.author
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        if (res.statusCode==200){
          var list1 = that.data.typeBookList;
          for (var i = 0; i < res.data.books.length; i++) {
            list1.push(res.data.books[i])
          }
          // console.log(list1)
          that.setData({
            typeBookList: list1
          });
          that.setData({
            hidden_loading: true,
          })
        }
      },
      fail: function(res) {
        this.network_error()
      },
      complete: function(res) {},
    })
  },
  onLoad: function (options) {
    var that = this
    if (options.sraech_val){
      wx.setNavigationBarTitle({
        title: options.sraech_val,
      })
      this.setData({
        sraech_val: options.sraech_val
      },function(){
        that.getSearch()
      })
    }else if (options.author){
      wx.setNavigationBarTitle({
        title: options.author,
      })
      that.setData({
        author: options.author
      },function(){
        that.getAuthor()
      })
    }else{
      // console.log(options.type, options.typeName)
      wx.setNavigationBarTitle({
        title: options.typeName,
      })
      this.setData({
        gender: options.type,
        major: options.typeName,
      })
      this.getList()
    }
  },
  lower: function (e) {
    if(this.data.gender){
      // console.log("到底了")
      var that = this
      var s = this.data.start
      s++
      this.setData({
        loading: "下一页加载中..."
      })
      this.setData({
        start: s
      }, function () {
        that.getList()
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
