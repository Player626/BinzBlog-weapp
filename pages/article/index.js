// pages/article/index.js
const { $Toast } = require('../../dist/iview/base/index');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    // current: 'main',
    // current_scroll: 'main',
    cate_id:'',
    // notice:'正在加载中......',
    category:[],
    list:[],
    loading:false,
    load_hidden:true,
    scrollHeight:'',
    scrollTop:'',
    page:'1',
    upper_flag:false,
    lower_flag:false
    
  },
  tabSelect(e) {
    console.log(e);
    var cate_id = e.currentTarget.dataset.id
    // console.log(cate_id)
    if (cate_id == '0') {
      cate_id = ''
    }
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      cate_id: cate_id,
      page: 1,
      list: []
    });
    this.list()
  },
  // handleChange({ detail }) {
  //   this.setData({
  //     current: detail.key
  //   });
  // },

  handleChangeScroll({ detail }) {
    var cate_id = detail.key
    // console.log(cate_id)
    var self = this
    if (cate_id == 'main'){
      cate_id=''
    } 
    this.setData({
      current_scroll: detail.key,
      cate_id:cate_id,
      page:1,
      list:[]
    });
    this.list()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    //获取通告栏
    // wx.request({
    //   url: 'https://www.test.com/blog/public/wx-system', // 仅为示例，并非真实的接口地址
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     for (var index in res.data) {
    //       if(res.data[index]['key'] == 'notice'){
    //         self.setData({
    //           notice: res.data[index].value
    //         })
    //       }
    //     }
    //   }
    // })
    //获取文章分类
    wx.request({
      url: 'https://www.test.com/blog/public/wx-category', // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        self.setData({
          category:res.data
        })
        // console.log(self.data.category)
      }
    })
   this.list()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this
    //   这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight
        })
      }
    }),
      //  获取节点长度
      wx.createSelectorQuery().in(this).select('.cu-custom').boundingClientRect(function (res) {
        console.log(res)
        self.setData({
          scrollHeight: parseInt(self.data.scrollHeight) - res.height
        })
        // console.log(res.height)
        // console.log(self.data.scrollHeight)
        //在这里做计算，res里有需要的数据
      }).exec()
    wx.createSelectorQuery().in(this).select('.nav').boundingClientRect(function (res) {
      console.log(res)
      self.setData({
        scrollHeight: parseInt(self.data.scrollHeight) - res.height
      })
      // console.log(res)
      //在这里做计算，res里有需要的数据
    }).exec()
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
  onShareAppMessage: function (res) {
    
  },
  /**
   * 触顶事件
   */
  toupper:function(){
    if (!this.data.upper_flag) {
      wx.showNavigationBarLoading()
      $Toast({
        content: '加载中',
        type: 'loading',
        duration: 0,
        mask: false
      });
      this.setData({
        list: [],
        page: 1,
        upper_flag:true
      })
      this.onLoad()
    }
    // var self = this
    // setTimeout(function () {
    //   self.onLoad()
    //   wx.stopPullDownRefresh()
    // }, 1000)
  },
  /**
   * 滚动到底部
   */
  tolower:function () {
    if(!this.data.lower_flag){
      wx.showNavigationBarLoading()
      this.setData({
        load_hidden: true,
        loading: false,
        page: parseInt(this.data.page) + 1,
        lower_flag:true
      })
      this.list()
    }
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
    // console.log("滚动时触发scrollTop==" + event.detail.scrollTop);
  },
  /**
   * 获取文章列表
   */
  list:function(){
    var self = this
    var cate_id = this.data.cate_id
    var page = this.data.page
    wx.request({
      url: 'https://www.test.com/blog/public/wx-list/' + page +'/' + cate_id, // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        $Toast.hide();
        wx.hideNavigationBarLoading()
        if(res.data == ''){
          self.setData({
            loading:true,
            load_hidden: false,
            lower_flag:true,
            upper_flag:false            
          })
        }else{
          self.setData({
            load_hidden: true,
            loading:true,
            lower_flag: false,
            upper_flag: false ,          
            list: self.data.list.concat(res.data)
          })
        }
      }
    })
  },
  /**
   * 跳转到文章详情
   */
  info:function(e){
    wx.navigateTo({
      url: '/pages/article/info?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 文章搜索
   */
  search:function(e){
    var word = e.detail.value.replace(/\s+/g, '')
    if(word != ""){
      wx.navigateTo({
        url: 'search?word='+word,
      })
    }
  },
})