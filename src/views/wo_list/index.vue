<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-form :inline="true" :model="condition" style="margin-top: 12px">
        <el-form-item label="联系人" style="text-align: center">
          <el-input v-model="condition.user" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="condition.region" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="网点">
          <el-select v-model="condition.org" placeholder="请选择">
            <el-option
              v-for="item in brs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main />
  </el-container>
</template>

<script>
export default {
  name: 'WoList',
  data() {
    return {
      condition: {
        person: '',
        org: '',
        sts: ''
      },
      fullscreenLoading: false,
      types: [{ 'label': '未审批', 'value': '1' }, { 'label': '已分派', 'value': '2' }, { 'label': '已处理', 'value': '3' }, { 'label': '已关闭', 'value': '4' }],
      brs: []
    }
  },
  created: function() {
    this.fullscreenLoading = true
    this.$store.dispatch('admin/getList').then(res => {
      this.brs = res.data.brs
      this.fullscreenLoading = false
    }).catch(() => {
      this.$message.error('未知错误')
    })
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style>

</style>
