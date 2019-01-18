// pages/article/search.js
const app = getApp()
const { $Toast } = require('../../dist/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $Toast({
      content: '加载中',
      type: 'loading',
      mask:false,
      duration:0
    });
    var word = options.word
    var self = this
    wx.request({
      url: 'https://www.test.com/blog/public/wx-search/'+ word,
      success: res => {
        $Toast.hide();
        if(res.data == ""){
          $Toast({
            content: '抱歉！没有找到你要内容！'
          });
        }else{
          self.setData({
            list: res.data
          })
        }
      }
    })
  },
  /**
   * 跳转到文章详情
   */
  info: function (e) {
    wx.navigateTo({
      url: '/pages/article/info?id=' + e.currentTarget.dataset.id,
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