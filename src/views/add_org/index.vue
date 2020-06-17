<template>
  <div>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div style="margin-top: 12px">
          <input
            id="imFile"
            type="file"
            style="display: none"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            @change="importFile(this)"
          >
          <a id="downlink" />
          <el-form :inline="true" :model="condition" style="margin-top: 12px">
            <el-form-item label="机构名" style="text-align: center">
              <el-input v-model="condition.orgName" placeholder="" />
            </el-form-item>
            <el-form-item label="机构编号">
              <el-input v-model="condition.orgId" placeholder="" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryOrg()">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="openAddInfo()">增加</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="removeBatch()">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="downloadFile()">导出</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="uploadFile()">导入</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="batchAddOrg(excelData)">上传</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main style="text-align: center">
        <!--展示导入信息-->
        <el-table ref="multipleTable" v-loading="loading" :data="excelData" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="机构名称" prop="orgName" show-overflow-tooltip />
          <el-table-column label="机构编号" prop="orgId" show-overflow-tooltip />
<!--          <el-table-column label="工号" prop="workNo" show-overflow-tooltip />-->
          <el-table-column label="操作" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="openChangeInfo(scope)"
              >编辑</el-button>
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="primary"-->
<!--                @click="openPassInfo(scope)"-->
<!--              >改密</el-button>-->
              <el-button
                size="mini"
                type="danger"
                @click="openDeleteInfo(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog
      title="详情"
      :visible.sync="detailVisible"
      width="60%"
      center
    >
      <span>
        <el-form :model="detailForm" label-width="80px">
          <el-form-item label="机构名称">
            <el-input v-model="detailForm.orgName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="机构编号">
            <el-input v-model="detailForm.orgId" placeholder="请选择" />
          </el-form-item>
<!--          <el-form-item label="工号">-->
<!--            <el-input v-model="detailForm.workNo" style="width: 250px" />-->
<!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleChange">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="addVisible"
      width="60%"
      center
    >
      <span>
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="机构名称">
            <el-input v-model="addForm.orgName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="机构编号">
            <el-input v-model="addForm.orgId" placeholder="请选择" filterable />
          </el-form-item>
