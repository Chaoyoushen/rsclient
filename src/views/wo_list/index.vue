<template>
  <div>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-form :inline="true" :model="condition" style="margin-top: 12px">
          <el-form-item label="联系人" style="text-align: center">
            <el-input v-model="condition.person" placeholder="联系人" />
          </el-form-item>
          <el-form-item label="工单状态">
            <el-select v-model="condition.sts" placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="网点">
            <el-select v-model="condition.org" placeholder="请选择" filterable>
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
      <el-main>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 90%; margin-left: 5%"
        >
          <el-table-column
            prop="person"
            label="联系人"
            width="180"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="description"
            label="故障描述"
            header-align="center"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sts"
            label="工单状态"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="createdDate"
            label="日期"
            width="180"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="worker"
            label="工程师"
            width="180"
            header-align="center"
            align="center"
          />
          <el-table-column label="操作" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleDetailInfo(scope)"
              >详情</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleOfferOrder(scope)"
              >派单</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleCloseOrder(scope)"
              >关单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog
      title="工单详情"
      :visible.sync="detailVisible"
      width="60%"
      center
    >
      <span>
        <el-form :model="detailForm" label-width="80px">
          <el-form-item label="联系人">
            <el-input v-model="detailForm.person" style="width: 150px" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="detailForm.phone" style="width: 250px" />
          </el-form-item>
          <el-form-item label="网点名称">
            <el-input v-model="detailForm.br" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="故障类型">
            <el-input v-model="detailForm.fault" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="设备类型">
            <el-input v-model="detailForm.machine" style="width: 350px" disabled />
          </el-form-item>
          <el-form-item label="故障描述">
            <el-input v-model="detailForm.desc" style="width: 80%" type="textarea" rows="5" disabled />
          </el-form-item>
          <el-form-item label="图片">
            <el-image
              v-for="item in url"
              :key="item"
              style="width: 100px; height: 100px; margin-right: 20px"
              :src="item"
              :preview-src-list="url"
              fit="contain"
            />
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { initWOList, getList, manageWO, getWOInfo } from '@/api/admin'
export default {
  name: 'WoList',
  data() {
    return {
      condition: {
        person: '',
        org: '',
        sts: ''
      },
      detailVisible: false,
      tableData: [],
      fullscreenLoading: false,
      types: [{ 'label': '未分派', 'value': '1' }, { 'label': '已分派', 'value': '2' }, { 'label': '已处理', 'value': '3' }, { 'label': '已关闭', 'value': '4' }],
      brs: [],
      loading: false,
      detailForm: {
        person: '',
        phone: '',
        fault: '',
        machine: '',
        desc: '',
        br: '',
        images: [],
        workers: []
      },
      url: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg', 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg']
    }
  },
  created: function() {
    initWOList().then(res => {
      console.log(res)
      this.brs = res.data.brs
    })
  },
  methods: {
    onSubmit() {
      this.loading = true
      const data = {
        org: this.condition.org,
        person: this.condition.person,
        sts: this.condition.sts
      }
      getList(data).then(res => {
        console.log(res)
        this.tableData = res.data
        this.loading = false
      })
    },
    handleOfferOrder(scope) {
      manageWO({ 'type': '1', 'orderId': scope.row.orderId }).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    handleCloseOrder(scope) {
      manageWO({ 'type': '2', 'orderId': scope.row.orderId }).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    handleDetailInfo(scope) {
      console.log(scope.row.orderId)
      getWOInfo(scope.row.orderId).then(res => {
        console.log(res)
        this.detailForm.person = res.data.person
        this.detailForm.fault = res.data.fault
        this.detailForm.machine = res.data.machine
        this.detailForm.phone = res.data.phone
        this.detailForm.desc = res.data.description
        this.detailForm.images = res.data.images.split(',')
        this.detailForm.br = res.data.br
        this.detailVisible = true
      })
    }
  }
}
</script>

<style>

</style>
