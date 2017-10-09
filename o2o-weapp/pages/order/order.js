// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 1,
    orderList:[1],
    tabbarArray: [//底部tabbar
      {
        id: 1,
        cls: 'home',
        url: '/pages/index/index',
        src: '../../image/home.png',
        active_src: '../../image/home_active.png',
        text: '首页',
        active: false
      },
      {
        id: 2,
        cls: 'car',
        url: '/pages/shoppingcat/shoppingcart',
        src: '../../image/car.png',
        active_src: '../../image/car_active.png',
        text: '购物车',
        shopCartNum: 0,
        active: false
      },
      {
        id: 3,
        cls: 'order',
        url: '/pages/order/order',
        src: '../../image/order.png',
        active_src: '../../image/order_active.png',
        text: '订单',
        active: true
      }, {
        id: 4,
        cls: 'my',
        url: '/pages/my/my',
        src: '../../image/my.png',
        active_src: '../../image/my_active.png',
        text: '我的',
        active: false
      }
    ],
    showPayModel:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  changeTab: function (e) {
    var _index = e.target.dataset.index;
    this.setData({
      activeTab: _index
    });
  },
  topay:function(){//去支付
    console.log("to pay");
  },
  openBox: function () {//开箱
    wx.scanCode({
      success: (res) => {
        console.log(res);
        var _result = res.result;
        wx.showModal({
          title: '扫码结果',
          content: _result,
          success: function (res) {
          }
        })
      },
      fail:res=>{
        console.log("扫码失败:",res);
      }
    })
  },
  showPayModel: function () {
    this.setData({
      showPayModel: true
    });
  },
  closePayModel: function () {
    this.setData({
      showPayModel: false
    });
  }
})