// index.js
// 获取应用实例
// 0 引入 用来发送请求的方法 一定要把路径补全
import {request} from "../../request/index"; 
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航 数组
    catesList:[],
    //楼层数组
    floorList:[]
  },
  onLoad: function (options){

    // 1 发送异步请求获取轮播图数据
//     wx.request({
//       url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
//       success:(result)=>{
//         this.setData({
//           swiperList:result.data.message
//         })
// //         console.log(result); 

//         }
//     });
this.getSwiperList();
this.getCateList();
this.getFloorList();
},
// 获取轮播图数据
getSwiperList(){
  request({url:"/home/swiperdata"})
.then(result=> {
  
  this.setData({
    swiperList:result.data.message
  })
})
},
// 获取 分类导航数组
getCateList(){
  request({url:"/home/catitems"})
.then(result=> {
  this.setData({
    catesList:result.data.message
  })
})
},
// 获取 楼层数组
getFloorList(){
  request({url:"/home/floordata"})
.then(result=> {
  
  this.setData({
    floorList:result.data.message
  }) 
})
},
  onReady:function(){

  },
  onShow:function(){

  },
  onHide:function(){

  },
  onUnload:function(){

  },
  onPullDownRefresh:function(){

  },
  onReachBottom:function(){

  },
  onShareAppMessage:function(){

  },
  onPageScroll:function(){

  },
  // item(index,pagepath,text)
  onTabItemTap:function(item){
    
  }
})