<!--          <el-form-item label="工号">-->
<!--            <el-input v-model="addForm.workNo" style="width: 250px" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="密码">-->
<!--            <el-input v-model="addForm.password" style="width: 250px" />-->
<!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog v-loading="loading" title="删除" :visible.sync="deleteVisible" center>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </div>
    </el-dialog>
    <!--<el-dialog v-loading="loading" title="改密" :visible.sync="changeVisible" center>
      <el-form :model="changeForm">
        <el-form-item label="新密码">
          <el-input v-model="changeForm.password" style="width: 60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePass">确 定</el-button>
      </div>
    </el-dialog>-->
    <el-dialog v-model="errorDialog" title="提示">
      <span>{{ errorMsg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorDialog=false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import { queryOrg, manageOrg, deleteOrg, /* ChangePass,*/ addOrg, batchDelete, getOrgExcel } from '@/api/org'
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
      excelData: [],
      multipleSelection: [],
      personIds: '',
      loading: false,
      detailVisible: false,
      changeVisible: false,
      deleteVisible: false,
      addVisible: false,
      brs: [],
      condition: {
        orgName: '',
        orgId: '',
        role: ''
      },
      addForm: {
        /* password: '',*/
        personId: '',
        orgId: '',
        orgName: ''/*,
        workNo: ''*/
      },
      detailForm: {
        /* password: '',*/
        personId: '',
        oldId: '',
        oldName: '',
        orgId: '',
        orgName: ''/*,
        workNo: ''*/
      },
      deleteForm: {
        personId: ''
      }/*,
      changeForm: {
        personId: '',
        password: '',
        role: '',
        orgId: ''
      }*/
    }
  },
  mounted() {
    this.imFile = document.getElementById('imFile')
    this.outFile = document.getElementById('downlink')
  },
  methods: {
    open() {
      this.$message('导入成功')
    },
    downloadFile() { // 点击导出按钮
      getOrgExcel().then(resp => {
        const fileName = '机构信息.xls'
        const blob = new Blob([resp], { type: 'application/vnd.ms-excel' })
        saveAs(blob, fileName)
      })
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
        this.$store.dispatch('user/batchAddOrg', excelData).then(() => {
          this.fullscreenLoading = false
          this.open()
        }).catch(() => {
          this.fullscreenLoading = false
          this.errorDialog = true
          this.errorMsg = '请导入正确信息'
        })
      }
    },
    queryOrg() {
      this.loading = true
      const data = {
        orgId: this.condition.orgId,
        orgName: this.condition.orgName
      }
      console.log(data)
      queryOrg(data).then(res => {
        console.log(res)
        this.excelData = res.data
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    removeBatch() {
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.personIds += this.multipleSelection[i].personId + ','
      }
      batchDelete(this.personIds).then(res => {
        console.log(res)
        this.$message('删除成功')
        this.queryOrg()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      this.personIds = ''
    },
    downloadExl(json, downName, type) { // 导出到excel
      const keyMap = [] // 获取键
      for (const k in json[0]) {
        keyMap.push(k)
      }
      console.info('keyMap', keyMap, json)
      const tmpdata = [] // 用来保存转换好的json
      json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
      }))).reduce((prev, next) => prev.concat(next)).forEach(function(v) {
        tmpdata[v.position] = {
          v: v.v
        }
      })
      const outputPos = Object.keys(tmpdata) // 设置区域,比如表格从A1到D10
      const tmpWB = {
        SheetNames: ['mySheet'], // 保存的表标题
        Sheets: {
          'mySheet': Object.assign({},
            tmpdata, // 内容
            {
              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
            })
        }
      }
      const tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
        { bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary' } // 这里的数据是用来定义导出的格式类型
      ))], {
        type: ''
      }) // 创建二进制对象写入转换好的字节流
      const href = URL.createObjectURL(tmpDown) // 创建对象超链接
      this.outFile.download = downName + '.xlsx' // 下载名称
      this.outFile.href = href // 绑定a标签
      this.outFile.click() // 模拟点击实现下载
      setTimeout(function() { // 延时释放
        URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
      }, 100)
    },

    s2ab(s) { // 字符串转字符流
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    },
    getCharCol(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
      let s = ''
      let m = 0
      while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
      }
      return s
    },
    openAddInfo() {
      this.addForm.personId = ''
      this.addForm.orgName = ''
      /* this.addForm.workNo = ''*/
      this.addForm.orgId = ''
      /* this.addForm.password = ''*/
      this.addVisible = true
    },
    handleAdd() {
      addOrg(this.addForm).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else {
          this.$message({
            type: 'fail',
            message: res.message
          })
        }
        this.addVisible = false
        this.queryOrg()
      })
    },
    openChangeInfo(scope) {
      this.detailForm.personId = scope.row.personId
      this.detailForm.orgName = scope.row.orgName
      // this.detailForm.workNo = scope.row.workNo
      this.detailForm.orgId = scope.row.orgId
      this.detailForm.oldId = scope.row.orgId
      this.detailForm.oldName = scope.row.orgName
      this.detailVisible = true
    },
    handleChange() {
      manageOrg(this.detailForm).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else {
          this.$message({
            type: 'fail',
            message: res.message
          })
        }
        this.detailVisible = false
        this.queryOrg()
      })
    },
    /* openPassInfo(scope) {
      this.changeForm.personId = scope.row.personId
      this.changeForm.orgId = scope.row.orgId
      this.changeForm.password = ''
      this.changeVisible = true
    },
    handlePass() {
      ChangePass(this.changeForm).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else {
          this.$message({
            type: 'fail',
            message: res.message
          })
        }
        this.changeVisible = false
        this.queryOrg()
      })
    },*/
    openDeleteInfo(scope) {
      this.deleteForm.personId = scope.row.personId
      this.deleteVisible = true
    },
    handleDelete() {
      deleteOrg(this.deleteForm.personId).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else {
          this.$message({
            type: 'fail',
            message: res.message
          })
        }
        this.deleteVisible = false
        this.queryOrg()
      })
    }
  }
}
</script>

<style>

</style>
