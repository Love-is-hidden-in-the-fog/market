/*
1 获取用户的收货地址
  1 绑定点击事件 
  2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
2 获取 用户 对小程序 所授予 获取地址的权限状态 scope
   1 假设 用户点击获取收货地址的提示框 确定
      scope值 true 直接调用 获取收货地址
   2 假设 用户 从来没有调用过收货地址的api
      scope undefined 直接调用 获取收获地址 
   3 假设用户 点击 获取收货地址的提示框 取消 
      scope值 flase
      1 诱导用户 自己打开 授权设置·页面(wx.openSetting) 当用户重新给予获取 地址权限的时候 
      2 获取收货地址
   4 把获取到的收货地址存入到本子存储中
2 页面加载完毕 
  0 onLoad onShow
  1 获取本地存储中的地址数据
  2 把数据设置给data中的一个变量
3 onShow 
   0 回到了商品详情页面第一次添加商品的时候 手动添加商品
     1 num=1 
     2 checked=true
   1 获取缓存中的购物车数组
   2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onshow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选则被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中1
  5 总价格+=商品的单价 * 商品的数量
  6 总数量 +=商品的数量
  7 把计算后的价格和数量设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态
  4 重现填充回data中和缓存中
  5 重现计算全选 总价格 总数量
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面商品 选中状态跟随 allChecked 改变而改变
  5 把购物车数组 和allChecked 重新设置回data 把购物车重新设置回缓存中
8 商品的数量的编辑
  1 “+” “-” 按钮 绑定同一个点击事件 区分的关键 自定义属性
  1 “+” “-”
  2 “-” “-1”
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 直接修改商品对象的数量 num
  当购物车数量=1 同时数量点击 “-” 弹窗提示 询问用户 是否删除
  1 确定 直接执行删除
  2 取消  什么都不做
  5 把cart数组 重新设置回缓存中 和data中 this.setCart ;                                                                                                                                                                                        
9 点击结算
 1 判断有没有收到收货地址信息
 2 判单用户有没有选购商品
 3 经过以上的验证 跳转到支付页面
*/
import { getSetting,chooseAddress,openSetting,showModal,showToast  } from"../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 1 获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    // 1 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')|| [];
    this.setData({address});
    this.setCart(cart); 

  },
      // 点击收货地址 
  async handleChooseAddress(){
    try{
    // 1 获取 权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 2 判断权限状态
    if(scopeAddress ===false){
      await openSetting();
    }
     
      // 4 调用获取收货地址的api 
      const address =await chooseAddress();
 
      // 5 存入到缓存中
      wx.setStorageSync('address', address);
    }
    catch(error){
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e){
    // 1 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {cart}=this.data;
    // 3 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id);
    // 4 选中状态取反
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);

  },
  // 设置购物车状态的同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){


    let allChecked=true;
    // 1  总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num * v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
      // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart', cart);
  },
  //商品全选功能
  handleItemAllCheck(){
    // 1 获取data中的数据
    let {cart,allChecked}=this.data;
    // 2 修改值
    allChecked=!allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量编辑
 async handleItemNumEdit(e){
    // 1 获取传递过来的参数
    const{operation,id}=e.currentTarget.dataset;
    // 2 获取购物车数组
    let{cart}=this.data;
    // 3 找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    // 判断是否要执行删除 
    if(cart[index].num===1&&operation===-1){
      // 4.1 弹窗提示
      const res=await showModal({content:"是否删除"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
    // 4 进行修改数量
    cart[index].num+=operation;
    // 5 设置回缓存和data中
    this.setCart(cart);
    }
  },
  async handlePay(){
    // 1 判断收货地址
    const{address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选中商品
    if(totalNum===0){
      await showToast({title:"您未选中商品"});
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
  })