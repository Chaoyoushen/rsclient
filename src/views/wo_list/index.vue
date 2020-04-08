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
                @click="openOfferOrderDialog(scope)"
              >派单</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleOPInfo(scope)"
              >流程</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="openCloseOrderDialog(scope)"
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
          <el-form-item label="故障区域">
            <el-input v-model="detailForm.fault" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="故障类型">
            <el-input v-model="detailForm.faultType" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="设备类型">
            <el-input v-model="detailForm.machine" style="width: 350px" disabled />
          </el-form-item>
          <el-form-item label="故障描述">
            <el-input v-model="detailForm.desc" style="width: 80%" type="textarea" rows="5" disabled />
          </el-form-item>
          <div v-if="detailForm.images.length > 0">
            <el-form-item label="图片">
              <el-image
                v-for="item in detailForm.images"
                :key="item"
                style="width: 100px; height: 100px; margin-right: 20px"
                :src="item"
                :preview-src-list="detailForm.images"
                fit="contain"
              />
            </el-form-item>
          </div>
        </el-form>
      </span>
    </el-dialog>
    <el-dialog v-loading="offerOrderLoading" title="派单" :visible.sync="offerVisible" center>
      <el-form :model="offerForm">
        <el-form-item label="处理工程师" :label-width="formLabelWidth">
          <el-select v-model="offerForm.personId" placeholder="请选择处理人员" filterable>
            <el-option
              v-for="item in workers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作意见" :label-width="formLabelWidth">
          <el-input v-model="offerForm.operationInfo" style="width: 60%" type="textarea" rows="5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="offerVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOfferOrder">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-loading="closeOrderLoading" title="关单" :visible.sync="closeWOVisible" center>
      <el-form :model="closeForm">
        <el-form-item label="操作意见" :label-width="formLabelWidth">
          <el-input v-model="closeForm.operationInfo" style="width: 60%" type="textarea" rows="5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWOVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-loading="opLoading" title="流程跟踪" :visible.sync="opVisible" center>
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(op, index) in opList"
          :key="index"
          :timestamp="timestampToTime(op.time)"
          placement="top"
        >
          <el-card>
            <h4>{{ '操作意见:' + op.operationInfo }}</h4>
            <p>{{ '操作人:' + op.person }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOPDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initWOList, getList, manageWO, getWOInfo, queryOPList } from '@/api/admin'
export default {
  name: 'WoList',
  data() {
    return {
      condition: {
        person: '',
        org: '',
        sts: ''
      },
      offerForm: {
        personId: '',
        operationInfo: '',
        orderId: '',
        type: '1'
      },
      closeForm: {
        operationInfo: '',
        type: '2',
        orderId: ''
      },
      opForm: {
        operationInfo: '',
        type: '3',
        orderId: ''
      },
      detailVisible: false,
      offerVisible: false,
      closeWOVisible: false,
      opVisible: false,
      tableData: [],
      fullscreenLoading: false,
      offerOrderLoading: false,
      closeOrderLoading: false,
      types: [{ 'label': '未分派', 'value': '1' }, { 'label': '已分派', 'value': '2' }, { 'label': '已处理', 'value': '3' }, { 'label': '已关闭', 'value': '4' }],
      brs: [],
      workers: [],
      opList: [],
      loading: false,
      opLoading: false,
      detailForm: {
        person: '',
        phone: '',
        fault: '',
        faultType: '',
        machine: '',
        desc: '',
        br: '',
        images: []
      },
      formLabelWidth: '120px',
      url: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg', 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg']
    }
  },
  created: function() {
    initWOList().then(res => {
      console.log(res)
      this.brs = res.data.brs
      this.workers = res.data.workers
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
    openOfferOrderDialog(scope) {
      this.offerForm.orderId = scope.row.orderId
      this.offerForm.worker = ''
      this.offerForm.operationInfo = ''
      this.offerVisible = true
    },
    openCloseOrderDialog(scope) {
      this.closeForm.orderId = scope.row.orderId
      this.closeForm.operationInfo = ''
      this.closeWOVisible = true
    },
    closeOPDialog() {
      this.opForm.orderId = ''
      this.opList = []
      this.opVisible = false
    },
    handleCloseOrder() {
      this.closeOrderLoading = true
      manageWO(this.closeForm).then(res => {
        console.log(res)
        this.closeOrderLoading = false
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '关单成功'
          })
        } else {
          this.$message({
            type: 'fail',
            message: res.message
          })
        }
        this.closeWOVisible = false
        this.onSubmit()
      })
    },
    handleOfferOrder() {
      this.closeOrderLoading = true
      manageWO(this.offerForm).then(res => {
        console.log(res)
        this.offerOrderLoading = false
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '派单成功'
          })
        } else {
          this.$message({
            type: 'fail',
            message: res.message
          })
        }
        this.offerVisible = false
        this.onSubmit()
      })
    },
    handleOPInfo(scope) {
      console.log(scope.row.orderId)
      queryOPList(scope.row.orderId).then(res => {
        console.log(res)
        this.opList = res.data
        this.opForm.orderId = scope.row.orderId
        this.opVisible = true
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
        this.detailForm.faultType = res.data.faultType
        const tmp = res.data.images.split(';')
        if (tmp[0] !== '') {
          const urls = []
          for (const index in tmp) {
            const url = tmp[index]
            urls.push(url)
          }
          this.detailForm.images = urls
          console.log(tmp.length)
          console.log(this.detailForm.images)
        } else {
          this.detailForm.images = []
        }
        this.detailForm.br = res.data.br
        this.detailVisible = true
      })
    },
    timestampToTime(timestamp) {
      const date = new Date(parseInt(timestamp))
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    }

  }
}
</script>

<style>

</style>
