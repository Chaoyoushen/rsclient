<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="时间段">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择开始日期"  v-model="form.date1" style="width: 100%;" :picker-options="pickerOptions" value-format="timestamp">
            ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择结束日期" v-model="form.date2" style="width: 100%;" :picker-options="pickerOptions" value-format="timestamp">
            ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="接单时间">
        <el-select v-model="form.time" placeholder="请选择时间" clearable>
          <el-option label="0.5小时内" value="0"></el-option>
          <el-option label="0.5-1小时" value="1"></el-option>
          <el-option label="1-2小时" value="2"></el-option>
          <el-option label="2小时以上" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理时长">
        <el-select v-model="form.duration" placeholder="请选择" clearable>
          <el-option label="1小时以内" value="0"></el-option>
          <el-option label="1-2小时" value="1"></el-option>
          <el-option label="2-4小时" value="2"></el-option>
          <el-option label="4-8小时" value="3"></el-option>
          <el-option label="8小时以上" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="form.workNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="机构名">
        <el-select v-model="form.org" placeholder="请选择" filterable clearable>
          <el-option label="成都区域" value="0"></el-option>
          <el-option label="省辖行" value="1"></el-option>
          <el-option
            v-for="item in brs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-input v-model="form.machine" clearable></el-input>
      </el-form-item>
      <el-form-item label="故障分类">
        <el-select v-model="form.faultType" placeholder="请选择" clearable>
          <el-option label="网络问题" value="0"></el-option>
          <el-option label="操作系统及驱动" value="1"></el-option>
          <el-option label="硬件问题" value="2"></el-option>
          <el-option label="应用软件" value="3"></el-option>
          <el-option label="使用操作" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障区域">
        <el-select v-model="form.area" placeholder="请选择故障区域" clearable>
          <el-option
            v-for="item in faults"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工单状态">
        <el-select v-model="form.sts" placeholder="请选择" clearable>
          <el-option label="待分派" value="1"></el-option>
          <el-option label="处理中" value="2"></el-option>
          <el-option label="已解决" value="3"></el-option>
          <el-option label="已关闭" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理人">
        <el-select v-model="form.worker" placeholder="请选择处理工程师" filterable clearable>
        <el-option
          v-for="item in workers"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
        </el-select>
      </el-form-item>
      <el-form-item label="转单次数">
        <el-select v-model="form.changeTime" placeholder="请选择" clearable>
          <el-option label="1次" value="1"></el-option>
          <el-option label="2次" value="2"></el-option>
          <el-option label="2次以上" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="满意度评价">
        <el-select v-model="form.point" placeholder="请选择" clearable>
          <el-option label="1星" value="1"></el-option>
          <el-option label="2星" value="2"></el-option>
          <el-option label="3星" value="3"></el-option>
          <el-option label="4星" value="4"></el-option>
          <el-option label="5星" value="5"></el-option>
          <el-option label="3星及以上" value="6"></el-option>
          <el-option label="3星以下" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技术难度评估">
        <el-select v-model="form.difFlag" placeholder="请选择技术难度评估时间" clearable>
          <el-option
            v-for="item in difFlags"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="downloadFile">导出</el-button>
