// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    couponShowFlag:false,
    couponsList:[
      {
        select:false
      },
      {
        select: true
      },
      {
        select: false
      }
    ],
    isPayAble:true,
    showPayModel:false,
    payPrice:180,
    origiPrice:200,
    couponPrice:20  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //显示、隐藏商家优惠券
  showCoupon:function(){
    this.setData({
      couponShowFlag:true,
      isPayAble:false
    });
  },
  hideCoupon:function(){
    this.setData({
      couponShowFlag:false,
      isPayAble:true
    });
  },
  selectCoupon:function(e){//选择优惠券
    var _index = e.currentTarget.dataset.idx;
    var _couponList = this.data.couponsList;
    for(var key in _couponList){
      if(_index == key){
        _couponList[key]["select"] = !_couponList[key]["select"];
      }else{
        _couponList[key]["select"] = false;
      }
    }
    this.setData({
      couponsList:_couponList
    });
  },
  topay:function(){//点击去结算
    console.log("to pay");
  },
  showPayModel:function(){
    this.setData({
      showPayModel: true
    });
  },
  closePayModel:function(){
    this.setData({
      showPayModel:false
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  }
})