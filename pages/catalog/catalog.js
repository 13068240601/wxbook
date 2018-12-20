2//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    book_id:null,
    hidden_loading:false,
    chapters:[],
    Upside_down:false,
    bookname:"",
    contentType:""
  },
  //正序倒序
  Upside_down(){
    var that = this;
    var list2 = this.data.chapters;
    list2.reverse()
    this.setData({
      chapters: list2,
      Upside_down: !that.data.Upside_down
    })
  },
  //跳转详情页
  jumpContent:function(e){
    var link = e.currentTarget.dataset.link; 
    var i = e.currentTarget.dataset.i
    wx.navigateTo({
      url: '../bookContent/bookContent?bookname=' + this.data.bookname + '&i=' + i + '&contentType=' + this.data.contentType + '&link=' + link
    })
  },
  //获取所有章节
  getcatalog(id){
    var that = this;
    wx: wx.request({
      url: 'https://api.zhangcc.top/xiaoshuo/mix-atoc/chapter?id='+that.data.book_id,
      // data: {
      //   id:id
      // },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if(res.data.ok==true){
          that.setData({
            hidden_loading: true
          })
          var list = [];
          for (var i = 0; i < res.data.mixToc.chapters.length; i++) {
            list.push(res.data.mixToc.chapters[i])
          }
          that.setData({
            chapters: list
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //获取所有书源
  getList() {
    var that = this
    that.setData({
      hidden_loading: false,
    })
    wx: wx.request({
      url: 'https://api.zhangcc.top/xiaoshuo/btoc',
      data: {
        view:"summary",
        book: that.data.book_id
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var i = 0;
        if (res.data[i]._id == "" || res.data[i]._id == null){
          i++;
          that.getcatalog(res.data[i]._id)
        }else{
          that.getcatalog(res.data[i]._id)          
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLoad: function (options) {
    var that = this
    // console.log(options.bookname)
    this.setData({
      book_id: options.book_id,
      bookname: options.bookname,
      contentType: options.contentType
    },function(){
      that.getList()
    }),
    wx.setNavigationBarTitle({
      title: options.bookname
    })
  },
})
