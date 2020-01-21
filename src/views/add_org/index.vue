<template>
  <div>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div style="margin-top: 12px">
          <el-button class="button" @click="uploadFile()">导入</el-button>
          <el-button class="button" @click="batchAddOrg(excelData)">上传</el-button>
        </div>
      </el-header>
      <el-main style="text-align: center">
        <!--展示导入信息-->
        <el-table :data="excelData" tooltip-effect="dark" width="60%">
          <el-table-column label="机构名称" prop="orgName" show-overflow-tooltip />
          <el-table-column label="机构编号" prop="orgId" show-overflow-tooltip />
        </el-table>
      </el-main>
    </el-container>
    <el-dialog v-model="errorDialog" title="提示">
      <span>{{ errorMsg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorDialog=false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import '@/utils/excel'
const XLSX = require('xlsx')
export default {
  name: 'Index',
  data() {
    return {
      fullscreenLoading: false, // 加载中
      imFile: '', // 导入文件el
      outFile: '', // 导出文件el
      errorDialog: false, // 错误信息弹窗
      errorMsg: '', // 错误信息内容
      excelData: []
    }
  },
  mounted() {
    this.imFile = document.getElementById('imFile')
    this.outFile = document.getElementById('link')
  },
  methods: {
    open() {
      this.$message('机构导入成功')
    },
    downloadFile(rs, name) { // 点击导出按钮
      let data = [{}]
      for (const k in rs[0]) {
        data[0][k] = k
      }
      data = data.concat(rs)
      this.downloadExl(data, name)
    },
    uploadFile() { // 点击导入按钮
      this.imFile.click()
    },
    importFile() { // 导入excel
      this.fullscreenLoading = true
      const obj = this.imFile
      if (!obj.files) {
        this.fullscreenLoading = false
        return
      }
      const f = obj.files[0]
      const reader = new FileReader()
      const $t = this
      reader.onload = function(e) {
        const data = e.target.result
        if ($t.rABS) {
          $t.wb = XLSX.read(btoa(this.fixData(data)), { // 手动转化
            type: 'base64'
          })
        } else {
          $t.wb = XLSX.read(data, {
            type: 'binary'
          })
        }
        const json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
        console.log(typeof json)
        $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
      }
      if (this.rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    analyzeData(data) { // 此处可以解析导入数据
      return data
    },
    dealFile(data) { // 处理导入的数据
      this.imFile.value = ''
      this.fullscreenLoading = false
      if (data.length <= 0) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      } else {
        this.excelData = data
      }
    },
    batchAddOrg(excelData) {
      if (excelData.length <= 0) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      } else {
        this.fullscreenLoading = true
        console.log(JSON.stringify(excelData))
        this.$store.dispatch('user/batchAddMachine', excelData).then(() => {
          this.fullscreenLoading = false
          this.open()
        }).catch(() => {
          this.fullscreenLoading = false
          this.errorDialog = true
          this.errorMsg = '请导入正确信息'
        })
      }
    }
  }
}
</script>

<style>

</style>
