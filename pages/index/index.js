//index.js
//获取应用实例
const app = getApp()
const { $Toast } = require('../../dist/iview/base/index');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list:[],
    swiper: []
    // motto: '',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
      mask: false,
    });
    var self = this
    wx.request({
      url: 'https://www.test.com/blog/public/wx-swiper',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        self.setData({
          swiper: res.data
        })
      }
    })
    wx.request({
      url: 'https://www.test.com/blog/public/wx-new', // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        self.setData({
          list:res.data
        })
        $Toast.hide();
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
  onPullDownRefresh:function(){
    this.onLoad()
    wx.stopPullDownRefresh()
  }
})
