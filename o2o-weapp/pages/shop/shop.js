// pages/shop/shop.js
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
    showCarInfoFlag:false
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
  preventTapParent:function(){//阻止 事件冒泡

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _shopid = options.shopid;
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //返回顶部
  goTop: function () {
    /*wx.pageScrollTo({
      scrollTop: 0
    });*/
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
  }
})