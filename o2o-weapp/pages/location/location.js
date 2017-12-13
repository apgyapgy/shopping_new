// pages/location/location.js
var app = getApp();
import common from '../../js/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop:0,
    backTopIconShowFlag:false,
    location:{
      latitude:'',
      longitude:''
    },
    locationListOrigin:[],
    locationList:[],
    currentHostId:'',
    search:'',  //搜索的关键字
    hasNearByAreaFlag:true,   //是否有附近小区，true有，false无
    globalDataLocation:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation();
    this.setData({
      globalDataLocation:app.globalData.location
    });
  },
  onUnload:function(){
    if(this.data.currentHostId){
      app.globalData.selectedHostId = this.data.currentHostId
    }
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
  goTop:function(){
    this.setData({
      scrollTop: 0
    });
  },
  getLocation:function(){
    var _this = this;
    if (wx.showLoading) {
      wx.showLoading({
        title: '加载中',
      });
    }
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log("定位:",res);
        var _loca = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        _this.setData({
          location:_loca
        });
        _this.getNearByArea();
      },
      fail: function (res) {
        console.log("定位失败:",res);
      }
    });
  },
  getNearByArea:function(){
    var _this = this;
    common.getAjax({
      url: 'wx_we/hostNearBy',
      token: app.globalData.token,
      params:{
        bmapLng: _this.data.location.longitude,
        bmapLat: _this.data.location.latitude
        //bmapLng: 121.54623, //508
        //bmapLat: 31.226477
        //bmapLng: 121.512744 , //博爱家园
        //bmapLat: 31.186794
        //bmapLng: 121.517789, //齐河三小区 
        //bmapLat: 31.181602
        //bmapLng: 121.52196, //新昌里公寓
        //bmapLat: 31.189364
        //bmapLng: 121.518692, //都市庭院
        //bmapLat: 31.190773

      },
      success: function (res) {
        console.log("附近小区:", res);
        if (res.data.code == 200) {
          if (_this.data.globalDataLocation && JSON.stringify(_this.data.globalDataLocation) != '{}' && _this.data.globalDataLocation.hostId) {
            _this.setData({
              currentHostId: _this.data.globalDataLocation.hostId,
              locationList: res.data.data.locations,
              locationListOrigin: res.data.data.locations
            });
          }else{
            _this.setData({
              locationList: res.data.data.locations,
              locationListOrigin: res.data.data.locations
            });
          }
          _this.checkNearByEmpty();
        } else if (res.data.code == 40101) {
          app.getToken(_this, function () {
            _this.getNearByArea();
          });
        } else {
          common.showModal(res.data.desc);
        }
      }
    });
  },
  checkNearByEmpty:function(){//判断附近小区列表是否为空
    if(this.data.locationList.length){ //不为空
      if (this.data.hasNearByAreaFlag == false){
        this.setData({
          hasNearByAreaFlag:true
        });
      }
    } else {
      if (this.data.hasNearByAreaFlag == true) {
        this.setData({
          hasNearByAreaFlag: false
        });
      }
    }
  },
  selectArea:function(e){
    //选择小区
    var _hostId = e.currentTarget.dataset.hostid;
    this.setData({
      currentHostId:_hostId
    });
  },
  setSearchValue:function(e){//根据input框中内容设置搜索关键字
    this.setData({
      search:e.detail.value
    });
  },
  search:function(){//点击搜索按钮
    if(this.data.search == ''){
      this.setData({
        locationList: this.data.locationListOrigin
      });
    }else{
      var _list = [];
      for(var key in this.data.locationListOrigin){
        if (this.data.locationListOrigin[key].areaNm.indexOf(this.data.search) != -1){
          _list.push(this.data.locationListOrigin[key]);
        }
      }
      this.setData({
        locationList:_list
      });
    }
    this.checkNearByEmpty();
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitleText,
      path: '/pages/front/front',
      imageUrl: app.globalData.shareImgUrl
    }
  }
})