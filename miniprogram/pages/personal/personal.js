// pages/personal/personal.js
import {dbDel, dbDelAll, dbGet} from "../../utils/db";
import {delFile} from "../../utils/file";

const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    tabs: ['菜单', '分类', '关注'],
    tabIndex: 0,
    menuList: [],
    typeList: [],
    // 关注列表
    followList: [],
    // 触底也没有数据了
    isBottom: false,
    page: 0,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    }
  },
  async getMenuList(page, pageSize, isTab = false) {
    // if (this.data.hasUserInfo) {
    let res = await dbGet('menu', {_openid: app.globalData.openid}, page, pageSize);
    // if (res.data.length !== this.data.menuList.length)
    if (res.data.length < this.data.pageSize) {
      this.data.isBottom = true
    }
    if (isTab) {
      this.setData({
        menuList: res.data
      })
    } else {
      this.setData({
        menuList: this.data.menuList.concat(res.data)
      })
    }

    // }
  },
  async getTypeList() {
    if (this.data.hasUserInfo) {
      let res = await dbGet('menu', {_openid: app.globalData.openid});
      let arr = res.data.map(item => {
        return item.typeId
      })
      let set = new Set(arr)
      arr = Array.from(set)
      let typeRes = await dbGet('menuType', {_id: db.command.in(arr)})
      this.setData({
        typeList: typeRes.data
      })
    }
  },
  onShow() {
    this.showInfo(this.data.tabIndex, 0, 10);
  },
  /**
   * 登录
   * @param e
   */
  getLogin(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  /**
   * 选项卡点击事件
   */
  tabTap(e) {
    let index = e.currentTarget.dataset.index;
    this.showInfo(index);
    this.setData({
      tabIndex: index
    })
  },
  /**
   * 获取页面信息
   * @param index 当前tab索引
   * @param page 第几页
   * @param pageSize 每页多少
   */
  showInfo(index, page, pageSize) {
    switch (index) {
      case 0:
        this.getMenuList(page, pageSize, true);
        break;
      case 1:
        this.getTypeList(page, pageSize);
        break;
      case 2:
        this.getFollow(page, pageSize);
        break;
    }
  },
  async getFollow(page, pageSize) {
    let res = await wx.cloud.callFunction({
      name: 'followList',
      data: {openid: {_openid: app.globalData.openid}, page, pageSize}
    })
    this.setData({
      followList: this.data.followList.concat(res.result.list)
    })
  },
  /**
   * 跳到菜谱管理页面
   */
  toRecipe() {
    wx.navigateTo({url: '/pages/pbmenu/pbmenu'})
  },
  /**
   * 跳到分类管理页面
   */
  toMenuType() {
    if (app.globalData.openid === 'oFOJL5Aq5rAj5dA5wn4W6GmPMzCY')
      wx.navigateTo({url: '/pages/pbmenutype/pbmenutype'})
  },
  async delMenu(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '删除菜单',
      content: '是否删除该菜单',
      success: async res => {
        if (res.confirm) {
          // this.delItem(id)
          let res = await dbDel('menu', id);
          // 删除关注列表里面的数据
          dbDelAll('menuFollow', {menuId: id})
          // 删除图片
          delFile(this.data.menuList[index].fileIds)
          wx.showToast({
            title: '删除成功'
          })
          this.getMenuList(0, 10, true);
        }
      }
    })
  },
  slideButtonTap(e) {
    let {id, title} = e.currentTarget.dataset;
    wx.navigateTo({url: `/pages/recipelist/recipelist?id=${id}&title=${title}`})
  },
  toDetail(e) {
    let {id, title} = e.currentTarget.dataset;
    wx.navigateTo({url: `/pages/recipeDetail/recipeDetail?id=${id}&title=${title}`})
  },
  onReachBottom() {
    if (this.data.isBottom) {
      return
    }
    this.data.page += 1;
    let pagesize = this.data.pageSize
    this.getMenuList(this.data.page, pagesize)
  },
  onUnload() {
    // 清空数组
    this.data.menuList = [];
    this.data.followList = [];
    this.data.typeList = [];
    this.data.page = 0;
    this.data.isBottom = false;
  }
});
