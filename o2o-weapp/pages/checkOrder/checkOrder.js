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
        id:1,
        name:'富友商圈优惠券1',
        couponMin:10000,
        couponAmt:2000,
        endTime:'2017-12-30',
        select:false
      },
      {
        id: 2,
        name: '富友商圈优惠券2',
        couponMin: 5000,
        couponAmt: 1500,
        endTime: '2017-12-30',
        select: false
      },
      {
        id: 3,
        name: '富友商圈优惠券3',
        couponMin: 800,
        couponAmt: 2500,
        endTime: '2017-12-30',
        select: false
      }
    ],
    isPayAble:true,
    showPayModel:false,
    payPrice:18000,
    origiPrice:200,
    couponPrice:2000,
    couponId:''  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkAbleAndMaxCoupon();
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
  closeCoupon:function(){
    if(this.data.couponShowFlag == true){
      this.hideCoupon();
    }
  },
  selectCoupon:function(e){//选择优惠券
    var _index = e.currentTarget.dataset.idx;
    var _couponList = this.data.couponsList;
    for(var key in _couponList){
      if(_index == key){
        _couponList[key]["select"] = !_couponList[key]["select"];
        if (_couponList[key]["select"] == false){
          this.setData({
            couponPrice:0
          });
        }else{
          this.setData({
            couponPrice: _couponList[key].couponAmt/100
          });
        }
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
  },
  checkAbleAndMaxCoupon:function(){//选择最大的优惠券
    if (this.data.couponsList.length){
      var _maxKey = -1;
      var _maxPrice=0;
      for (var key in this.data.couponsList) { 
        if(this.data.couponsList[key].couponAmt > _maxPrice){
          _maxPrice = this.data.couponsList[key].couponAmt;
          _maxKey = key;
        }
      }
      if(_maxKey!=-1){
        var _coupon = this.data.couponsList;
        _coupon[_maxKey].select=true;
        this.setData({
          couponPrice:_maxPrice,
          couponId: this.data.couponsList[_maxKey].id,
          couponsList:_coupon
        });
      }
    }
    
  }
})