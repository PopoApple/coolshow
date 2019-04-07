const listConfig = require('config')
var getListData = function (item) {
  var pages = item.pages
  var data = []
  for (var i = 0; i < pages.length; i++) {
    var name = pages[i]
    data.push({
      id: name,
      content: name,
      url: item.id + '/' + name + '/index'
    })
  }
  return data
}
const list = listConfig.map(d => {
  return {
    ...d,
    pages: getListData(d),
  }
})
Page({
  data: {
    list,
  },
});
