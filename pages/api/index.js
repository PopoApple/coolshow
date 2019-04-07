const listConfig = require('config')
var getListData = function (item) {
  var pages = item.pages
  var data = []
  for (var i = 0; i < pages.length; i++) {
    var page = pages[i]
    var name = page.name
    var id = page.id
    data.push({
      id: id,
      content: name,
      url: item.id + '/' + id + '/index'
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
