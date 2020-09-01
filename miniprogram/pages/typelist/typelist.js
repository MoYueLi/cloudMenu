// pages/typelist/typelist.js
import {dbGet} from "../../utils/db";
import {search} from "../../utils/search";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeList();
  },
  async getTypeList() {
    let res = await dbGet('menuType', {}, 0, 99);
    this.setData({
      list: res.data
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onHide() {
    this.data.search = '';
  },
  searchMenu() {
    // 存储近期搜索数据
    let keycode = this.data.search;
    search(keycode)
  },
  cellTap(e) {
    let {id, title} = e.currentTarget.dataset;
    wx.navigateTo({url: `/pages/recipelist/recipelist?id=${id}&title=${title}`})
  }
})
