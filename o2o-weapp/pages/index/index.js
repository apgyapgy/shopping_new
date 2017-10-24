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
    latitude:'',//纬度
    longitude:'',//经度
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
    var _location = this.getStorageLocation();
    if (_location) {
      _location = _location.split("#");
      _this.setData({
        latitude: _location[0],
        longitude: _location[1]
      });
    } else {
      _this.setData({
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      });
    }
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
          common.showModal("网络已断开，请联网后重试!");
        } else {
          wx.login({
            success: ress => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
                  data: {
                    code: ress.code,
                    bmapLng: _this.data.longitude,
                    bmapLat: _this.data.latitude 
                  },
                  success: function (re) {
                    console.log("index.js onload oauth:",re);
                    if (re.data.code == 200) {
                      app.globalData.loginId = re.data.data.loginId;
                      app.globalData.hostId = re.data.data.hostId;
                      app.globalData.token = re.data.data.token;
                      var _location = _this.getStorageLocation();
                      if (_location) {//保存的有定位获取店铺
                        var _locArr = _location.split("#");
                        _this.setData({
                          latitude: _locArr[0],
                          longitude: _locArr[1]
                        });
                        _this.initData();
                      } else {//未保存定位重新获取定位
                        wx.getLocation({
                          type: 'wgs84',
                          success: function (res) {
                            _this.setData({
                              latitude: res.latitude,
                              longitude: res.longitude
                            });
                            _this.saveLocation();
                            _this.initData();
                          },
                          fail:function(res){
                            console.log("location fail:",res);
                            if (res.errMsg == "getLocation:fail auth deny"){
                              _this.checkLocationAuth(function () {
                                wx.getLocation({
                                  type: 'wgs84',
                                  success: function (res) {
                                    _this.setData({
                                      latitude: res.latitude,
                                      longitude: res.longitude
                                    });
                                    _this.saveLocation();
                                    _this.initData();
                                  }
                                });
                              });
                            }
                          }
                        });     
                      }   
                    } else if (re.data.code == 40110) {
                      wx.redirectTo({ url: "/pages/login/login" });
                    }
                  }
                });
              } else {
                console.log('获取用户登录态失败！' + ress.errMsg)
              }
            }
          });
        }
      },
      fail:function(res){
        console.log("获取网络状态失败:",res);
      } 
    });
    this.qryUserCartNums();
  },
  userInfoReadyCallback:function(){    
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
  initData: function (fn) {//初始化页面数据
    var _this = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
          common.showModal("网络已断开，请联网后重试!");
        } else {
          wx.login({
            success: ress => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
                  data:{
                    code: ress.code,
                    bmapLng: _this.data.longitude,
                    bmapLat: _this.data.latitude
                  },
                  success: function (re) {
                    console.log("index.js oauth:",re);
                    if (re.data.code == 200) {
                      app.globalData.loginId = re.data.data.loginId;
                      app.globalData.hostId = re.data.data.hostId;
                      app.globalData.token = re.data.data.token; 
                      common.getAjax({
                        url: 'wx_we/home',
                        params: {
                          bmapLng: _this.data.longitude,
                          bmapLat: _this.data.latitude
                        },
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
                            app.globalData.hostId = re.data.data.hostId?re.data.data.hostId:'';
                            _this.setData({
                              bannerImgs: ['../../image/banner.png'],
                              shopList: [],
                              location: {},
                              noshop:true
                            });
                            app.globalData.location = {};
                            common.showModal(res.data.desc);
                          } else if (res.data.code == 40101) {
                            app.globalData.hostId = re.data.data.hostId ? re.data.data.hostId : '';
                            _this.setData({
                              shopList: [],
                              location: {}
                            });
                            app.globalData.location = {};
                          } else {
                            _this.setData({
                              shopList: [],
                              location: {},
                              noshop:true
                            });
                            app.globalData.location = {};
                            common.showModal(res.data.desc);
                          }
                          if (fn) {
                            fn();
                          }
                        }
                      });
                    }else if(re.data.code == 40110){
                      wx.redirectTo({ url: "/pages/login/login" });
                    }else if(re.data.code == 40101){
                      _this.initData();
                    }else{
                      _this.setData({
                        shopList: [],
                        location: {},
                        noshop: true
                      });
                      common.showModal(re.data.desc);
                    }
                  }
                });
              } else {
                console.log('获取用户登录态失败！' + ress.errMsg)
              }
            }
          });
        }
      },
      fail:function(res){
        console.log("获取网络状态失败：",res);
      }
    });    
  },
  chooseLocation: function () {//弹出地图选择定位
    var _this = this;
    this.checkLocationAuth();
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
    this.checkUserInfoAuth(function () {
      wx.navigateTo({
        url: _this.data.jumpUrl
      });
    });
  },
  checkUserInfoAuth: function (fn) {
    //判断用户是否授权获取用户信息,未授权点任何位置跳转授权页面
    if (!app.globalData.userInfoAuth){//未授权获取用户信息
      wx.getUserInfo({
        success: function (res) {
          app.globalData.userInfoAuth = true;
          if (fn) {
            fn();
          }
        },
        fail: function (res) {
          app.globalData.userInfoAuth = false;
          wx.showModal({
            title: '提示',
            content: '到柜需要获取您的"用户信息"授权方能正常使用',
            showCancel: false,
            success: function (res) {
              wx.openSetting({
                success: function (data) {
                  if (data) {
                    if (data.authSetting["scope.userInfo"] == true) {
                      wx.getUserInfo({
                        withCredentials: false,
                        success: function (data) {
                          app.globalData.userInfoAuth = true;
                          if (fn) {
                            fn();
                          }
                        },
                        fail: function () {
                          app.globalData.userInfoAuth = false;
                        }
                      });
                    } else {
                      app.globalData.userInfoAuth = false;
                    }
                  }
                },
                fail: function () {
                  app.globalData.userInfoAuth = false;
                }
              });
            }
          });
        }
      });
    }else{
      if(fn){
        fn();
      }
    }
  },
  checkLocationAuth:function(fun){//判断是否授权地理位置
    var _this = this;
    wx.getSetting({
      complete:res=>{
        if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userLocation'] == true) {
          if(fun){
            fun();
          }else{
            wx.chooseLocation({
              success: function (res) {
                _this.setData({
                  latitude: res.latitude,
                  longitude: res.longitude
                });
                _this.saveLocation();
                _this.initData();
              },
              cancel: function () {
              },
              fail: function () {
              }
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '到柜需要获取您的"地理位置"授权方能正常使用',
            showCancel: false,
            success: function (res) {
              wx.openSetting({
                success: function (data) {
                  console.log("openSetting:", data);
                  if (data) {
                    //判断是否授权获取用户信息
                    if (data.authSetting["scope.userInfo"] == true) {
                      if (app.globalData.userInfoAuth == false) {
                        app.globalData.userInfoAuth = true;
                      }
                    } else {
                      if (app.globalData.userInfoAuth == true) {
                        app.globalData.userInfoAuth = false;
                      }
                    }
                    //判断是否授权地理位置
                    if (data.authSetting["scope.userLocation"] == true) {
                      if (fun) {
                        fun();
                      } else {
                        wx.chooseLocation({
                          success: function (res) {
                            _this.setData({
                              latitude: res.latitude,
                              longitude: res.longitude
                            });
                            _this.saveLocation();
                            _this.initData();
                          },
                          cancel: function () {
                          },
                          fail: function () {
                          }
                        });
                      }
                    }
                  }
                },
                fail: function (res) {
                  console.info("设置失败返回数据", res);
                }
              });
            }
          });
        }
      }
    });
  },
  saveLocation:function(){//保存定位
    var _location = this.data.latitude + "#" + this.data.longitude;
    wx.setStorageSync("location",_location);
  },
  getStorageLocation: function () {//从缓存中获取定位
    return wx.getStorageSync("location");
  },
  naviTo:function(e){//底部banner跳转
    var _url = e.currentTarget.dataset.naviurl;
    if(_url){
      var _this = this;
      this.setData({
        jumpUrl:_url
      });
      this.checkUserInfoAuth(function (_url) {
        wx.redirectTo({
          url: _this.data.jumpUrl,
        });
      });
    }
  },
  refresh: function () {//下拉刷新
    //this.onLoad();
  },
  qryUserCartNums:function(){
    var _this = this;
    common.getAjax({
      url: 'wx_we/qryUserCartNums',
      params: {
        loginId:app.globalData.loginId
      },
      token: app.globalData.token,
      success:function(res){
        if(res.data.code == 200){
          console.log("qryUserCartNums:",res);
          var _tabbarArray = _this.data.tabbarArray;
          if (res.data.data.totalNumbers != _tabbarArray[1].shopCartNum) {
            _tabbarArray[1].shopCartNum = res.data.data.totalNumbers;
            _this.setData({
              tabbarArray: _tabbarArray
            });
          }
        } else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.qryUserCartNums();
          })
        } else {
          common.showModal(res.data.desc);
        }
      }
    });
  },
  getToken: function (fn) {//如果用户token过期，重新获取token，并获取数据
    var _this = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
          common.showModal("网络已断开，请联网后重试!");
        } else {
          wx.login({
            success: ress => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: 'https://dswx-test.fuiou.com/o2o/wx_we/oauth',
                  data: {
                    code: ress.code
                  },
                  success: function (re) {
                    console.log("in shop page oauth:", re);
                    if (re.data.code == 200) {
                      app.globalData.loginId = re.data.data.loginId;
                      app.globalData.token = re.data.data.token;
                      if (fn) {
                        fn();
                      }
                    } else if (re.data.code == 40110) {
                      wx.redirectTo({ url: "/pages/login/login" });
                    }
                  }
                });
              } else {
                console.log('获取用户登录态失败！' + ress.errMsg)
              }
            }
          });
        }
      },
      fail:function(res){
        console.log("获取网络状态失败:",res);
      }
    });
  }
  /*,
  refresh:function(){
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000
    });
    var _this = this;
    var _location = this.getStorageLocation();
    if (_location) {//保存的有定位获取店铺
      var _locArr = _location.split("#");
      this.setData({
        latitude: _locArr[0],
        longitude: _locArr[1]
      });
      this.initData(function(){
        setTimeout(function () {
          wx.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 2000
          })
        }, 3000)
      });
    } else {//未保存定位重新获取定位
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          });
          _this.initData(function(){
            setTimeout(function () {
              wx.showToast({
                title: '刷新成功',
                icon: 'success',
                duration: 2000
              })
            }, 3000)
          });
        }
      });
    }    
  }*/
});
