import {dbGet} from "../../utils/db";
import {search} from "../../utils/search";

Page({
  data: {
    menuList: [],
    page: 0,
    pageSize: 10,
    searchText: '',
    navs: [{
      name: '菜谱分类',
      img: '/static/index/fenlei.png',
      id: ''
    }, {
      name: '营养菜谱',
      img: '/static/index/yangsheng.png',
      id: '60173c665f4623c40055915d7ea02be8'
    }, {
      name: '儿童菜谱',
      img: '/static/index/ertong.png',
      id: 'b5416b755f4623cd007018a57f9cf25f'
    }, {
      name: '家常菜谱',
      img: '/static/index/tuijian.png',
      id: '7498b5fe5f4623d80062182068044e45'
    }]
  },
  onShow() {
    this.getMenuList(0, 10);
  },
  async getMenuList(page, pageSize) {
    let res = await dbGet('menu', {}, page, pageSize);
    this.setData({
      menuList: this.data.menuList.concat(res.data)
    })
  },
  toDetail(e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({url: `/pages/recipeDetail/recipeDetail?id=${id}&title=${title}`})
  },
  onReachBottom() {
    return
    this.data.page += 1;
    let pageSize = this.data.pageSize;
    this.getMenuList(this.data.page, pageSize)
  },
  /**
   * 搜索菜谱
   */
  searchMenu() {
    // 存储近期搜索数据
    let keycode = this.data.searchText;
    search(keycode)
  },
  /**
   * 导航点击事件
   * @param e
   */
  navTap(e) {
    let {id, title} = e.currentTarget.dataset;
    if (id) {
      wx.navigateTo({url: `/pages/recipelist/recipelist?id=${id}&title=${title}`})
    } else {
      wx.navigateTo({url: `/pages/typelist/typelist`})
    }
  },
  onHide() {
    this.setData({
      menuList: [],
      page: 0,
      pageSize: 10,
      searchText: '',
    })
  }
})
