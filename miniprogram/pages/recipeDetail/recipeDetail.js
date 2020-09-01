// pages/recipeDetail/recipeDetail.js
import {dbAdd, dbDel, dbGet, dbUpdate} from "../../utils/db";

const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    isFollow: false,
    menuId: '',
    followId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.menuId = options.id
    wx.setNavigationBarTitle({title: options.title})
    this.getMenuInfo(options.id, true)
    this.getFollow();
    // this.addViews();
  },
  /**
   * 获取菜谱详情
   */
  async getMenuInfo(id, isShow = false) {
    let res = await dbGet('menu', {_id: id})
    if (isShow) {
      dbUpdate('menu', id, {views: db.command.inc(1)})
    }
    this.setData({
      info: res.data[0]
    })
  },
  /**
   * 增加浏览数
   */
  addViews() {

  },
  /**
   * 添加关注
   * @returns {Promise<void>}
   */
  async follow() {
    // 先添加关注
    await dbAdd('menuFollow', {menuId: this.data.info._id, addtime: new Date().getTime()})
    // 获取关注的列表
    this.getFollow();
    // this.data.info.follows += 1;
    await dbUpdate('menu', this.data.info._id, {follows: db.command.inc(1)})
    // this.getMenuInfo(this.data.info._id)
    this.data.info.follows += 1
    wx.showToast({
      title: '关注成功！',
    })
    this.setData({
      info: this.data.info
    })
  },
  /**
   * 获取用户的关注列表
   * @returns {Promise<void>}
   */
  async getFollow() {
    // 获取该用户的关注列表
    let res = await dbGet('menuFollow', {_openid: app.globalData.openid, menuId: this.data.menuId});
    if (res.data.length)
      this.data.followId = res.data[0]._id
    this.setData({
      isFollow: res.data.length > 0
    })
  },
  /**
   * 取消关注
   */
  async delFollow() {
    await dbDel('menuFollow', this.data.followId);
    this.getFollow();
    await dbUpdate('menu', this.data.info._id, {follows: db.command.inc(-1)});
    // this.getMenuInfo(this.data.info._id)
    this.data.info.follows -= 1
    wx.showToast({
      title: '取消关注！',
    })
    this.setData({
      info: this.data.info
    })
  },
  share() {
    wx.showToast({
      title: '暂无此功能',
      icon:'none'
    })
  },
  onShareAppMessage(){

  }
})
