// pages/orderinfo/orderinfo.js
let app = getApp();
import common from '../../js/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: '',//200121711210000000022
    orderInfo:{},
    imgPre:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgPre: app.globalData.imgPre
    });
    if(options.no){
      this.setData({
        no:options.no
      });
      this.getOrderInfo();
    }else{
      this.getOrderInfo();
    }
  },
  getOrderInfo:function(){//获取订单详情
    var _this = this;
    common.getAjax({
      url: 'api/onlineOrderDetail/' + _this.data.no,
      token: app.globalData.token,
      success: function (res) {
        console.log("getOrderInfo:", res);
        if (res.data.code == 200) {
          if (res.data.data.order) {
            var _order = res.data.data.order;
            _order.crtTs = _this.breakStr(_order.crtTs,0,19);
            _order.payTsTrue = _this.breakStr(_order.payTsTrue, 0, 19);
            _this.setData({
              orderInfo: _order,
              noOrderFlag: false
            })
          } else {
            _this.setData({
              orderInfo: {},
              noOrderFlag: true
            });
          }
        } else if (res.data.code == 40101) {
          app.getToken(_this, function () {
            _this.getOrderInfo();
          });
        } else {
          _this.setData({
            orderInfo:{},
            noOrderFlag: true
          })
          common.showModal(res.data.desc);
        }
      },
      complete: function () {
      }
    });
  },
  breakStr:function(str,start,end){
    return str.substring(start,end);
  }
})