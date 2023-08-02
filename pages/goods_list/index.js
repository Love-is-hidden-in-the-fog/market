/*
1 用户上滑页面 滚动条触底 开始加载下一页数据
   1 找到滚动条触底事件 微信小程序官方文档寻找
   2 判断还有没有下一页数据
     1 获取到总页数 
        总页数 = Math.ceil(总条数 / 页容量 pagesize)
        总页数 = Math.ceil( 23/ 10)=3
     2 获取到当前页码 pagenum
     3 判断一下当前的页码是否大于等于 总页数 
        表示 没有下一页数据 
   3 假如没有下一页数据 弹出提示
   4 加入还有下一页数据 用来加载下一页数据
     1 当前的页码++
     2 重新发送请求
     3 数据请求回来 要对data中的数组 进行 拼接 而不是全部替换！！！！
2 下拉刷新页面
   1 出发下拉刷新事件 需要在页面的json文件中开启一个配置项
      找到触发下拉刷新的事件
   2 重置 数据 数组
   3 重置页码 设置为1 
   4 发送请求
   5 关闭下拉刷新窗口
*/
import { request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"商品",
        isActive:true
      },

    ],
    goodsList:[]

  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  }, 
// 总页数
totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },
  //获取商品列表数据
    async  getGoodsList(){
    const data=await request({url:"/goods/search",data:this.QueryParams});
    const message=data.data
    const res=message.message
    //获取总条数
    const total=res.total;
    // 计算总页数 
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })

    // 关闭下拉刷新窗口 如果没有调用下拉刷新窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },
  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let{tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 页面上滑 滚动条触底事件
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据',
      });
    }
    else{
      //还有下一页
      // console.log("还有下一页");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
    
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
    // console.log("刷新");  
    // 1 重置数组
    this.setData({ 
      goodsList:[]
    })
    // 2 重置页码
    this.QueryParams.pagenum=1;
    // 3 发送请求
    this.getGoodsList();
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})