//获取应用实例
const app = getApp()

Page({
  data: {
    bookInfo:null,
    book_id:null,
    updated:"",
    hidden_loading:false,
    contentType:"",        //内容类型
    recommend:null,        //推荐列表
    posts:null,            //书评
    postsTime:null,         //书评时间
    showInfo:true,        //书本简介是否打开
  },
  //跳转到章节页
  jumpCatalog:function(e){
    var book_id = e.currentTarget.dataset.book_id;
    wx.navigateTo({
      url: '../bookContent/bookContent?book=' + this.data.book_id + '&bookname=' + this.data.bookInfo.title + '&contentType=' + this.data.contentType + '&catalog=true'
    })
  },
  //更多评论
  move_comment:function(){
    wx.navigateTo({
      url: '../comment/comment?book=' + this.data.book_id + '&cover=' + this.data.bookInfo.cover + '&name=' +this.data.bookInfo.title
    })
  },
  //书籍简介是否展开
  show(){
    var show = this.data.showInfo;
    show = !show
    this.setData({
      showInfo:show
    })
  },
  jumpContent(e){
    var book_id = e.currentTarget.dataset.book_id;
    wx.navigateTo({
      url: '../bookContent/bookContent?book=' + book_id + '&bookname=' + this.data.bookInfo.title + '&contentType=' + this.data.contentType
    })
  },
  //获取作者名下的书籍
  jumpTypeList:function(e){
    var author = e.currentTarget.dataset.author;
    wx.navigateTo({
      url: '../typeList/typeList?author=' + author,
    })
  },
  //本页推荐跳转
  jumpInfo: function (e) {
    var book_id = e.currentTarget.dataset.book_id;
    var contentType = e.currentTarget.dataset.content_type;
    wx.navigateTo({
      url: '../bookInfo/bookInfo?book_id=' + book_id + '&contentType=' + contentType
    })
  },
  onLoad: function (options) {  
    this.setData({
      book_id: options.book_id,
      contentType: options.contentType
    })
    var that = this;
    //获取书籍详情
    wx:wx.request({
      url: app.globalData.url+'xiaoshuo/book/details?id=' + that.data.book_id,
      data:{
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        that.setData({
          hidden_loading:true
        })
        var time = res.data.updated
        var d = new Date(time)
        var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        that.setData({
          bookInfo: res.data,
          updated: times
        });
      },
      fail: function (res) { },
      complete: function (res) { },
    });
    //获取书评（短评）
    wx: wx.request({
      url: app.globalData.url+'xiaoshuo/post/by-book',
      data: {
        book:that.data.book_id,
        sort: "updated",
        type: "normal",
        start:0,
        limit:5,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if ((res.data.ok == true || res.data.ok == 'true') && res.data.posts){
          var time = []
          
          for (var i = 0; i < res.data.posts.length; i++) {
            var d = new Date(res.data.posts[i].updated)
            time[i] = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
          }
          that.setData({
            posts: res.data.posts,
            postsTime: time
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    //获取书籍推荐
    wx: wx.request({
      url: app.globalData.url+'xiaoshuo/recommend?id=' + that.data.book_id,
      data: {
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          recommend:res.data.books
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})
