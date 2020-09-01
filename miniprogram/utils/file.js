async function delFile(files) {
  return await wx.cloud.deleteFile(files)
}

export {delFile}
