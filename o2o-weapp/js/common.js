var baseUrl = 'https://dswx-test.fuiou.com/o2o/';//测试
var getSerial = function () {
  return new Date().getTime();
}
var getSession = function (suc) {
  var session_id = wx.getStorageSync('sessionId');
  suc(session_id);
};
var clearSession = function () {
  setTimeout(function () {
    wx.clearStorageSync();
    wx.showModal({
      title: '提示',
      content: '登录超时,请重新登录',
      showCancel: false,
      success: function (res) {
        wx.navigateTo({
          url: '../login/login',
        });
      }
    });
  }, 1800000);
}
//基本参数
var basicParms = {
  clientType: '3',
  clientVersion: '1.0.0',
  serial: getSerial().toString(),
};
var getAjax = function(options){
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType;
      if(res.networkType == 'none'){
        showModal("网络已断开，请联网后重试!",function(){
          if(options.complete){
            options.complete();
          }
        });
      }else{
        if (wx.showLoading) {
          wx.showLoading({
            title: '加载中',
          })
        }
        if (options.token) {
          var _header = {
            'content-type': 'application/json',
            'Cookie': 'JSESSIONID=' + options.token
          };
        } else {
          var _header = {
            'content-type': 'application/json'
          }
        }
        return wx.request({
          url: baseUrl + options.url,
          data: options.params,
          method: options.method ? options.method : 'GET',
          success: options.success,
          header: _header,
          fail: function (res) {
            if (options.fail) {
              options.fail(res)
            }
          },
          complete: function () {
            if (wx.hideLoading) {
              setTimeout(function () {
                wx.hideLoading()//关闭提示
              }, 400);
            }
            if (options.complete) {
              options.complete();
            }
          }
        });
      }
    },
    fail:function(res){
      console.log("获取网络状态失败：",res);
    }
  });  
}
var ajaxAsync = function (options) {
  if (wx.showLoading) {
    wx.showLoading({
      title: '加载中',
    })
  }
  getSession(function (sid) {
    var parms = Object.assign(basicParms, options.parms);
    console.log("请求参数：" + JSON.stringify(options.parms));
    console.log(options.parms)
    return wx.request({
      url: baseUrl + options.url,
      data: parms,
      method: options.method,
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + sid
      }, // 设置请求的 header
      success: options.success,
      fail: function () {
        // fail
      },
      complete: function () {
        if (wx.hideLoading) {
          wx.hideLoading()//关闭提示
        }
      }
    })
  });
}
var layer = {
  layerAnimation: function (that, obj, callback) {
    that.setData({
      showLayer: false
    });
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in",
    }), animateCopy = that.data.prompt;
    that.animation = animation;
    animation.opacity(1).scale(1).step();
    animateCopy.animationData = animation.export();
    for (var key in obj) {
      if (obj.hasOwnProperty(key) === true) {
        animateCopy[key] = obj[key];
      }
    }
    that.setData({
      prompt: animateCopy
    });

  },
  layerClose: function (that) {
    that.setData({
      showLayer: true
    });
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear'
    }), animateCopy = that.data.prompt;
    animation.opacity(0).scale(0.5).step();
    animateCopy.animationData = animation.export();
    that.setData({
      prompt: animateCopy
    })
  }
};

var checkOut = function (that, desc, rcd) {
  if (rcd == '40101') {
    wx.clearStorageSync();
    wx.showModal({
      title: '提示',
      content: '登录超时,请重新登录',
      showCancel: false,
      success: function (res) {
        wx.navigateTo({
          url: '../index/index',
        });
      }
    });
  } else {
    var obj = {};
    obj.desc = desc;
    layer.layerAnimation(that, obj);
  }
}
var formatMoney = function (money, num) {
  if (money) {
    num = num > 0 && num <= 20 ? num : 2;
    money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(num) + "";
    var l = money.split(".")[0].split("").reverse(),
      r = money.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
      t += l[i];
    }
    return t.split("").reverse().join("") + "." + r;
  } else {
    return '';
  }
}

var payOrderInf = function (that, orderno) {
  var parms = {
    action: "wxCrtOrder",
    orderNo: orderno,
    ptp: "3",
    dataFormat: "json"
  };
  ajaxAsync({
    parms: { parms },
    success: function (res) {
      console.log('立即支付返回：' + res.data)
      if (res.data.rcd == '0000') {
        getWeinxinPay(res.data, orderno);
      } else {
        checkOut(that, res.data.rDesc, res.data.rcd);
      }
    }
  })
}

var getWeinxinPay = function (data, orderno) {
  console.log('开始发起微信支付接口')
  wx.requestPayment({
    timeStamp: data.timeStamp,
    nonceStr: data.nonceStr,
    package: data.package,
    signType: 'MD5',
    paySign: data.paySign,
    success: function (res) {
      console.log('微信支付返回：' + res.data)
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        if (data.userSign == 'N') {
          wx.navigateTo({
            url: '../package_orderList/package_orderList?type=2',
          });
        } else {
          wx.navigateTo({
            url: '../package_orderList/package_orderList?type=1',//带查询框
          });
        }
      } else {
        wx.navigateTo({
          url: '../package_orderList/package_orderList?orderNo=' + orderno,
        });
      }
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

var showModal = function (cont,fn) {
  //显示弹窗,cont为显示的内容 ,无取消按钮，fn不点击确定时执行的函数，有则执行
  wx.showModal({
    title: '提示',
    content: cont,
    showCancel: false,
    success:function(res){
      if(res.confirm){
        if(fn){
          fn();
        }
      }
    }
  });
}

module.exports = {
  baseUrl: baseUrl,
  ajaxAsync: ajaxAsync,
  checkOut: checkOut,
  formatMoney: formatMoney,
  payOrderInf: payOrderInf,
  getWeinxinPay: getWeinxinPay,
  layer: layer,
  clearSession: clearSession, 
  getAjax: getAjax,
  showModal: showModal
} 