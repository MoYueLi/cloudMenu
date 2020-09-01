// pages/pbmenu/pbmenu.js
import {dbAdd, dbGet} from "../../utils/db";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    user: {},
    files: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeList()
  },

  async getTypeList() {
    let res = await dbGet('menuType');
    this.setData({
      typeList: res.data
    })
  },
  /**
   * 选择图片
   */
  selectImg(e) {
    let tempFilePaths = e.detail.tempFilePaths;
    let files = tempFilePaths.map(item => {
      return {
        url: item
      }
    })
    this.setData({
      files
    })
  },
  /**
   * 添加菜谱
   * @param e
   */
  async addRecipe(e) {
    wx.showLoading({
      title: '正在上传'
    })
    let fileIds = [];
    this.data.files.forEach(item => {
      let nowtime = new Date().getTime();
      let ext = item.url.split('.').pop();
      let promise = wx.cloud.uploadFile({
        cloudPath: nowtime + '.' + ext,
        filePath: item.url
      })
      fileIds.push(promise);
    })

    let res = await Promise.all(fileIds);

    // 处理图片路径
    let files = res.map(item => item.fileID)
    let {recipeName, recipeMake, recipeTypeid} = e.detail.value;
    let data = {
      menuName: recipeName,
      fileIds: files,
      desc: recipeMake,
      addtime: new Date().getTime(),
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      follows: 0,
      views: 0,
      typeId: recipeTypeid
    }
    let addRes = await dbAdd('menu',data);
    wx.hideLoading();
    wx.showToast({
      title:'上传成功',
      success(res) {
        wx.switchTab({url:'/pages/personal/personal'})
      }
    })
  }

})
