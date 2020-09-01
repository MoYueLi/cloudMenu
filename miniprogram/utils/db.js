const db = wx.cloud.database();

/**
 * 数据库添加操作
 * @param _collection 操作的库名
 * @param _data 添加的数据
 * @returns {Promise<void>}
 */
async function dbAdd(_collection, _data) {
  let res = await db.collection(_collection).add({data: _data});
  return res;
}

/**
 * 数据库删除操作
 * @param _collection 库名
 * @param _id 删除的id
 * @returns {Promise<void>}
 */
async function dbDel(_collection, _id) {
  let res = await db.collection(_collection).doc(_id).remove();
  return res;
}

/**
 * 数据库查找操作
 * @param _collection 库名
 * @param _data 查找条件
 * @param page 第几页
 * @param pageSize 每页多少
 * @returns {Promise<void>}
 */
async function dbGet(_collection, _data = {}, page = 0, pageSize = 10) {
  let res = db.collection(_collection).where(_data).skip(page * pageSize).limit(pageSize).get();
  return res;
}

/**
 * 数据库修改操作
 * @param _collection 库名
 * @param _id 修改的id
 * @param _data 修改的数据
 * @returns {Promise<void>}
 */
async function dbUpdate(_collection, _id, _data) {
  let res = await db.collection(_collection).doc(_id).update({data: _data});
  return res;
}

/**
 * 数据库批量删除操作
 * @param _collection 库名
 * @param _data 删除条件
 * @returns {Promise<void>}
 */
async function dbDelAll(_collection, _data) {
  return await wx.cloud.callFunction({
    name: 'del',
    data: {
      _collection,
      _data
    }
  })
}


export {dbAdd, dbDel, dbGet, dbUpdate,dbDelAll};
