// pages/recipelist/recipelist.js
import {dbGet} from "../../utils/db";

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    searchType: false,
    idType: false,
    id: '',
    search: '',
    page: 0,
    pageSize: 10,
    isBottom: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.search) {
      this.getList(options.search, 0, 10)
      this.data.searchType = true;
      this.data.search = options.search;
    }
    if (options.id) {
      this.getListById(options.id, 0, 10)
      this.data.idType = true;
      this.data.id = options.id
    }
    if (options.title) {
      // 设置微信小程序标题
      wx.setNavigationBarTitle({title: options.title})
    }
  },
  /**
   * 通过模糊搜索菜谱
   * @param opt 模糊字
   * @param page 第几页
   * @param pageSize 每一页多少
   * @returns {Promise<void>}
   */
  async getList(opt, page, pageSize) {
    let res = await dbGet('menu', {menuName: db.RegExp({regexp: opt, options: 'i',})}, page, pageSize)
    let isBottom = false
    if (!res.data.length || res.data.length < pageSize)
      isBottom = true
    this.setData({
      list: this.data.list.concat(res.data),
      isBottom
    })
  },
  /**
   * 通过typeid搜索菜谱
   * @param id typeID
   * @param page 第几页
   * @param pageSize 每页多少
   * @returns {Promise<void>}
   */
  async getListById(id, page, pageSize) {
    let res = await dbGet('menu', {typeId: id}, page, pageSize);
    let isBottom = false
    if (!res.data.length || res.data.length < pageSize)
      isBottom = true
    this.setData({
      list: this.data.list.concat(res.data),
      isBottom
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onHide() {
    this.setData({
      list: [],
      searchType: false,
      idType: false,
      page: 0,
      pageSize: 10,
      isBottom: false
    })
  },
  onReachBottom() {
    this.data.page += 1;
    let pageSize = this.data.pageSize;
    if (this.data.idType) {
      this.getListById(this.data.id, this.data.page, pageSize)
    } else if (this.data.searchType) {
      this.getList(this.data.search, this.data.page, pageSize)
    }
  }

})
