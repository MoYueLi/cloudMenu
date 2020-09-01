// pages/search/search.js
import {dbGet} from "../../utils/db";
import {search} from "../../utils/search";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 热门搜索
    hotList: [],
    search: '',
    // 近期搜索
    lateList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotList();
  },
  onHide() {
    this.setData({
      search:''
    })
    // this.data.search = ''
  },

  async getHotList() {
    let res = await dbGet('menu');
    let newlist = res.data.sort((a, b) => {
      return b.views - a.views
    })
    this.setData({
      hotList: newlist
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getHotList();
    let arr = wx.getStorageSync('keycode') || [];
    this.setData({
      lateList: arr
    })
  },
  /**
   * 热门搜索点击
   * @param e
   */
  hotTap(e) {
    let {id, title} = e.currentTarget.dataset;
    wx.navigateTo({url: `/pages/recipeDetail/recipeDetail?id=${id}&title=${title}`})
  },
  /**
   * 搜索菜谱
   */
  searchMenu(e) {
    let keycode = this.data.search || e.currentTarget.dataset.keycode;
    search(keycode);
  }
})
