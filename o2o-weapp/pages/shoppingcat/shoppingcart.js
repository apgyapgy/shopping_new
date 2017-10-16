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
    token:'',
    shoppingCartList:[],
    expiredId:'',
    jumpFlag:true,
    clickable:true
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
  onShow: function (options) {
    if (!app.globalData.location.cellCd) {
      app.globalData.location = {
        bmapLat: "31.228522821982",
        bmapLng: "121.56115068654",
        cellCd: "A2100224063",
        hostId: "70000030"
      };
      app.globalData.loginId = "15316117950";
    }
    this.getShopList();
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
        success: function (res) {
          if (res.data.code == 200) {
            _this.getShopList();
          } else if (res.data.code == 40101) {
            _this.getToken(function () {
              _this.deleteCart(_shopId, _goodId);
            });
          } else {
            _this.showModel("清除购物车失效商品失败,请重试!");
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
          _mchid = _dataset.mchid;
      var _active = _dataset.active;
      if (_active) {
        var _url = "/pages/shop/shop";
        if(_shopid){
          _url = _url+'?shopId='+_shopid+'&mchId='+_mchid;
          wx.navigateTo({
            url: _url
          });
        }
      } else {
        this.showModal("请先将定位切换至该小区", function () {
          console.log("去定位去");
        });
      }
    }else{
      this.setData({
        jumpFlag:true
      });
    }
  },
  showModal:function(txt,fn){//显示弹窗 
    wx.showModal({
      title: '提示',
      content: txt,
      showCancel: false,
      success:function(){
        if(fn){
          fn();
        }
      }
    });
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
      success: function (res) {
        if (res.data.code == 200) {
          _this.getShopList();
        } else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.deleteCart(_shopId,_goodId);
          });
        } else {
          _this.showModel("删除购物车商品失败!");
        }
      }
    });
  },
  //测试左滑删除end
  getShopList:function(){//获取购物车在的商品
    var _this = this;
    common.getAjax({
      url: 'wx_we/qryUserCart',
      params: {
        loginId: app.globalData.loginId,
        hostId: app.globalData.location.hostId
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log("getShopList:",res);
          var _shopCartList = [];
          var _expiredId = "";
          for (var key in res.data.data.sendList){
            var _area = res.data.data.sendList[key];
            _area.isActive = true;
            for(var shopkey in _area.list){
              var _shop = _area.list[shopkey];
              for(var goodkey in _shop.list){
                var _good = _shop.list[goodkey];
                _good.isTouchMove = false;
                if(_good.isExpire == 0){
                  _expiredId+=','+_good.goodsNo;
                }
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
                if (_good.isExpire == 0) {
                  _expiredId += ',' + _good.goodsNo;
                }
              }
            }
            _shopCartList.push(_area);
          }
          _this.setData({
            shoppingCartList:_shopCartList,
            expiredId: _expiredId.substring(1)
          });
        } else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.getShopList();
          });
        }else{
          _this.showModel("加载购物车数据失败!");
        }
      }
    });
  },
  getToken: function (fn) {//如果用户token过期，重新获取token，并获取数据
    var _this = this;
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
                _this.setData({
                  token: re.data.data.token
                });
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
});