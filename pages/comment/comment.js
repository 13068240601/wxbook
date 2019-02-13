Page({
  data: {
    hidden_loading:false,
    posts:[],
    cover:'',
    postsTime:[],
    start:0,
    limit:10,
    sort:'updated',
    id:'',
    total:null,
    getdata:true,
    name:'',//书名
  },

  //下一页
  next:function(){
    var that = this
    
    if (that.data.getdata==true){
      var num = that.data.start
      if (num < that.data.total){
        num++
        that.setData({
          start:num
        },function(){
          that.getComment()
        })
      }else{
        wx.showToast({
          title: '到底了...',
          duration: 2000
        })
      }
    }
  },
  // 获取评论
  getComment(){
    var that = this
    that.setData({
      getdata:false,
      hidden_loading: false,      
    },function(){
      wx: wx.request({
        url: app.globalData.url+'xiaoshuo/post/review/by-book',
        data: {
          book: that.data.id,
          sort: that.data.sort,
          start: that.data.start,
          limit: that.data.limit
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          for (let i = 0; i < res.data.reviews.length;i++){
            console.log(res.data.reviews[i].title)
          }
          var time = that.data.postsTime
          var reviews = that.data.posts
          var totalPage = Math.ceil(res.data.total/that.data.limit)
          for (var i = 0; i < res.data.reviews.length; i++) {
            var d = new Date(res.data.reviews[i].updated)
            time.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
            reviews.push(res.data.reviews[i])
          }
          that.setData({
            posts: reviews,
            postsTime: time,
            hidden_loading: true,
            getdata:true,
            total: totalPage
          })
        },
        fail: function (res) {
          var num = that.data.start
          if (num > 0) {
            num--
            that.setData({
              start: num,
              hidden_loading: true
            },function(){
              wx.showToast({
                title: '网络错误',
                duration: 2000
              })
            })
          }
        },
        complete: function (res) { },
      })
    })
    
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      id:options.book,
      cover: options.cover,
      name: options.name
    },function(){
      wx.setNavigationBarTitle({
        title: that.data.name
      })
      that.getComment()
    })
    
  }
})