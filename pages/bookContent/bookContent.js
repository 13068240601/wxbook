//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    chapters:[],              //所有章节
    chaptersTitle:[],         //章节标题
    paragraph:[],            //每个章节所有段落
    chaptersLink:null,       //从章节列表接收到的链接
    book_id:null,            //从书籍详情页接收到的书本id,只能拿来查书源
    hidden_loading:false,     //加载中动画是否显示  false显示  true隐藏
    chaptersNumber:0,         //第几章
    contentType:"",          //内容类型
    scroll_top:0,             //滚动条距离顶部位置
    isRequest:true,          //是否能请求
    isShowchapters:false,     //章节是否显示
    isShowNav:false,          //底部菜单是否显示
    fontSize:16,              //默认字体大小
    loading:'数据加载中...',
    asce:true,                //章节升序

  },
  //隐藏章节
  hiddcatchtap:function(){
    this.setData({
      isShowchapters:false
    })
  },
  //放大字体
  enlarge:function(){
    var fs = this.data.fontSize;
    if (fs<=28){
      fs+=2
      this.setData({
        fontSize:fs
      })
    }else{
      return
    }
  },
  //缩小字体
  narrow:function(){
    var fs = this.data.fontSize;
    if (fs > 16) {
      fs -= 2
      this.setData({
        fontSize: fs
      })
    } else {
      return
    }
  },
  //显示章节
  showcatchtap(){
    this.setData({
      isShowchapters: true
    })
  },
  //显示隐藏菜单
  showNav(){
    var that = this
    this.setData({
      isShowNav: !that.data.isShowNav
    })
  },
  //返回首页
  gohome:function(){
    var i = getCurrentPages();
    // console.log(i.length)
    wx.navigateBack({delta:i.length})
  },
  //获取所有章节对象
  getcatalog(id) {
    var that = this;
    return new Promise((resolve, reject) => {
      wx: wx.request({
        url: 'https://api.zhangcc.top/xiaoshuo/mix-atoc/chapter?id=' + id,
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: res => resolve(res),
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    
  },
  //章节切换
  jumpContent: function (e) {
    var i = e.currentTarget.dataset.i;
    var Title = [];
    Title.push(this.data.chapters[i].title)
    var that = this
    that.setData({
      paragraph:[]
    },function(){
      that.getchapters(that.data.chapters[i].link)
      // console.log(that.data.chapters[i].link)
      that.setData({
        isShowchapters: false,
        isShowNav: false,
        chaptersNumber: i,
        chaptersTitle: Title
      })
    })
    
  },
  //获取章节列表
  getcataloglist(res){
    var list = [];
    var that = this
    for (var i = 0; i < res.length; i++) {
      list.push(res[i])
    } 
    // console.log(list)       
    this.setData({
      chapters: list,
    },function(){
      var Title = [];
      Title.push(that.data.chapters[0].title)
      that.setData({
        chaptersTitle: Title
      })
    })
  },
  //获取所有书源
  getList() {
    var that = this
    that.setData({
      hidden_loading: false,
    })
    return new Promise((resolve, reject)=>{
      wx: wx.request({
        url: 'https://api.zhangcc.top/xiaoshuo/btoc',
        data: {
          view: "summary",
          book: that.data.book_id
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: res => resolve(res),
        // success: function (res) {
        //   console.log(res)
        
        // },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    
  },
  //获取章节内容
  getchapters(link){
    var that = this   
    that.setData({
      hidden_loading: false,
      isRequest:false,
    }) 
    wx: wx.request({
      url: 'https://api.zhangcc.top/xiaoshuo/chapter/details?link=' + encodeURIComponent(link),
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        if (res.statusCode = 200){
          that.setData({
            // scroll_top: 0,
            isRequest:true
          })
          // var chapterlist = [];
          // chapterlist.push(res.data.chapter.title);
          var paragraphlist = that.data.paragraph;
          var str = res.data.chapter.body.split(/[\n,]/g)
          // console.log(str)
          var strs = [];
          for (var i = 0; i < str.length; i++) {
            str[i] = str[i].replace(/(^\s*)|(\s*$)/g, "");//除去开头空格
            str[i] = str[i].replace(/&nbsp;/gi, '')       //除去所有&nbsp;
            strs.push(str[i])
          }
          paragraphlist.push(strs)
          // console.log(chapterlist)
          // console.log(paragraphlist)
          that.setData({
            // chapter: chapterlist,
            paragraph: paragraphlist,
            hidden_loading: true,
          });
        }
        
      },
      fail: function (res) { 
        if(that.data.isRequest==false){
          var num = that.data.chaptersNumber;
          num--;
          that.setData({
            chaptersNumber:num
          },function(){
            var Title = that.data.chaptersTitle;
            Title = Title.splice(Title.length-1,1)
            that.setData({
              isRequest:true,
              hidden_loading:true,
              chaptersTitle:Title
            },function(){
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 1000
              })
            })
          })
        }
      },
      complete: function (res) { },
    })
  },
  next:function(i){
    var Title = this.data.chaptersTitle;
    Title.push(this.data.chapters[i].title)
    this.getchapters(this.data.chapters[i].link)
    this.setData({
      chaptersNumber: i,
      chaptersTitle: Title
    }, function () {
      // console.log(that.data.chaptersTitle)
    })
  },
  //下一章
  next_chapter(){
    // console.log("到底了")
    var that = this
    var i = this.data.chaptersNumber;
    // console.log(i,that.data.chapters.length-1)
    if (this.data.isRequest == true ){
      if (that.data.asce == true && (i < that.data.chapters.length - 1)){
        i++
        that.next(i)
      } else if (that.data.asce == false && (i > 0)){
        i--
        that.next(i)
      } else {
        wx.showToast({
          title: '没有更多了...',
          icon: 'none',
          duration: 1000
        })
      }
    }
  },
  //章节升降序
  change:function(){
    var that = this;
    var list2 = this.data.chapters;
    var asce = this.data.asce
    list2.reverse()
    if(asce==true){
      this.setData({
        asce:false
      })
    }else{
      this.setData({
        asce:true
      })
    }
    this.setData({
      chapters: list2
    })
  },
  onLoad: function (options) {
    // console.log(options)
    var that = this
    //设置内容类型 txt、img    
    this.setData({
      contentType: options.contentType,
      book_id:options.book,
      // chaptersTitle:Title
    })
    if (options.catalog == 'true' || options.catalog == true){
      this.setData({
        isShowchapters:true,
        isShowNav:true
      },function(){
        that.getList().then((res) => {
          if (res.statusCode == 200){
            that.getcatalog(that.data.book_id).then((catalog)=>{
              // console.log(catalog.data.mixToc.chapters)
              if (catalog.data.ok == true || catalog.data.ok == 'true'){
                that.getcataloglist(catalog.data.mixToc.chapters)
                that.getchapters(that.data.chapters[that.data.chaptersNumber].link)
              }
              
            })
          }else{
            that.setData({
              loading:'数据加载出错请重新打开...'
            })
          }
        })
      })
    }else{
      that.getList().then((res) => {
        if (res.statusCode == 200) {
          that.getcatalog(that.data.book_id).then((catalog) => {
            // console.log(catalog.data.mixToc.chapters)
            if (catalog.data.ok == true || catalog.data.ok == 'true') {
              that.getcataloglist(catalog.data.mixToc.chapters)
              that.getchapters(that.data.chapters[that.data.chaptersNumber].link)
            }

          })
        } else {
          that.setData({
            loading: '数据加载出错请重新打开...'
          })
        }
      })
    }

    //头部显示书名
    wx.setNavigationBarTitle({
      title: options.bookname
    })
  }
})
