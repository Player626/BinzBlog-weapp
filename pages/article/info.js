// pages/article/info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    loadProgress: 0
  },
  // 加载条
  // loadProgress() {
  //   this.setData({
  //     loadProgress: this.data.loadProgress + 30
  //   })
  //   if (this.data.loadProgress < 100) {
  //     setTimeout(() => {
  //       this.loadProgress();
  //     }, 100)
  //   } else {
  //     this.setData({
  //       loadProgress: 0
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var self = this
    self.setData({
      loadProgress: self.data.loadProgress + 30
    })
    //获取文章
    wx.request({
      url: 'https://www.test.com/blog/public/wx-article/' + id, // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        //将markdown内容转换为towxml数据
        let data = app.towxml.toJson(
          res.data.content,               // `markdown`或`html`文本内容
          'markdown'              // `markdown`或`html`
        );

        //前台初始化小程序数据（2.1.2新增，如果小程序中无相对资源需要添加`base`根地址，也无`audio`内容可无需初始化）
        // data = app.towxml.initData(data, {
        //   base: 'https://xxx.com/',    // 需要解析的内容中相对路径的资源`base`地址
        //   app: _ts                     // 传入小程序页面的`this`对象，以用于音频播放器初始化
        // });

        //设置文档显示主题，默认'light' dark
        data.theme = 'light';
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        //设置数据
        self.setData({
          article: data,
          info: res.data,
          loadProgress: self.data.loadProgress + 71
        });
        setTimeout(() => {
          //设置数据
          self.setData({
            loadProgress: 0
          });
          }, 100)
        //存入历史记录
        let openid = app.globalData.openid
        var history = wx.getStorageSync(openid) || []
        var new_history = []
        for(var index in history){
          // console.log(history[index])
          if(self.data.info.id != history[index].id){
            new_history.push(history[index])
          }
        }
        new_history.unshift(self.data.info)
        wx.setStorageSync(openid, new_history)
      }
      // success(res) {
      //   console.log(res.data)
      //   wx.setNavigationBarTitle({
      //     title: res.data.title
      //   })
      //   self.setData({
      //     info: res.data
      //   })
      // }
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