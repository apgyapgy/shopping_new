//获取应用实例
const app = getApp()
import common from "../../js/common.js";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mobile:'',
    yzm:'',
    cutdownTime:0,
    timer:null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      //console.log('用户信息：' + JSON.stringify(app.globalData.userInfo));
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getOpenId: function () {
    wx.request({
      url: 'wx_we/openid', //仅为示例，并非真实的接口地址
      data: {
        code: '',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  sure:function(){//点击确认按钮
    var _mobile = this.data.mobile.trim();
    var _code = this.data.yzm.trim();
    if(!_mobile){
      wx.showModal({
        title: '提示',
        content: '请输入收件宝帐号或手机号',
        showCancel: false
      });
      return;
    }else if(!_code){
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false
      });
      return;
    }
    if(/\d{6}/.test(_code)){
      var _this = this;
      wx.login({
        success: res => {
          console.log(res);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            this.loginBind(res.code);
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
      /*wx.checkSession({
        success: function () {
          console.log("checksession success");
          //session 未过期，并且在本生命周期一直有效
          _this.loginBind();
        },
        fail: function () {
          //登录态过期
          console.log("checksession fail");
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (res.code) {
                this.globalData.code = res.code;
                _this.loginBind();
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          });
        }
      });*/
    }else{
      wx.showModal({
        title: '提示',
        content: '验证码为6位数字',
        showCancel: false
      });
    }
  },
  sendYzm:function(e){//发送验证码
    var _mobile = this.data.mobile.trim();
    if (!_mobile){
      return;
    }
    var _this = this;
    if (/^1[34578]\d{9}$/.test(_mobile)){
      common.getAjax({
        url:'wx_we/api/oauth/sms',
        params:{
          mobile: _mobile
        },
        success:function(re){
          console.log("send mobile success:",re);
          if (re.data.code == 200) {
            _this.setData({
              cutdownTime: 61
            });
            _this.cutdown();
          }else{
            wx.showModal({
              title: '提示',
              content: re.data.desc,
              showCancel: false
            });
          }
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel:false
      });
    }
  },
  setmobile:function(e){//保存手机号
    this.setData({
      mobile: e.detail.value
    });
  },
  enterCode: function (e) {//保存验证码
    this.setData({
      yzm:e.detail.value
    });
  }, 
  cutdown:function(){//倒计时
    var _this = this;
    _this.setData({
      timer:null
    });
    function down() {
      clearTimeout(_this.data.timer);
      _this.setData({
        cutdownTime: _this.data.cutdownTime-1
      });
      if (_this.data.cutdownTime > 0) {
        _this.setData({
          timer: setTimeout(function () {
            down();
          }, 1000)
        });
      } else {
        _this.setData({
          cutdownTime:0
        });
      }
    }
    down();
  },
  loginBind:function(__code){//登录绑定
    var _mobile = this.data.mobile.trim();
    var _code = this.data.yzm.trim();
    common.getAjax({
      url: 'wx_we/api/oauth/bind',
      params: {
        mobile: _mobile,
        smsCode: _code,
        code: __code
      },
      success: function (re) {
        console.log("登录认证绑定success:", re);
        if (re.data.code == 200) {
          wx.redirectTo({
            url: '/pages/index/index',
          });
        } else {
          wx.showModal({
            title: '提示',
            content: re.data.desc,
            showCancel: false
          });
        }
      },
      fail: function (re) {
        console.log("登录认证绑定 fail:", re);
      }
    });
  }
});
