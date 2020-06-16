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
        <el-input v-model="form.workNo"></el-input>
      </el-form-item>
      <el-form-item label="机构名">
        <el-input v-model="form.org"></el-input>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-input v-model="form.machine"></el-input>
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
          <el-option label="办公区（1台）" value="F0001"></el-option>
          <el-option label="办公区（多台）" value="F0002"></el-option>
          <el-option label="高柜（1台）" value="F0003"></el-option>
          <el-option label="高柜（多台）" value="F0004"></el-option>
          <el-option label="厅堂客户经理（1台）" value="F0005"></el-option>
          <el-option label="厅堂客户经理（多台）" value="F0006"></el-option>
          <el-option label="厅堂智能服务区和其他自助机具" value="F0007"></el-option>
          <el-option label="移动设备" value="F0008"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单状态">
        <el-select v-model="form.sts" placeholder="请选择" clearable>
          <el-option label="待审批" value="0"></el-option>
          <el-option label="处理中" value="1"></el-option>
          <el-option label="已解决" value="2"></el-option>
          <el-option label="已关闭" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理人">
        <el-input v-model="form.worker"></el-input>
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
      </el-table>
    </el-main>
  </div>
</template>

<script>
import { getWOList, getWOExcel, getAcctWOList, getTakeWOList, getAcctWOExcel, getTakeWOExcel } from '@/api/admin'
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
      woNumber: '',
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
        time: ''
      }
    }
  },
  methods: {
    onSubmit() {
      const data = {
        date1: this.form.date1,
        date2: this.form.date2,
        workNo: this.form.workNo,
        ownBr: this.form.org,
        acctPersonName: this.form.worker,
        machineName: this.form.machine,
        faultType: this.form.faultType,
        faultId: this.form.area,
        orderSts: this.form.sts,
        changeTime: this.form.changeTime,
        point: this.form.point,
        acctValue: this.form.time,
        takeValue: this.form.duration
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
        acctPersonName: this.form.worker,
        machineName: this.form.machine,
        faultType: this.form.faultType,
        faultId: this.form.area,
        orderSts: this.form.sts,
        changeTime: this.form.changeTime,
        point: this.form.point,
        acctValue: this.form.time,
        takeValue: this.form.duration
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
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

