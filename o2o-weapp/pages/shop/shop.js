// pages/shop/shop.js
//获取应用实例
const app = getApp()
import common from '../../js/common.js';
Page({
  data: {
    backTopIconShowFlag: false,
    scrollTop: 0,
    goodsList:[],
    cartList: [],
    showCarInfoFlag:false,
    cartInfo: {//购物车金额 与商品总数
      orderNums: 0,
      totalAmt: 0
    },
    options:{//url参数
      mchId:"80001828",
      shopId:"6000000545"
    },
    shop:[],//店铺信息
    clickable:true,
    selectInfo:{//已选中商品信息
      selectAll:false,
      selectNums:0,
      selectAmt:0
    },
    selectIds:null,
    imgPre:app.globalData.imgPre,
    expireList:[],//过期失效商品
    netDisconnectFlag: false,
    showReceiveCouponFlag:false,  //是否显示领取优惠券弹窗
    mchCoupon:{},
    noGoodText:'暂无商品'
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var _this = this;
    if (options.shopId) {
      this.setData({
        options: options
      });
    }/* else {
      app.globalData.loginId = "15316117950";//测试使用，测试完成可删除 
    }*/
    this.getShopCoupon();
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
  onShow: function () {
    var _this = this;
    this.setData({
      goodsList: [],
      cartList: [],
      showCarInfoFlag: false,
      cartInfo: {
        orderNums: 0,
        totalAmt: 0
      },
      shop: [],
      selectInfo: {
        selectAll: false,
        selectNums: 0,
        selectAmt: 0
      },
      selectIds: null
    });
    this.getGoodsList();
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
        operator: app.globalData.loginId,
        type:0,
        hostId:app.globalData.location.hostId
      },
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("add cart success:",res);
          var _selectIds = _this.data.selectIds;
          //console.log("index:",_selectIds.indexOf(_goodsNo));
          if(_selectIds.indexOf(_goodsNo) == -1){
            _selectIds.push(_goodsNo);
            _this.setData({
              selectIds: _selectIds
            });
          }
          _this.getGoodsList();
          if (fn) {
            fn();
          }
        }else if (res.data.code == 201){
          common.showModal('该商品已加入购物车');
        }else if (res.data.code == 40101) {
          app.getToken(_this,function () {
            _this.saveCartAjax(_goodsNo, _goodsAmt, fn);
          });
        }else{
          common.showModal(res.data.desc);
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
    if (this.data.cartList.length > 0 || this.data.expireList.length>0){
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
      this.getSelectInfo(_cartList,true);
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
    var _this = this;
    if (this.data.clickable && this.data.selectInfo.selectAmt >= this.data.shop.distAmtMin){
      this.setData({
        clickable:false
      });
      var _selectIds = this.data.selectIds;
      if(_selectIds.length){
        this.setData({
          clickable: true
        });
        wx.navigateTo({
          url: '/pages/checkOrder/checkOrder?shopId=' + _this.data.shop.shopId
          + '&cellCd=' + app.globalData.location.cellCd + '&goodsNo='+_selectIds
          +'&mchId='+_this.data.shop.mchId
        });
      }else{
        this.setData({
          clickable: true
        });
      }
    }
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
      token: app.globalData.token,
      success: function (res) {
        console.log("queryShopGoods:",res);
        if (res.data.code == 200) {
          var _goodsList = [];
          if (res.data.data.list) {
            _goodsList = res.data.data.list;
            if (JSON.stringify(res.data.data.shop) != '{}' && res.data.data.shop.shopSt==1){//如果店铺未关闭
              _this.setData({
                goodsList: _goodsList,
                shop: res.data.data.shop
              });
              //如果店铺没有商品且提示不为‘暂无商品’，改提示
              if (!_goodsList.length && _this.data.noGoodText != '暂无商品') {
                _this.setData({
                  noGoodText: '暂无商品'
                });
              }
              _this.getCartList();
            }else{//店铺已关闭，提示用户
              _this.setData({
                goodsList: [],
                shop: res.data.data.shop,
                noGoodText:'店铺升级中，敬请期待...'
              });
            }
          }
        }else if(res.data.code == 40101){
          app.getToken(_this,function () {
            _this.getGoodsList();
          });
        }else{
          common.showModal(res.data.desc);
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
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("queryShopCart:",res);
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
          if(!_this.data.cartList.length){
            _this.setData({
              showCarInfoFlag:false,
              selectIds:null
            });
          }
          _this.setData({
            expireList: res.data.data.expireList?res.data.data.expireList:[]
          });
          _this.getSelectInfo(res.data.data.list);
        }else if(res.data.code == 40101){
          app.getToken(_this,function(){
            _this.getCartList();
          });
        }else{
          common.showModal(res.data.desc);
        }
      },
      fail: function (res) {
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
          type:_type=='add'?0:1   //0为增，1为减
        },
        token: app.globalData.token,
        success: function (res) {
          if (res.data.code == 200) {
            if(_type == 'add'){
              var _selectIds = _this.data.selectIds;
              if (_selectIds.indexOf(_goodsNo) == -1) {
                _selectIds.push(_goodsNo);
                _this.setData({
                  selectIds: _selectIds
                });
              }
            }
            _this.getGoodsList();
          } else if (res.data.code == 40101) {
            app.getToken(_this,function () {
              _this.updateOrderNum(_goodsNo,_num, _type);
            });
          }else{
            common.showModal(res.data.desc);
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
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          var _selectIds = _this.data.selectIds;
          var _index = _selectIds.indexOf(_goodsNo);
          _selectIds.splice(_index,1);
          _this.setData({
            selectIds:_selectIds
          });
          _this.getGoodsList();
        } else if (res.data.code == 40101) {
          app.getToken(_this,function () {
            _this.deleteCart(_goodsNo);
          });
        }else{
          common.showModal(res.data.desc);
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
      token: app.globalData.token,
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
            selectIds: null
          });
          _this.getGoodsList();
        } else if (res.data.code == 40101) {
          app.getToken(_this,function () {
            _this.emptyCart();
          });
        }else{
          common.showModal(res.data.desc);
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
        _totalAmt += _cartList[key].goodsAmt*_cartList[key].orderNum;
        _cartList[key].isSelected = true;
      } else {
        _cartList[key].isSelected = false;
      }
    } 
    for (var key in this.data.expireList){
      var _index = _selectId.indexOf(this.data.expireList[key].goodsNo);
      if(_index!=-1){
        _selectId.splice(_index,1);
      }
    }
    this.setData({
      selectInfo:{
        selectAll: _selectId.length == _cartList.length && _cartList.length>0?true:false,
        selectNums:_num,
        selectAmt:_totalAmt
      },
      cartList:_cartList
    });
  },
  getSelectInfo:function(cartList,_type){//获取购物车选中信息列表
    //_type判断是否是全选事件中触发，
    if(this.data.selectIds == null || _type){//一开始未选 中商品
      var _selectIdArr = [];
      for (var key in cartList){
        _selectIdArr.push(cartList[key].goodsNo);
      }
      this.setData({
        selectIds: _selectIdArr
      });
    }
    this.computedCartInfo(cartList);
  },
  formatCouponDate:function(_date){//格式化日期
    _date = _date + '';
    return _date.substring(0, 4) + '.' + _date.substring(4, 6) + '.' + _date.substring(6, 8);
  },
  getShopCoupon:function(){//获取店铺优惠券
    var _this = this;
    common.getAjax({
      url: 'api/coupon/getShopCoupon',
      params: {
        mchId: _this.data.options.mchId
      },
      token: app.globalData.token,
      success: function (res) {
        if (res.data.code == 200) {
          console.log("getShopCoupon:", res);
          if(res.data.data){
            _this.setData({
              mchCoupon: res.data.data,
              showReceiveCouponFlag: true
            });
          }
        } else if (res.data.code == 40101) {
          app.getToken(_this, function () {
            _this.getShopCoupon();
          });
        } else {
          common.showModal(res.data.desc);
        }
      },
      fail: function (res) {
      }
    });
  },
  receiveCoupon: function () {//领取优惠券
    if (this.data.mchCoupon.couponNo){
      var _this = this;
      common.getAjax({
        url: 'api/coupon/takeShopCoupon',
        params: {
          couponNo: _this.data.mchCoupon.couponNo
        },
        token: app.globalData.token,
        success: function (res) {
          if (res.data.code == 200) {
            console.log("takeShopCoupon:", res);
            _this.setData({
              showReceiveCouponFlag:false
            });
            var _content = "";
            if (res.data.desc == '抱歉，优惠券总数量已发放完毕'){
              _content = '券已被抢光，下次早点来哟!';
            }else{
              _content = '领取成功，快去使用';
            }
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: _content,
              confirmText: '知道了',
              success: function (res) { }
            });         
          } else if (res.data.code == 40101) {
            app.getToken(_this, function () {
              _this.receiveCoupon();
            });
          } else {
            common.showModal(res.data.desc);
          }
        },
        fail: function (res) {
        }
      });
    }
  },
  closeReceiveCoupon:function(){//关闭领取优惠券弹窗 
    this.setData({
      showReceiveCouponFlag:false
    });
  }
})                                                                                                                             