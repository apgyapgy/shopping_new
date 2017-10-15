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
    goodsList:[],
    cartList: [],
    showCarInfoFlag:false,
    token:'',
    cartInfo: {
      orderNums: 0,
      totalAmt: 0
    },
    options:{
      mchId:"80001828",
      shopId:"6000000545",
      shopLogo:"",
      shopNm:"视不会后悔",
      cellCd:'A2100224063'
    },
    clickable:true,
    selectInfo:{
      selectAll:false,
      selectNums:0,
      selectAmt:0
    },
    selectIds:[]
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    if(options.shopId){
      this.setData({
        options: options
      });
    }else{
      app.globalData.loginId = "15316117950";//测试使用，测试完成可删除 
    }
    this.getGoodsList();
    this.getCartList();
  },
  addsub:function(e){//加减购物车商品
    if (this.data.clickable) {
      var _goodsNo = e.target.dataset.goodsno;
      var _type = e.target.dataset.type;
      var _num = e.target.dataset.num;
      this.setData({
        clickable: false
      });
      this.updateOrderNum(_goodsNo,_num, _type);
    }
  },
  saveCart:function(e){//将商品加入购物车，用于购物车中未有该商品
    if (this.data.clickable){
      this.setData({
        clickable:false
      });
      var _this = this;
      var _idx = e.target.dataset.index;
      var _goodsNo = e.target.dataset.goodsno;
      var _goodsAmt = e.target.dataset.goodsamt;
      this.saveCartAjax(_goodsNo, _goodsAmt);
    } 
  },
  saveCartAjax: function (_goodsNo, _goodsAmt,fn){//商品加入购物车请求
    var _this = this;
    common.getAjax({
      url: 'wx_we/saveCart',
      params: {
        userId : app.globalData.loginId,
        loginId: app.globalData.loginId,
        mchId : _this.data.options.mchId,
        shopId : _this.data.options.shopId,
        goodsNo : _goodsNo,
        goodsAmt : _goodsAmt,
        orderNum : 1,
        orderAmt : _goodsAmt,
        operator: app.globalData.loginId
      },
      token: _this.data.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("add cart success:",res);
          _this.getCartList();
          if (fn) {
            fn();
          }
        }else if (res.data.code == 201){
          wx.showModal({
            title: '提示',
            content: '该商品已加入购物车',
            showCancel:false,
            success: function (res) {
            }
          });
        }else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.saveCartAjax(_goodsNo, _goodsAmt, fn);
          });
        }
      },
      complete:function(){
        _this.setData({
          clickable: true
        });
      }
    });
  },
  showCarInfo:function(){//显示购物车信息
    if (this.data.cartList.length>0){
      this.setData({
        showCarInfoFlag: true
      });
    }
  },
  hideCarInfo: function () {//隐藏购物车信息
    this.setData({
      showCarInfoFlag: false
    });
  },
  selectAll:function(){//全选或取消购物车中商品
    var _selectIds = this.data.selectIds;
    var _cartList = this.data.cartList;
    if (_selectIds.length == _cartList.length){
      this.setData({
        selectIds:[]
      });
      this.computedCartInfo();
    }else{
      this.getSelectInfo(_cartList);
    }
  },
  selectGood:function(e){//选择或取消购物车中商品
    var _goodsNo = e.currentTarget.dataset.goodsno;
    var _selectIds = this.data.selectIds;
    var _index=-1;
    for (var key in _selectIds){
      if (_goodsNo == _selectIds[key]){
        _index = key;
        break;
      }
    }
    if (_index!=-1){
      var _index = _selectIds.indexOf(_goodsNo);
      _selectIds.splice(_index, 1);
    }else{
      _selectIds.push(_goodsNo);
    }
    this.setData({
      selectIds: _selectIds
    });
    this.computedCartInfo();
  },
  topay:function(){//去支付
    wx.navigateTo({
      url: '/pages/checkOrder/checkOrder',
    });
  },
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
  preventTapParent:function(){//阻止 事件冒泡
  },
  getGoodsList:function(){//获取店铺中的商品
    var _this = this;
    common.getAjax({
      url: 'wx_we/queryShopGoods',
      params: {
        loginId: app.globalData.loginId,
        shopId: _this.data.options.shopId
      },
      token: _this.data.token,
      success: function (res) {
        if (res.data.code == 200) {
          var _goodsList = [];
          if (res.data.data.list) {
            _goodsList = res.data.data.list;
            if (res.data.data.cartInfo){//如果购物车中有内容 
              for (var key in _goodsList) {
                _goodsList[key].num = 0;
                //图片拼接
                /*if (_goodsList[key].goodsImgLogo){
                  _goodsList[key].goodsImgLogo = app.globalData.imgPre + _goodsList[key].goodsImgLogo;
                }*/
                _goodsList[key].goodsImgLogo = '../../image/good.png';
              }
              _this.setData({
                goodsList: _goodsList
              });
            } else {//购物车中无商品
              for (var key in _goodsList) {//无商品将商品的num即加入购物车中的数据置0
                _goodsList[key].num = 0;
                //图片拼接
                /*if (_goodsList[key].goodsImgLogo){
                  _goodsList[key].goodsImgLogo = app.globalData.imgPre + _goodsList[key].goodsImgLogo;
                }*/
                _goodsList[key].goodsImgLogo = '../../image/good.png';
              }
              _this.setData({
                goodsList: _goodsList
              });
            }
          }else if(res.data.code == 40101){
            _this.getToken(function () {
              _this.getGoodsList();
            });
          }
        }
      },
      fail: function (res) {
        console.log("获取店铺数据失败了:", res);
      }
    });
  },
  getCartList:function(){//获取购物车中的商品
    var _this = this;
    common.getAjax({
      url: 'wx_we/queryShopCart',
      params: {
        loginId: app.globalData.loginId,
        shopId: _this.data.options.shopId
      },
      token: _this.data.token,
      success: function (res) {
        if (res.data.code == 200) {
          var _cartInfo = {
            orderNums:0,
            totalAmt:0
          };
          if (res.data.data.cartInfo){
            _cartInfo = res.data.data.cartInfo
          }
          _this.setData({
            cartInfo:_cartInfo
          });
          _this.getSelectInfo(res.data.data.list);
          if(!_this.data.cartList.length){
            _this.setData({
              showCarInfoFlag:false
            });
          }
        }else if(res.data.code == 40101){
          _this.getToken(function(){
            _this.getCartList();
          });
        }
      },
      fail: function (res) {
      }
    });
  },
  getToken:function(fn){//如果用户token过期，重新获取token，并获取数据
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
  },
  updateOrderNum:function(_goodsNo,_num,_type){//加减购物车数据
    var _this = this;
    if(_num==1&&_type=='sub'){
      _this.deleteCart(_goodsNo);
    }else{
      common.getAjax({
        url: 'wx_we/updateOrderNum',
        params: {
          loginId: app.globalData.loginId,
          shopId: _this.data.options.shopId,
          goodsNo:_goodsNo,
          type:_type=='add'?0:1
        },
        token: _this.data.token,
        success: function (res) {
          if (res.data.code == 200) {
            _this.getCartList();
          } else if (res.data.code == 40101) {
            _this.getToken(function () {
              _this.updateOrderNum(_goodsNo,_num, _type);
            });
          }
        },
        complete:function(){
          _this.setData({
            clickable:true
          });
        }
      }); 
    }
  },
  deleteCart:function(_goodsNo){//删除购物车中的某个商品
    var _this = this;
    common.getAjax({
      url: 'wx_we/deleteCart',
      params: {
        loginId: app.globalData.loginId,
        shopId: _this.data.options.shopId,
        goodsNo: _goodsNo
      },
      token: _this.data.token,
      success: function (res) {
        if (res.data.code == 200) {
          _this.getCartList();
        } else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.deleteCart(_goodsNo);
          });
        }
      },
      complete: function () {
        _this.setData({
          clickable: true
        });
      }
    });
  },
  emptyCart:function(){//清空购物车
    var _this = this;
    common.getAjax({
      url: 'wx_we/clearCart',
      params: {
        loginId: app.globalData.loginId,
        shopId: _this.data.options.shopId
      },
      token: _this.data.token,
      success: function (res) {
        if (res.data.code == 200) {
          _this.setData({
            cartList:[],
            cartInfo: {
              orderNums: 0,
              totalAmt: 0
            },
            showCarInfoFlag: false, 
            selectInfo: {
              selectAll: false,
              selectNums: 0,
              selectAmt: 0
            },
            selectIds: []
          });
        } else if (res.data.code == 40101) {
          _this.getToken(function () {
            _this.emptyCart();
          });
        }
      },
      complete: function () {
        _this.setData({
          clickable: true
        });
      }
    });
  },
  computedCartInfo:function (cartList) {//计算购物车信息
    if(cartList){
      var _cartList = cartList;
    }else{
      var _cartList = this.data.cartList;
    }
    var _num = 0,_totalAmt=0;
    var _selectId = this.data.selectIds;
    for(var key in _cartList){
      if (_selectId.indexOf(_cartList[key].goodsNo)!=-1) {
        _num += _cartList[key].orderNum;
        _totalAmt += _cartList[key].orderAmt*_cartList[key].orderNum;
        _cartList[key].isSelected = true;
      } else {
        _cartList[key].isSelected = false;
      }
    }
    //console.log(_selectId,_seArr,_seArr.length,_cartList.length)
    this.setData({
      selectInfo:{
        selectAll: _selectId.length==_cartList.length?true:false,
        selectNums:_num,
        selectAmt:_totalAmt
      },
      cartList:_cartList
    });
  },
  getSelectInfo:function(cartList){//获取购物车选中信息列表
    if(!this.data.selectIds.length){//一开始未选 中商品
      var _selectIdArr = [];
      for (var key in cartList){
        _selectIdArr.push(cartList[key].goodsNo);
      }
      this.setData({
        selectIds: _selectIdArr
      });
    }
    this.computedCartInfo(cartList);
  }
})                                                                                                                             