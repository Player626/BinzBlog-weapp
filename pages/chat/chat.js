// pages/chat/chat.js
// 聊天室
var url = 'wss://www.gaobinzhan.com:9501/';
const app = getApp()
const {
  $Message
} = require('../../dist/iview/base/index');
const {
  $Toast
} = require('../../dist/iview/base/index');
var utils = require('../../utils/util.js');
const qiniuUploader = require("../../utils/qiniuUploader");
// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptokenURL: 'https://www.test.com/img/Qiniu.php',
    // uptoken: 'xxx',
    domain: 'http://cdn.qiniu.test.com',
    shouldUseQiniuFileName: false
  };
  qiniuUploader.init(options);
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [],
    userInfo: [],
    message: '',
    userList: [],
    close_flag: 1000,
    bottom: 0,
    statu_color: 'red'
  },
  /**
   * websocket 连接
   */
  connect: function() {
    // 创建一个websocket连接
    return wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        console.log('websocket连接成功~')
      },
      fail: res => {
        console.log('websocket连接失败~')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.handle('正在连接服务器~', 'success')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        openid: app.globalData.openid
      })
    }
  },
  onShow: function() {
    var self = this
    if (self.data.close_flag == 1000) {
      self.connect()
      // 监听 WebSocket 连接打开事件
      wx.onSocketOpen(function(res) {
        wx.sendSocketMessage({
          data: '{ "date": "' + utils.formatTime(new Date()) + '","type":"userAdd", "nickName": "' + self.data.userInfo.nickName + '", "avatarUrl": "' + self.data.userInfo.avatarUrl + '","openid": "' + app.globalData.openid + '" }',
        })
        // $Message({
        //   content: '已成功连接至聊天室服务器~',
        //   type: 'success'
        // });
        self.setData({
          statu_color: 'green'
        })
      })
      // 监听 WebSocket 连接打开事件
      wx.onSocketError(function(res) {
        // $Message({
        //   content: '连接聊天室服务器失败~',
        //   type: 'error'
        // });
        self.setData({
          statu_color: 'red'
        })
        self.connect()
      })
      wx.onSocketMessage(function(res) {
        var data = JSON.parse(res.data)
        if (data.type == 'history') {
          self.setData({
            list: null
          })
          var list = []
          for (var index in data.data) {
            var tmp = JSON.parse(data.data[index])
            list.push(tmp)
          }
          self.setData({
            list: list
          })
          //聊天消息始终显示最底端
          // var query = wx.createSelectorQuery()
          // query.select('.input').boundingClientRect()
          // query.selectViewport().scrollOffset()
          // query.exec(function (res) {
          //   wx.pageScrollTo({
          //     scrollTop: parseInt(res[0].bottom) // #the-id节点的下边界坐标  
          //   })
          //   res[1].scrollTop // 显示区域的竖直滚动位置  
          // })
          let query = wx.createSelectorQuery();
          query.selectAll('.cu-chat').boundingClientRect(function(rects) {
            wx.pageScrollTo({
              scrollTop: rects[rects.length - 1].bottom
            })
            self.setData({
              bottom: rects[rects.length - 1].bottom
            })
          }).exec();
        } else if (data.type == "content") {
          var list = self.data.list
          list.push(data.data)
          self.setData({
            list: list
          })
          //聊天消息始终显示最底端
          // var query = wx.createSelectorQuery()
          // query.select('.input').boundingClientRect()
          // query.selectViewport().scrollOffset()
          // query.exec(function (res) {
          //   wx.pageScrollTo({
          //     scrollTop: parseInt(res[0].bottom) // #the-id节点的下边界坐标  
          //   })
          //   res[1].scrollTop // 显示区域的竖直滚动位置  
          // })
          let query = wx.createSelectorQuery();
          query.selectAll('.cu-chat').boundingClientRect(function(rects) {
            wx.pageScrollTo({
              scrollTop: parseInt(self.data.bottom) + rects[rects.length - 1].bottom
            })
          }).exec();
        } else if (data.type == 'close') {
          var userList = []
          for (var index in data.data) {
            var tmp = JSON.parse(data.data[index])
            userList.unshift(tmp)
          }
          self.setData({
            userList: userList
          })
        } else if (data.type == 'join') {
          // $Message({
          //   content: '欢迎' + data.current.nickName + '加入聊天室~',
          //   type: 'success'
          // });
          var userList = []
          for (var index in data.data) {
            var tmp = JSON.parse(data.data[index])
            userList.unshift(tmp)
          }
          self.setData({
            userList: userList
          })
          // let query = wx.createSelectorQuery();
          // query.selectAll('.cu-chat').boundingClientRect(function (rects) {
          //   console.log(rects)
          // wx.pageScrollTo({
          //   scrollTop: parseInt(self.data.bottom) + rects[rects.length - 1].bottom
          // })
          // }).exec();
        }
      })
    }
  },
  //页面隐藏
  onHide: function() {
    if (this.data.close_flag == 1000) {
      wx.closeSocket();
    }
  },
  //input输入时
  input: function(res) {
    this.setData({
      message: res.detail.value
    })
  },
  // 页面卸载
  onUnload() {
    if (this.data.close_flag == 1000) {
      wx.closeSocket();
    }
    wx.showToast({
      title: '连接已断开~',
      icon: "none",
      duration: 2000
    })
    // this.handle('连接已断开~','error')
  },
  /**
   * 查看图片
   */
  img: function(res) {
    this.setData({
      close_flag: 9999
    })
    var current_url = res.currentTarget.dataset.src
    var urls = []
    var list = this.data.list
    for (var index in list) {
      if (list[index]['type'] == 'image') {
        urls.push(list[index]['imageUrl'])
      }
    }
    wx.previewImage({
      current: current_url,
      urls: urls
    })
  },
  //事件处理函数
  send: function(e) {
    if (this.data.message.trim() == "") {
      // this.handle('消息不能为空哦~', 'warning')
      $Toast({
        content: '消息不能为空哦~',
        type: 'warning'
      })
    } else {
      wx.sendSocketMessage({
        data: '{ "content": "' + this.data.message + '", "date": "' + utils.formatTime(new Date()) + '","type":"text", "nickName": "' + this.data.userInfo.nickName + '", "avatarUrl": "' + this.data.userInfo.avatarUrl + '","openid": "' + app.globalData.openid + '" }',
        fail: res => {
          // this.handle('发送失败~', 'error')
          $Toast({
            content: '发送失败~',
            type: 'error'
          })
        },
        success: res => {
          this.setData({
            message: ''
          })
        }
      })
    }
  },
  // 消息提醒
  handle: function(content, type) {
    $Message({
      content: content,
      type: type
    });
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  didPressChooesImage: function() {
    var that = this;
    didPressChooesImage(that);
  },
  didCancelTask: function() {
    this.data.cancelTask()
  }
})
//上传图片
function didPressChooesImage(that) {
  initQiniu();
  $Toast({
    content: '上传中',
    type: 'loading',
    duration: 0,
    mask: false
  });
  that.setData({
    close_flag: 9000
  })
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function(res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
          wx.sendSocketMessage({
            data: '{ "imageUrl": "' + res.imageURL + '", "date": "' + utils.formatTime(new Date()) + '","type":"image", "nickName": "' + that.data.userInfo.nickName + '", "avatarUrl": "' + that.data.userInfo.avatarUrl + '","openid": "' + app.globalData.openid + '" }',
            success: res => {
              $Toast.hide()
              that.setData({
                close_flag: 1000
              })
            }
          })
        }, (error) => {
          $Toast({
            content: '上传失败',
            type: 'error'
          });
          that.setData({
            close_flag: 1000
          })
          console.error('error: ' + JSON.stringify(error));
        },
        // , {
        //     region: 'NCN', // 华北区
        //     uptokenURL: 'https://[yourserver.com]/api/uptoken',
        //     domain: 'http://[yourBucketId].bkt.clouddn.com',
        //     shouldUseQiniuFileName: false
        //     key: 'testKeyNameLSAKDKASJDHKAS'
        //     uptokenURL: 'myServer.com/api/uptoken'
        // }
        null, // 可以使用上述参数，或者使用 null 作为参数占位符
        (progress) => {
          console.log('上传进度', progress.progress)
          console.log('已经上传的数据长度', progress.totalBytesSent)
          console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
        }, cancelTask => that.setData({
          cancelTask
        })
      );
    },
    fail: res => {
      $Toast.hide()
      that.setData({
        close_flag: 1000
      })
    }
  })
}