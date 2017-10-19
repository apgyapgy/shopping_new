// pages/order/order.js
var app = getApp();
import common from "../../js/common.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    orderList:[],
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
    showPayModel:false,
    orderSt: [0, 200, 201, 203],//0待支付  200待配送  201配送成功待取货 203已完成
    backTopIconShowFlag: false,
    scrollTop: 0,
    clickable:true,
    clickIdx:'',//立即付款与开箱的idx,用于获取订单信息
    payData:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        activeTab:options.type
      });
    }
    var _this = this;
    this.getToken(function(){
      _this.getOrders();
    });
  },
  onShow:function(){
    this.qryUserCartNums();
  },
  changeTab: function (e) {
    var _index = e.target.dataset.index;
    this.setData({
      activeTab: _index
    });
    this.getOrders();
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
  showPayModel: function (e) {
    return;
    var _idx = e.currentTarget.dataset.idx;
    this.setData({
      showPayModel: true,
      clickIdx:_idx
    });
  },
  closePayModel: function () {
    this.setData({
      showPayModel: false
    });
  },
  getOrders:function(){
    var _this = this;
    common.getAjax({
      url: 'api/orderQry',
      params: {
        needGoods:11,
        orderSt: _this.data.orderSt[_this.data.activeTab],
        orderSrc:3
      },
      token: app.globalData.token,
      success: function (res) {
        console.log("getOrders:",res);
        if(res.data.code == 200){
          _this.setData({
            orderList:res.data.data.datas
          });
        }else if(res.data.code == 40101){
          _this.getToken(function(){
            _this.getOrders();
          });
        }
      },
      complete: function () {
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
              console.log("in order page oauth:", re);
              if (re.data.code == 200) {
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
  },
  topay: function (e) {//点击去结算
  },
  goTop: function () { //返回顶部
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
        } else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.qryUserCartNums();
          })
        } else {
          common.showModal(res.data.desc);
        }
      }
    });
  }
})