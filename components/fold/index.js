Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    list: {
      type: Array,
      value: [],
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    kindToggle: function (e) {
      var id = e.currentTarget.id, list = this.data.list
      for (var i = 0, len = list.length; i < len; ++i) {
        if (list[i].id == id) {
          list[i].open = !list[i].open
        } else {
          list[i].open = false
        }
      }
      this.setData({
        list: list
      })
    }
  }
})