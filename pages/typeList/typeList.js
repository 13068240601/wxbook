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
    minor: '',
    type: "hot",
    author:null,//作者
    mins:null,//小分类列表
    active:[true],
    typeAvtive:[true],
    typeList:[
      { zh: '热门', en: 'hot' },
      { zh: '新书', en: 'new' },
      { zh: '好评', en: 'reputation' },
      { zh: '完结', en: 'over' },
      { zh: '包月', en: 'monthly' }
    ]
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
    wx.navigateTo({
      url: '../bookInfo/bookInfo?book_id=' + book_id + '&contentType=' + contentType
    })
  },
  //切换分类
  changType:function(e){
    var i = e.currentTarget.dataset.i
    var type = e.currentTarget.dataset.type
    var that = this
    if(that.data.typeAvtive[i]!=true){
      var typeAvtive = []
      typeAvtive[i] = true
      that.setData({
        typeAvtive: typeAvtive,
        type: type,
        typeBookList: []
      }, function () {
        that.getList()
      })
    }
  },
  //切换小分类
  changMins:function(e){
    var that = this
    var i = e.currentTarget.dataset.i
    if(that.data.active[i]!=true){
      var act = []
      act[i] = true
      that.setData({
        active: act,
        typeBookList:[]
      })
      if(i>0){
        that.setData({
          minor: that.data.mins[i-1]
        },function(){
          that.getList()
        })
      }else{
        that.setData({
          minor: ''
        },function(){
          that.getList()
        })
      }
    }
  },
  getList(){
    var that = this
    that.setData({
      hidden_loading:false,
    })
    wx: wx.request({
      url: app.globalData.url+'xiaoshuo/book/by-categories',
      data: {
        gender: that.data.gender,
        type: that.data.type,
        major: that.data.major,
        minor: that.data.minor,
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
        if(res.data.books.length==0){
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none',
            duration: 1000
          })
        }else{
          var list1 = that.data.typeBookList;
          for (var i = 0; i < res.data.books.length; i++) {
            list1.push(res.data.books[i])
          }
          that.setData({
            typeBookList: list1
          });
        }
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
      url: app.globalData.url+'xiaoshuo/book/fuzzy-search',
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
        that.setData({
          typeBookList: list1
        });
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
      url: app.globalData.url+'xiaoshuo/author-books',
      data: {
        author: that.data.author
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode==200){
          var list1 = that.data.typeBookList;
          for (var i = 0; i < res.data.books.length; i++) {
            list1.push(res.data.books[i])
          }
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
    }
    else if(options.ranking_title){
      wx.setNavigationBarTitle({
        title: options.ranking_title,
      })
      that.setData({
        hidden_loading: false,
      })
      wx.request({
        url: app.globalData.url + 'xiaoshuo/ranking/details?id=' + options.ranking_id,
        method: 'GET',
        success: function(res){
          that.setData({
            typeBookList:res.data.ranking.books
          })
        },
        fail: function() {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1000
          })
        },
        complete: function() {
          that.setData({
            hidden_loading: true,
          })
        }
      })
    }else{
      var mins = JSON.parse(options.mins)
      if (mins.major == options.typeName){
        this.setData({
          mins: mins.mins
        },function(){
        })
      }
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
