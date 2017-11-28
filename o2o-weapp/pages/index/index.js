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
    ],//底部导航栏信息
    shopList: [],//店铺列表 
    location: {}, //返回的定位小区信息
    jumpUrl: "",  //要跳转的链接
    imgPre: app.globalData.imgPre, //图片前缀
    noshop:false,  //当无店铺或收件宝快递柜时显示
    netDisconnectFlag:false
  }, 
  onLoad: function () {
    var _this = this;
    if (wx.onNetworkStatusChange){
      wx.onNetworkStatusChange(function (res) {
        console.log("ent change:",res);
        if(res.networkType == 'none'){
          _this.setData({
            netDisconnectFlag:true
          });
          setTimeout(function () {
            _this.setData({
              netDisconnectFlag: false
            });
          }, 2000);
        }
      });
    }
  },
  onShow: function () {
    var _this = this;
    if (app.globalData.selectedHostId){
      _this.shopsToHost();
    }else{
      _this.initData();
    }
    app.qryUserCartNums(this);
  },
  goTop: function () { //返回顶部
    this.setData({
      scrollTop:0
    });
  },
  checkBackTop:function(e){//检测并判断是否显示返回顶部按钮 
    console.log("checkBackTop", this.data.backTopIconShowFlag);
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
  shopsToHost: function () {
    var _this = this;
    common.getAjax({
      url: 'wx_we/shopsToHost',
      token: app.globalData.token,
      params: {
        hostId: app.globalData.selectedHostId
      },
      success: function (res) {
        console.log("shopsToHost:",res);
        if (res.data.code == 200) {
          var _data = res.data.data;
          if (_data.shops.length) {
            _this.setData({
              bannerImgs: _data.banners,
              shopList: _data.shops,
              location: _data.location,
              noshop: false
            });
          } else {
            _this.setData({
              bannerImgs: _data.banners,
              shopList: _data.shops,
              location: _data.location,
              noshop: true
            });
          }
          app.globalData.location = _data.location;
        } else if (res.data.code == 40101) {
          _this.setData({
            shopList: [],
            location: {}
          });
          app.globalData.location = {};
          app.getToken(_this, function () {
            _this.shopsToHost(fun);
          });
        } else {
          _this.setData({
            shopList: [],
            location: {},
            noshop: true
          });
          app.globalData.location = {};
          common.showModal(res.data.desc);
        }
      }
    });
  },
  initData: function (fun) {//初始化页面数据
    var _this = this;
    common.getAjax({
      url: 'wx_we/preLocation',
      token: app.globalData.token,
      success: function (res) {
        console.log("首页:", res);
        if (res.data.code == 200) {
          var _data = res.data.data;
          if(_data.shops.length){
            _this.setData({
              bannerImgs: _data.banners,
              shopList: _data.shops,
              location: _data.location,
              noshop:false
            });
          }else{
            _this.setData({
              bannerImgs: _data.banners,
              shopList: _data.shops,
              location: _data.location,
              noshop:true
            });
          }
          app.globalData.location = _data.location;
        } else if (res.data.code == 40201) {
          _this.setData({
            bannerImgs: ['../../image/banner.png'],
            shopList: [],
            location: {},
            noshop:true
          });
          app.globalData.location = {};
          wx.navigateTo({
            url: '/pages/location/location',
          });
        } else if (res.data.code == 40101) {
          _this.setData({
            shopList: [],
            location: {}
          });
          app.globalData.location = {};
          app.getToken(_this,function(){
            _this.initData(fun);
          });
        } else {
          _this.setData({
            shopList: [],
            location: {},
            noshop:true
          });
          app.globalData.location = {};
          common.showModal(res.data.desc);
        }
        if (fun) {
          fun();
        }
      }
    });
  },
  chooseLocation: function () {//弹出地图选择定位
    var _this = this;
    wx.navigateTo({
      url: '/pages/location/location'
    })
    //this.checkLocationAuth();
  },
  jumpShopInfo: function (e) {//点店铺跳转
    var _shopId = e.currentTarget.dataset.shopid;
    var _mchId = e.currentTarget.dataset.mchid;
    var _trans = "mchId=" + _mchId + "&shopId=" + _shopId;
    var _url = "/pages/shop/shop?"+_trans;
    var _this = this;
    this.setData({
      jumpUrl: _url
    });
    wx.navigateTo({
      url: _this.data.jumpUrl
    });
  },
  naviTo:function(e){//底部banner跳转
    var _url = e.currentTarget.dataset.naviurl;
    if(_url){
      var _this = this;
      this.setData({
        jumpUrl:_url
      });
      common.reLaunch(_this.data.jumpUrl);
    }
  }
});
