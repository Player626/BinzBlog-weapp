//index.js
//获取应用实例
const app = getApp()

// const { $Message } = require('../../dist/iview/base/index');
const { $Toast } = require('../../dist/iview/base/index');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    notice: '正在加载中......',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  toChat: function () {
    var self = this
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          //授权后操作
          wx.navigateTo({
            url: '/pages/chat/chat'
          })
        }else {
          // self.handle('请先授权','warning')
          $Toast({
            content: '请点击上个按钮~'
          });
        }
      }
    })
  },
  onLoad: function () {
    var self = this
    //通告栏
    wx.request({
      url: 'https://www.test.com/blog/public/wx-system', // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        for (var index in res.data) {
          if (res.data[index]['key'] == 'notice') {
            self.setData({
              notice: res.data[index].value
            })
          }
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
  getUserInfo: function(e) {
    let Msg = e.detail.errMsg
    if (Msg != 'getUserInfo:fail auth deny'){
      // this.handle('获取成功', 'success')
      $Toast({
        content: '获取成功'
      });
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }else{
      $Toast({
        content: '拒绝获取是进不去聊天室的呀！'
      });
      // this.handle('用户拒绝授权', 'error')
    }
  },
  // 消息提醒
  // handle: function (content, type) {
  //   $Message({
  //     content: content,
  //     type: type
  //   });
  // },
})
