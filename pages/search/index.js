/*
1 输入框绑定 值改变事件 inp事件
   1 获取到输入框的值 
   2 合法性判断
   3 检验通过 把输入框的值 发送到后台
   4 返回的数据打印到页面
*/
import { request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goods:[],
    //取消按钮  是否显示
   isFocus:false,
   // 输入框的值
   inpValue:""
  },  
  TimeId:-1,
  // 输入框的值改变 就会触发事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail;
    // 2 检测合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      // 值不合法
      return;
    }   
      //准备发送请求获取数据
      this.setData({
        isFocus:true
      })
    // 3 准备发送请求获取数据
    clearTimeout(this.TimeId);
      this.TimeId = setTimeout(()=>{
        this.qsearch(value);
      },1000);
  },
  // 发送请求获取搜索建议
  async qsearch(query){
    const data=await request({url:"/goods/search",data:{query}});
    const message=data.data
    const goods=message.message
    const res=goods.goods
    console.log(res);
    this.setData({
      goods:res,  
    })
  },
  //点击取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
  })