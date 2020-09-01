// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let {_collection, _data} = event;
  return await db.collection(_collection).where(_data).remove();
}
