<template>
  <el-container>
    <el-header>
      <div v-loading.fullscreen.lock="fullscreenLoading" class="index" element-loading-text="拼命加载中...">
        <input
          id="imFile"
          type="file"
          style="display: none"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="importFile(this)"
        >
      </div>
      <a id="link" />
      <el-button class="button" @click="uploadFile()">导入</el-button>
      <el-button class="button" @click="batchAddOrg(excelData)">上传</el-button>
      <!--错误信息提示-->
      <el-dialog v-model="errorDialog" title="提示">
        <span>{{ errorMsg }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errorDialog=false">确认</el-button>
        </span>
      </el-dialog></el-header>
    <el-main>
      <!--展示导入信息-->
      <el-table :data="excelData" tooltip-effect="dark" width="60%">
        <el-table-column label="机构名称" prop="name" show-overflow-tooltip />
        <el-table-column label="机构编号" prop="orgID" show-overflow-tooltip />
      </el-table>
    </el-main>
  </el-container>
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
      console.log(data)
      this.imFile.value = ''
      this.fullscreenLoading = false
      if (data.length <= 0) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      } else {
        console.log(data)
        this.excelData = data
      }
    },
    batchAddOrg(excelData) {
      if (excelData.isEmpty()) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      }
    }
  }
}
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>
