// pages/shoppingcat/shoppingcart.js
var app = getApp();
import common from '../../js/common.js';
Page({
  data: {
    backTopIconShowFlag: false,
    scrollTop: 0, 
    tabbarArray: [
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
        active: true
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
    //测试左滑删除begin
    startX:0,
    startY:0,
    //测试左滑删除end,
    shoppingCartList:[],
    disAbledGoods:[],
    expiredId:'',
    jumpFlag:true,
    clickable: true,//是否可点击，用于防止连续点击 
    imgPre: app.globalData.imgPre,
    noCartFlag:false,
    netDisconnectFlag: false
  },
  /*生命周期函数--监听页面加载*/
  /*onLoad: function (options) {
    if(!app.globalData.location.cellCd){
      app.globalData.location = { 
        bmapLat: "31.228522821982", 
        bmapLng: "121.56115068654", 
        cellCd: "A2100224063", 
        hostId: "70000030" 
      };
      app.globalData.loginId = "15316117950";
    }
    this.getShopList();
  },*/
  onLoad: function () {
    var _this = this;
    if (wx.onNetworkStatusChange){
      wx.onNetworkStatusChange(function (res) {
        console.log("ent change:", res);
        if (res.networkType == 'none') {
          _this.setData({
            netDisconnectFlag: true
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
  onShow: function (options) {
    this.getShopList();
    app.qryUserCartNums(this);
  },
  //返回顶部
  goTop: function () {//返回顶部
    this.setData({
      scrollTop: 0
    });
  },
  checkBackTop: function (e) {//检测并判断是否显示返回顶部按钮 
    if (e.detail.scrollTop > 500) {
      if (this.data.backTopIconShowFlag == false) {
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
  clearInvalid:function(){//清空失效商品
    if (this.data.clickable) {
      var _expiredId = this.data.expiredId;
      if (!_expiredId){
        this.setData({
          clickable: true
        });
        return;
      }
      var _this = this;
      this.setData({
        clickable: false
      });
      var _this = this;
      common.getAjax({
        url: 'wx_we/deleteExpireCart',
        params: {
          loginId: app.globalData.loginId,
          goodsNoStr: _expiredId
        },
        token: app.globalData.token,
        success: function (res) {
          if (res.data.code == 200) {
            _this.getShopList();
            _this.qryUserCartNums();
          } else if (res.data.code == 40101) {
            app.getToken(_this,function () {
              _this.deleteCart(_shopId, _goodId);
            });
          } else {
            common.showModal("清除购物车失效商品失败,请重试!");
          }
        },
        complete:function(){
          _this.setData({
            clickable: true
          });
        }
      });
    }
  },
  jumpShop:function(e){//点击店铺或商品跳到店铺
    if(this.data.jumpFlag){
      var _dataset = e.currentTarget.dataset;
      var _shopid = _dataset.shopid,
          _mchid = _dataset.mchid,
          _shopSt = _dataset.shopst;
      var _active = _dataset.active;
      if (_active) { 
        var _url = "/pages/shop/shop";
        if (_shopid) {
          _url = _url + '?shopId=' + _shopid + '&mchId=' + _mchid;
          wx.navigateTo({
            url: _url
          });
        }
      } else {
        common.showModal("请先将定位切换至该小区");
      }
    }else{
      this.setData({
        jumpFlag:true
      });
    }
  },
  //测试左滑删除begin
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    var _cartList = this.data.shoppingCartList;
    for (var area in _cartList){
      for (var shop in _cartList[area].list){
        for (var good in _cartList[area].list[shop].list){
          if (_cartList[area].list[shop].list[good].isTouchMove){
            _cartList[area].list[shop].list[good].isTouchMove = false;
          }
        }
      }
    }
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      shoppingCartList: _cartList
    });
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    var _indexArr = index.split("#");
    var _cartList = this.data.shoppingCartList;
    for (var area in _cartList) {
      for (var shop in _cartList[area].list) {
        for (var good in _cartList[area].list[shop].list) {
          _cartList[area].list[shop].list[good].isTouchMove = false;
          if (Math.abs(angle) > 30) 
            return;
          if (area == _indexArr[0] && shop == _indexArr[1] && good == _indexArr[2]) {
            if (touchMoveX > startX) //右滑
              _cartList[area].list[shop].list[good].isTouchMove = false;
            else{ //左滑
              _cartList[area].list[shop].list[good].isTouchMove = true;
              that.setData({
                jumpFlag:false
              });
            }
          }
        }
      }
    }
    //更新数据
    that.setData({
      shoppingCartList: _cartList
    });
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {//删除购物车数据
    var _index = e.currentTarget.dataset.index;
    console.log(_index);
    var _indexArr = _index.split("#");
    var _cartList = this.data.shoppingCartList;
    var _shopId = _cartList[_indexArr[0]].list[_indexArr[1]].shopId;
    var _goodId = _cartList[_indexArr[0]].list[_indexArr[1]].list[_indexArr[2]].goodsNo;
    this.deleteCart(_shopId,_goodId);
  },
  deleteCart:function(_shopId,_goodId){//删除某店铺购物车中某件商品
    var _this = this;
    common.getAjax({
      url: 'wx_we/deleteCart',
      params: {
        loginId: app.globalData.loginId,
        shopId: _shopId,
        goodsNo:_goodId
      },
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          _this.getShopList();
          _this.qryUserCartNums();
        } else if (res.data.code == 40101) {
          app.getToken(_this,function () {
            _this.deleteCart(_shopId,_goodId);
          });
        } else {
          common.showModal("删除购物车商品失败!");
        }
      }
    });
  },
  //测试左滑删除end
  getShopList:function(){//获取购物车在的商品
    var _this = this;
    if (this.data.noCartFlag == true){
      this.setData({
        noCartFlag:false
      });
    }
    if (app.globalData.location && JSON.stringify(app.globalData.location) != ''){
      var _hostId = app.globalData.location.hostId;
    }else{
      var _hostId = '';
    }
    common.getAjax({
      url: 'wx_we/qryUserCart',
      params: {
        loginId: app.globalData.loginId,
        hostId: _hostId
      },
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("getShopList:",res);
          var _shopCartList = [];
          var _expiredId = "";
          var _expiredList = [];
          for (var key in res.data.data.sendList){
            var _area = res.data.data.sendList[key];
            _area.isActive = true;
            for(var shopkey in _area.list){
              var _shop = _area.list[shopkey];
              for(var goodkey in _shop.list){
                var _good = _shop.list[goodkey];
                _good.isTouchMove = false;
                /*if(_good.isExpire == 0){//isExpire为0表示失效，为1未失效
                  _expiredId+=','+_good.goodsNo;
                }*/
              }
            }
            _shopCartList.push(_area);
          }
          for (var key in res.data.data.unSendList) {
            var _area = res.data.data.unSendList[key];
            _area.isActive = false;
            for (var shopkey in _area.list) {
              var _shop = _area.list[shopkey];
              for (var goodkey in _shop.list) {
                var _good = _shop.list[goodkey];
                _good.isTouchMove = false;
              }
            }
            _shopCartList.push(_area);
          }
          var _disAbledGoods = res.data.data.disAbledGoods;
          for (var key in _disAbledGoods){
            _expiredId += ',' + _disAbledGoods[key].goodsNo;
          }
          if (_shopCartList.length || _disAbledGoods.length){
            _this.setData({
              shoppingCartList: _shopCartList,
              expiredId: _expiredId.substring(1),
              disAbledGoods: _disAbledGoods
            });
          }else{
            _this.setData({
              shoppingCartList: _shopCartList,
              expiredId: _expiredId.substring(1),
              noCartFlag: true,
              disAbledGoods: _disAbledGoods
            });
          }
          //_this.qryUserCartNums();
        } else if (res.data.code == 40101) {
          app.getToken(_this,function () {
            _this.getShopList();
          });
        } else {
          _this.setData({
            shoppingCartList: [],
            expiredId: '',
            noCartFlag: true
          });
          common.showModal("加载购物车数据失败!");
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
          common.showModal("网络已断开，请联网后重试!",function(){
            _this.setData({
              clickable:true
            });
          });
        } else {
          wx.login({
            success: ress => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (ress.code) {
                wx.request({
                  url: app.globalData.baseUrl + 'wx_we/oauth',
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
                      common.reLaunch('/pages/login/login');
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
  },
  qryUserCartNums: function () {
    var _this = this;
    common.getAjax({
      url: 'wx_we/qryUserCartNums',
      params: {
        loginId: app.globalData.loginId
      },
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("qryUserCartNums:", res);
          var _tabbarArray = _this.data.tabbarArray;
          if (res.data.data.totalNumbers != _tabbarArray[1].shopCartNum) {
            _tabbarArray[1].shopCartNum = res.data.data.totalNumbers;
            _this.setData({
              tabbarArray: _tabbarArray
            });
          }
        }else if(res.data.code == 40101){
          app.getToken(_this,function(){
            _this.qryUserCartNums();
          })
        }else{
          common.showModal(res.data.desc);
        }
      }
    });
  }
});