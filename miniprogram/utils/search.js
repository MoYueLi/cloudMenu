function search(keycode) {
  let arr = wx.getStorageSync('keycode') || [];
  let index = arr.findIndex(item => item === keycode)
  if (index !== -1) {
    arr.splice(index, 1)
  }
  arr.unshift(keycode)
  wx.setStorageSync('keycode', arr)
  wx.navigateTo({url: `/pages/recipelist/recipelist?search=${keycode}`})
}

export {search}
