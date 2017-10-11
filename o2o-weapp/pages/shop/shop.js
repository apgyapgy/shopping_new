// pages/shop/shop.js
//获取应用实例
const app = getApp()
import common from '../../js/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backTopIconShowFlag: false,
    scrollTop: 0,
    goodsList:[
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:1},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:3},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:14},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:91},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:5},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:11},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:13},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num:20},
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 1 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 3 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 14 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 91 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 5 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 11 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 13 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 20 }
    ],
    carList: [
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 1 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 3 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 14 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 91 },
      { imgurl: '../../image/good.png', price: 1.8, name: '上海本地蕃茄500g', num: 5 }
    ],
    showCarInfoFlag:false,
    token:'',
    shopId:'6000000545'
  },
  sub:function(e){
    var _idx = e.target.dataset.index;
    var _goodsList = this.data.goodsList;
    _goodsList[_idx]['num']--;
    this.setData({
      goodsList: _goodsList
    });
  },
  add:function(e){
    var _idx = e.target.dataset.index;
    var _goodsList = this.data.goodsList;
    _goodsList[_idx]['num']++;
    this.setData({
      goodsList:_goodsList
    });
  },
  showCarInfo:function(){
    this.setData({
      showCarInfoFlag: true
    });
  },
  hideCarInfo: function () {
    this.setData({
      showCarInfoFlag: false
    });
  },
  selectAll:function(){//全选
  },
  selectGood:function(){//选择商品
  },
  topay:function(){
    wx.navigateTo({
      url: '/pages/checkOrder/checkOrder',
    });
  },
  //返回顶部
  goTop: function () {
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
  preventTapParent:function(){//阻止 事件冒泡
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var _shopid = options.shopid;
    var _this = this;
    /*this.setData({
      shopId:_shopid
    });*/
    this.getToken(function(){
      common.getAjax({
        url: 'wx_we/queryShopGoods',
        params: {
          loginId: app.globalData.loginId,
          shopId: _this.data.shopId
        },
        token: _this.data.token,
        success: function (res) {
          console.log("店铺页面:", res);
          if(res.data.code == 200){
            var _goodsList = [];
            if(res.data.data.list){
              _goodsList = res.data.data.list;
              _this.setData({
                goodsList:_goodsList
              });
              console.log("goodsList:",_this.data.goodsList);
            }
          }
        },
        fail:function(res){
          console.log("获取店铺数据失败了:",res);
        }
      });
    });
  },
  getToken:function(fn){
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
              console.log("in shop page oauth:",re);
              if (re.data.code == 200) {
                app.globalData.loginId = re.data.data.loginId;
                _this.setData({
                  token:re.data.data.token
                });
                if(fn){
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
})