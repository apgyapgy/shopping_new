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
    netDisconnectFlag:false,
    bannerImg: ''  //banner图片 ../../image/banner.jpg
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
    this.getBannerImg();
    app.qryUserCartNums(this);
  },
  goTop: function () { //返回顶部
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
  shopsToHost: function () {//根据定位页返回的定位信息定位获取店铺
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
            var _shops = _this.setTopSjhl(_data.shops);
            _this.setData({
              bannerImgs: _data.banners,
              shopList: _shops,
              location: _data.location,
              noshop: false
            });
          } else {
            var _shops = _this.setTopSjhl(_data.shops);
            _this.setData({
              bannerImgs: _data.banners,
              shopList: _shops,
              location: _data.location,
              noshop: true
            });
          }
          app.globalData.location = _data.location;
          _this.getBannerImg();
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
          _this.getBannerImg();
          common.showModal(res.data.desc);
        }
      }
    });
  },
  setTopSjhl(data){//指定小区将世纪华联超市置顶
    if(data.length){
      for(var key in data){
        if (data[key].shopId == 60000045){
          var _arr = data.splice(key, 1);
          data.unshift(_arr[0]);
          break;
        }
      }
      return data;
    }else{
      return data;
    }
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
            var _shops = _this.setTopSjhl(_data.shops);
            _this.setData({
             // bannerImgs: _data.banners,
              shopList: _shops,
              location: _data.location,
              noshop:false
            });
          }else{
            var _shops = _this.setTopSjhl(_data.shops);
            _this.setData({
              //bannerImgs: _data.banners,
              shopList: _shops,
              location: _data.location,
              noshop:true
            });
          }
          app.globalData.location = _data.location;
          _this.getBannerImg();
        } else if (res.data.code == 40201) {
          _this.setData({
            //bannerImgs: ['../../image/banner.png'],
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
          _this.getBannerImg();
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
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitleText,
      path: '/pages/front/front',
      imageUrl: app.globalData.shareImgUrl
    }
  },
  getBannerImg(){//获取banner的img
    if (JSON.stringify(app.globalData.location) != '{}' && app.globalData.location.hostId){
      var _id = app.globalData.location.hostId;
      if (_id == '60296626' || _id == '60259113' || _id == '60278091' || _id == '60288766' || _id == '60255406') {// || _id =='60261864'
        if (this.data.bannerImg == '../../image/banner.jpg' || this.data.bannerImg == ''){
          this.setData({
            bannerImg: '../../image/banner_active.jpg'
          });
        }
      }else{
        if (this.data.bannerImg == '../../image/banner_active.jpg' || this.data.bannerImg == ''){
          this.setData({
            bannerImg: '../../image/banner.jpg'
          });
        }
      }
    }else{
      if (this.data.bannerImg == '../../image/banner_active.jpg' || this.data.bannerImg == '') {
        this.setData({
          bannerImg: '../../image/banner.jpg'
        });
      }
    }
  },
  bannerJump(){//点击banner跳转世纪华联超市
    if (JSON.stringify(app.globalData.location) != '{}' && app.globalData.location.hostId) {
      var _id = app.globalData.location.hostId;
      if (_id == '60296626' || _id == '60259113' || _id == '60278091' || _id == '60288766' || _id == '60255406') {// || _id =='60261864'
        var _trans = "mchId=80000720&shopId=60000045";
        var _url = "/pages/shop/shop?" + _trans;
        wx.navigateTo({
          url: _url
        });
      } else {
        return;
      }
    } else {
      return;
    }
  }
});
