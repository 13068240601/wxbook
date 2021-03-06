const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:'',
    male_collapse:true,
    female_collapse:true,
    epub_collapse:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'xiaoshuo/ranking/gender',
      method: 'GET', 
      success: function(res){
        wx.hideLoading()
        that.setData({
          list:res.data
        })
      },
      fail: function() {
        wx.hideLoading()
      },
      complete: function() {
      }
    })
  },
  male_collapse:function(){
    this.setData({
      male_collapse: !this.data.male_collapse
    })
  },
  female_collapse:function(){
    this.setData({
      female_collapse: !this.data.female_collapse
    })
  },
  epub_collapse: function(){
    this.setData({
      epub_collapse: !this.data.epub_collapse
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
  onShow: function(){
    wx.setTabBarItem({
      index: 1,
      iconPath: './img/ranking.png',
      selectedIconPath: './img/ranking_active.png'
    })
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