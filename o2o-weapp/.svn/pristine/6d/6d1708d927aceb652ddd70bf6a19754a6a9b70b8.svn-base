//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    autoplay:false,
    bannerImgs:['../../image/banner.png'],
    backTopIconShowFlag:false,
    scrollTop:0,
    tabbarArray:[
      {
        id:1,
        cls:'home',
        url:'/pages/index/index',
        src:'../../image/home.png',
        active_src:'../../image/home_active.png',
        text:'首页',
        active:true
      },
      {
        id: 2,
        cls: 'car',
        url: '/pages/shoppingcat/shoppingcart',
        src: '../../image/car.png',
        active_src:'../../image/car_active.png',
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
        active: false
      }, {
        id: 4,
        cls: 'my',
        url: '/pages/my/my',
        src: '../../image/my.png',
        active_src: '../../image/my_active.png',
        text: '我的',
        active: false
      }
    ]
  }, 
  onLoad: function () {
    
  },
  getUserInfo: function(e) {
   
  },
  getOpenId:function(){
    wx.request({
      url: 'wx_we/openid', //仅为示例，并非真实的接口地址
      data: {
        code: '',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  //返回顶部
  goTop:function(){
    /*wx.pageScrollTo({
      scrollTop: 0
    });*/
    this.setData({
      scrollTop:0
    });
  },
  checkBackTop:function(e){//检测并判断是否显示返回顶部按钮 
    if (e.detail.scrollTop > 500) {
      if (this.data.backTopIconShowFlag == false){
        this.setData({
          backTopIconShowFlag: true
        });
      }
    } else {
      if (this.data.backTopIconShowFlag == true) {
        this.setData({
          backTopIconShowFlag: false
        });
      }
    }
  }
})
