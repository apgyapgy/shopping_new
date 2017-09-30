//index.js
//获取应用实例
const app = getApp()
import common from '../../js/common.js';
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
    ],
    latitude:'',//纬度
    longitude:'',//经度
    shopList:[],
    location:{
     
    }
  }, 
  onLoad: function () {
    var _this = this;
    var _location = this.getStorageLocation();
    if (_location){//保存的有定位获取店铺
      var _locArr = _location.split("#");
      this.setData({
        latitude: _locArr[0],
        longitude: _locArr[1]
      });
      this.initData();
    }else{//未保存定位重新获取定位
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          });
          _this.initData();
        }
      });
    }
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
  },
  showModal: function (cont) {//显示弹窗
    wx.showModal({
      title: '提示',
      content: cont,
      showCancel: false
    });
  },
  initData: function () {//初始化页面数据
    var _this = this;
    common.getAjax({
      url: 'wx_we/home',
      params: {
        bmapLng: _this.data.longitude,
        bmapLat: _this.data.latitude
      },
      success: function (res) {
        console.log("首页:", res);
        if (res.data.code == 200) {
          var _data = res.data.data;
          _this.setData({
            bannerImgs: _data.banners,
            shopList: _data.shops,
            location: _data.location
          });
        } else if(res.data.code == 40201){
          _this.setData({
            bannerImgs: ['../../image/banner.png'],
            shopList: [],
            location: {}
          });
          _this.showModal(res.data.desc);
        }else{
          _this.setData({
            bannerImgs: ['../../image/banner.png'],
            shopList: [],
            location: {}
          });
          _this.showModal(res.data.desc);
        }
      }
    });
  },
  chooseLocation: function () {//弹出地图选择定位
    this.checkUserInfoAuth();
    var _this = this;
    wx.chooseLocation({
      success:function(res){
        console.log("choose location success:",res);
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        _this.saveLocation();
        _this.initData();
      },
      cancel: function () {
        console.log("choose location cancel:", res);
      },
      fail:function(){}
    });
  },
  jumpShopInfo: function () {//点店铺跳转
    this.checkUserInfoAuth();
  },
  checkUserInfoAuth: function () {//判断用户是否授权获取用户信息,用于没授权点任何位置跳转授权页面
    if (!app.globalData.userInfoAuth){
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }
  },
  saveLocation:function(){//保存定位
    var _location = this.data.latitude + "#" + this.data.longitude;
    wx.setStorageSync("location",_location);
  },
  getStorageLocation: function () {//从缓存中获取定位
    return wx.getStorageSync("location");
  }
});
