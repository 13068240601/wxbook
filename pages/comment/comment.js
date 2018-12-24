// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //下一页
  next:function(){
    // console.log(123)
    var that = this
    
    if (that.data.getdata==true){
      var num = that.data.start
      if (num < that.data.total){
        num++
        that.getComment()
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
        url: 'https://api.zhangcc.top/xiaoshuo/post/review/by-book',
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
          // console.log(res)
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
    // console.log(options)
    var that = this
    that.setData({
      id:options.book,
      cover: options.cover
    },function(){
      that.getComment()
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})