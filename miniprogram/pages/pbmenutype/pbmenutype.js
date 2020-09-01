// pages/pbmenutype/pbmenutype.js
import { dbAdd, dbDel, dbGet, dbUpdate } from '../../utils/db';

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUpdate: false,
    isAdd: false,
    menuTypeName: '',
    list: [],
    updateId: '',
    dialogBtns: [{ text: '取消' }, { text: '确定' }],
    isDel: false,
    delId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    });
    this.getList();
  },
  /**
   * 修改或者添加页面
   * @param e
   */
  changeType (e) {
    if (e.currentTarget.dataset.type === 'update')
      this.setData({
        isUpdate: true,
        isAdd: false,
        updateId: e.currentTarget.dataset.id,
        menuTypeName: e.currentTarget.dataset.typename
      });
    else
      this.setData({
        isUpdate: false,
        isAdd: true
      });
  },
  /**
   * 添加按钮
   */
  add (e) {
    let typeName = this.data.menuTypeName;
    this.addType({typeName})
  },
  async addType (data) {
    let res = await dbAdd('menuType',data);
    this.setData({
      menuTypeName: '',
      isAdd: false,
    })
    //添加完后获取列表
    this.getList();
  },
  /**
   * 修改菜谱分类
   * @param e
   */
  async updateType (e) {
    // let id = e.currentTarget.dataset.id;
    let res = await dbUpdate('menuType',this.data.updateId,{typeName: this.data.menuTypeName})
    this.setData({
      menuTypeName: ''
    });
    this.getList();
  },
  showDialog (e) {
    this.setData({
      isDel: true,
      delId: e.currentTarget.dataset.id
    });
  },
  /**
   * 删除
   */
  delType (e) {
    let { index } = e.detail;
    if (index) {
      this.del();
    } else {
      this.setData({
        isDel: false
      });
    }
  },
  async del () {
    let res = await dbDel('menuType', this.data.delId);
    this.setData({
      isDel: false
    });
    this.getList();
  },
  async getList () {
    let res = await dbGet('menuType');
    wx.hideLoading();
    this.setData({
      list: res.data
    });
  }
});
