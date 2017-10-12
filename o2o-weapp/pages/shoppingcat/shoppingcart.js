// pages/shoppingcat/shoppingcart.js
var app = getApp();
import common from '../../js/common.js';
Page({
  data: {
    backTopIconShowFlag: false,
    scrollTop: 0, tabbarArray: [
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
    shoppingCartList:[
      {
        area:'浦东新区-508小区',
        isActive:true,
        shops: [
          {
            shopId: '111',
            name: 'XXX商户',
            goodsList: [
              {
                img: '../../image/good.png',
                name: '上海本地蕃茄500g',
                price: 1.8,
                num: 2,
                isTouchMove: false
              },
              {
                img: '../../image/good.png',
                name: '上海本地蕃茄500g',
                price: 1.8,
                num: 2,
                isTouchMove: false
              }, {
                img: '../../image/good.png',
                name: '上海本地蕃茄500g',
                price: 1.8,
                num: 2,
                isTouchMove: false
              }
            ]
          }
        ]
      },
      {
        area: '虹口区-中山北一路865弄小区',
        isActive: false,
        shops: [
          {
            shopId: '222',
            name: 'XXX商户',
            goodsList: [
              {
                img: '../../image/good.png',
                name: '上海本地蕃茄500g',
                price: 1.8,
                num: 2,
                isTouchMove: false
              },
              {
                img: '../../image/good.png',
                name: '上海本地蕃茄500g',
                price: 1.8,
                num: 2,
                isTouchMove: false
              }, {
                img: '../../image/good.png',
                name: '上海本地蕃茄500g',
                price: 1.8,
                num: 2,
                isTouchMove: false
              }
            ]
          }
        ]
      }
    ],
    sendList:[],
    unSendList:[],
    //测试左滑删除begin
    startX:0,
    startY:0,
    //测试左滑删除end,
    token:''
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
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
    console.log("清空失效商品");
  },
  jumpShop:function(e){//点击店铺或商品跳到店铺
    var _shopid = e.currentTarget.dataset.shopid;
    var _active = e.currentTarget.dataset.active;
    if(_active){
      var _url = _shopid ? '/pages/shop/shop?shopid=' + _shopid : '/pages/shop/shop';
      wx.navigateTo({
        url: _url
      });
    }else{
      this.showModal("请先将定位切换至该小区",function(){
        console.log("去定位去");
      });
    }
    console.log("jumpshop:",e);
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
      for (var shop in _cartList[area].shops){
        for (var good in _cartList[area].shops[shop].goodsList){
          if (_cartList[area].shops[shop].goodsList[good].isTouchMove){
            _cartList[area].shops[shop].goodsList[good].isTouchMove = false;
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
      for (var shop in _cartList[area].shops) {
        for (var good in _cartList[area].shops[shop].goodsList) {
          _cartList[area].shops[shop].goodsList[good].isTouchMove = false;
          if (Math.abs(angle) > 30) 
            return;
          if (area == _indexArr[0] && shop == _indexArr[1] && good == _indexArr[2]) {
            if (touchMoveX > startX) //右滑
              _cartList[area].shops[shop].goodsList[good].isTouchMove = false;
            else //左滑
              _cartList[area].shops[shop].goodsList[good].isTouchMove = true;
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
    /*this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    });*/
  },
  //测试左滑删除end
  getShopList:function(){//获取购物车在的商品
    var _this = this;
    common.getAjax({
      url: 'wx_we/qryUserCart',
      params: {
        loginId: app.globalData.loginId,
        cellCd: app.globalData.location.cellCd
      },
      success: function (res) {
        console.log("qryUserCart:", res);
        if (res.data.code == 200) {
          var _lists = [];
          for(var key in res.data.data.list){
            var _list = res.data.data.list[key];
            
          }
          _this.setData({
            sendList:res.data.data.list,
            unSendList:res.data.data.unSendList
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