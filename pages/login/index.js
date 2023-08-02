// pages/login/index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    username:""
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    console.log(e.detail)
    this.setData({
      avatarUrl,
    })
  },
  choosename(e){
    this.setData({
      username:e.detail.value
    })
  },
  Login(){
    console.log(this.data.avatarUrl==defaultAvatarUrl,this.data.username)
    if(this.data.avatarUrl!==defaultAvatarUrl&&this.data.username){
        wx.setStorageSync('userinfo', {
          avatarUrl:this.data.avatarUrl,
          nickName:this.data.username
        })
        wx.navigateBack({
          delta: 1
        })
    }else{
      wx.showToast({
        title: '请填写完整信息',
      })
    }
  }
})