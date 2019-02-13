Component({
  properties: {
    itemData: Object,
    collapse: Boolean
  },
  date:{

  },
  created() {
  },
  methods: {
    jump(e){
      var id = e.currentTarget.dataset.id
      var title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '../../pages/typeList/typeList?ranking_id=' + id + '&ranking_title=' + title
      })      
    }
  },
})