<!--        <el-button type="primary" @click="onSubmit1">基于接单时间查询</el-button>-->
<!--        <el-button type="primary" @click="onSubmit2">基于处理时间查询</el-button>-->
<!--        <el-button type="primary" @click="downloadFile1">基于接单时间导出</el-button>-->
<!--        <el-button type="primary" @click="downloadFile2">基于处理时间导出</el-button>-->
      </el-form-item>
    </el-form>
    <div>共有{{woNumber}}工单</div>
    <el-main>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 90%; margin-left: 5%"
      >
        <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="25%">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleDetailInfo(scope)"
            >详情</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleOPInfo(scope)"
            >流程</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="person"
          label="联系人"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="orderSts"
          label="工单状态"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="createDate"
          label="生成时间"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="completeDate"
          label="解决时间"
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
          prop="acceptPerson"
          label="工程师"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="org"
          label="网点"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="machineName"
          label="设备类型"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="faultName"
          label="故障区域"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="changeTime"
          label="转单次数"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="point"
          label="评价"
          width="180"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="difFlag"
          label="技术难度评估"
          width="180"
          header-align="center"
          align="center"
        />
      </el-table>
    </el-main>
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
import { getWOList, getWOExcel, getAcctWOList, getTakeWOList, getAcctWOExcel, getTakeWOExcel, initWOList, getWOInfo, queryOPList } from '@/api/admin'
import { saveAs } from 'file-saver'

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '一个月前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '三个月前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', date)
          }
        }, {
          text: '一年前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', date)
          }
        }]
      },
      tableData: [],
      brs: [],
      faults: [],
      workers: [],
      woNumber: '',
      opList: [],
      loading: false,
      opLoading: false,
      detailVisible: false,
      opVisible: false,
      closeWOVisible: false,
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
      difFlags: [{ 'label': '1-10分钟', 'value': '1' }, { 'label': '11-30分钟', 'value': '2' }, { 'label': '31-60分钟', 'value': '3' }, { 'label': '60分钟以上', 'value': '4' }, { 'label': '上门', 'value': '6' }],
      form: {
        sts: '',
        region: '',
        machine: '',
        date1: '',
        date2: '',
        faultType: '',
        duration: '',
        worker: '',
        area: '',
        org: '',
        workNo: '',
        type: [],
        point: '',
        changeTime: '',
        time: '',
        difFlag: ''
      }
    }
  },
  created: function() {
    initWOList().then(res => {
      console.log(res)
      this.brs = res.data.brs
      this.faults = res.data.faults
      this.workers = res.data.workers
      console.log(this.workers)
    })
  },
  methods: {
    onSubmit() {
      const data = {
        date1: this.form.date1,
        date2: this.form.date2,
        workNo: this.form.workNo,
        ownBr: this.form.org,
        acctPerson: this.form.worker,
        machineName: this.form.machine,
        faultType: this.form.faultType,
        faultId: this.form.area,
        orderSts: this.form.sts,
        changeTime: this.form.changeTime,
        point: this.form.point,
        acctValue: this.form.time,
        takeValue: this.form.duration,
        difFlag: this.form.difFlag
      }
      console.log(data)
      getWOList(data).then(res => {
        console.log(res)
        this.tableData = res.data
        this.woNumber = res.data.length
        console.log(this.woNumber)
        this.loading = false
      })
    },
    onSubmit1() {
      console.log(this.form.time)
      getAcctWOList(this.form.time).then(res => {
        console.log(res)
        this.tableData = res.data
        this.loading = false
        this.woNumber = res.data.length
      })
    },
    onSubmit2() {
      console.log(this.form.duration)
      getTakeWOList(this.form.duration).then(res => {
        console.log(res)
        this.tableData = res.data
        this.loading = false
        this.woNumber = res.data.length
      })
    },
    downloadFile() { // 点击导出按钮
      const data = {
        date1: this.form.date1,
        date2: this.form.date2,
        workNo: this.form.workNo,
        ownBr: this.form.org,
        acctPerson: this.form.worker,
        machineName: this.form.machine,
        faultType: this.form.faultType,
        faultId: this.form.area,
        orderSts: this.form.sts,
        changeTime: this.form.changeTime,
        point: this.form.point,
        acctValue: this.form.time,
        takeValue: this.form.duration,
        difFlag: this.form.difFlag
      }
      getWOExcel(data).then(resp => {
        const fileName = '工单信息.xls'
        const blob = new Blob([resp], { type: 'application/vnd.ms-excel' })
        saveAs(blob, fileName)
      })
    },
    downloadFile1() { // 点击导出按钮
      getAcctWOExcel(this.form.time).then(resp => {
        const fileName = '工单信息（接单时间）.xls'
        const blob = new Blob([resp], { type: 'application/vnd.ms-excel' })
        saveAs(blob, fileName)
      })
    },
    downloadFile2() { // 点击导出按钮
      getTakeWOExcel(this.form.duration).then(resp => {
        const fileName = '工单信息（处理时间）.xls'
        const blob = new Blob([resp], { type: 'application/vnd.ms-excel' })
        saveAs(blob, fileName)
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
    closeOPDialog() {
      this.opForm.orderId = ''
      this.opList = []
      this.opVisible = false
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
        this.detailForm.desc = res.data.description
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

<style scoped>
.line{
  text-align: center;
}
</style>

