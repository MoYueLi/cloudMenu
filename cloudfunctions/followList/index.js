// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {page,pageSize} = event;
  return db.collection('menuFollow').aggregate().lookup({
      from: 'menu',
      localField: 'menuId',
      foreignField: '_id',
      as: 'menuList',
    }).match(event.openid).skip(page).limit(pageSize)
    .end();
    // .then(res => res)
    // .catch(err => console.error(err))
}
