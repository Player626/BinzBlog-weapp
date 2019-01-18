// pages/center/index.js
const { $Message } = require('../../dist/iview/base/index');
const { $Toast } = require('../../dist/iview/base/index');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: null,
    hasUserInfo:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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

  },
  /**
   * getUserInfo 用户授权
   */
  getUserInfo:function(e){
    let Msg = e.detail.errMsg
    if (Msg != 'getUserInfo:fail auth deny') {
      $Toast({
        content: '授权成功'
      }),
      // this.handle('授权成功', 'success')
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      $Toast({
        content: '授权失败'
      })
      // this.handle('用户拒绝授权', 'error')
    }
  },
  /**
   * 消息提醒
   * @param content 消息内容
   * @param type 消息类型
   */
  handle: function (content, type) {
    $Message({
      content: content,
      type: type
    });
  },
  /**
   * 最近浏览
   */
  history: function(){
    if (!app.globalData.userInfo) {
      $Toast({
        content: '未授权,不可查看'
      })
      // this.handle('未授权,不可查看','error')
    }else{
      wx.navigateTo({
        url: 'history',
      })
    }
  }
})