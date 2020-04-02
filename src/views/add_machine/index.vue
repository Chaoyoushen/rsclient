<template>
  <div>
    <el-container>
      <el-header style="text-align: right; font-size: 12px; margin-top: 12px">
        <input
          id="imFile"
          type="file"
          style="display: none"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="importFile(this)"
        >
        <a id="downlink" />
        <el-form :inline="true" :model="condition" style="margin-top: 12px">
          <el-form-item label="用户名" style="text-align: center">
            <el-input v-model="condition.machineName" placeholder="联系人" />
          </el-form-item>
          <el-form-item label="机器编号" style="text-align: center">
            <el-input v-model="condition.machineId" placeholder="" />
          </el-form-item>
          <el-form-item label="设备上属编号" style="text-align: center">
            <el-input v-model="condition.parentId" placeholder="" />
          </el-form-item>
          <el-button class="button" @click="queryMachine()">查询</el-button>
          <el-button class="button" @click="openAddInfo()">增加</el-button>
          <el-button class="button" @click="removeBatch()">删除</el-button>
          <el-button class="button" @click="downloadFile(excelData)">导出</el-button>
          <el-button class="button" @click="uploadFile()">导入</el-button>
          <el-button class="button" @click="batchAddMachine(excelData)">上传</el-button>
          <!--错误信息提示-->
          <el-dialog v-model="errorDialog" title="提示">
            <span>{{ errorMsg }}</span>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="errorDialog=false">确认</el-button>
            </span>
          </el-dialog>
        </el-form>
      </el-header>
      <el-main>
        <!--展示导入信息-->
        <el-table ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" :data="excelData" tooltip-effect="dark">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="设备名称或分类" prop="machineName" show-overflow-tooltip />
          <el-table-column label="设备编号" prop="machineId" show-overflow-tooltip />
          <el-table-column label="设备上属编号" prop="parentId" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="openChangeInfo(scope)"
              >编辑</el-button>
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
          <el-form-item label="设备名称或分类">
            <el-input v-model="detailForm.machineName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="设备编号">
            <el-input v-model="detailForm.machineId" style="width: 250px" />
          </el-form-item>
          <el-form-item label="设备上属编号">
            <el-input v-model="detailForm.parentId" style="width: 250px" />
          </el-form-item>
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
          <el-form-item label="设备名称或分类">
            <el-input v-model="addForm.machineName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="设备编号">
            <el-input v-model="addForm.machineId" style="width: 250px" />
          </el-form-item>
          <el-form-item label="设备上属编号">
            <el-input v-model="addForm.parentId" style="width: 250px" />
          </el-form-item>
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
  </div>
</template>

<script>
import '@/utils/excel'
import { queryMachines } from '@/api/admin'
import { manageMachines, batchDelete, addMachines, deleteMachines } from '@/api/machine'
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
      repeatData: [],
      multipleSelection: [],
      machineIds: '',
      loading: false,
      detailVisible: false,
      deleteVisible: false,
      addVisible: false,
      detailForm: {
        machineId: '',
        machineName: '',
        parentId: '',
        pastId: '',
        id: ''
      },
      addForm: {
        machineId: '',
        machineName: '',
        parentId: '',
        id: ''
      },
      deleteForm: {
        machineId: '',
        id: ''
      },
      condition: {
        machineId: '',
        machineName: '',
        parentId: ''
      }
    }
  },
  mounted() {
    this.imFile = document.getElementById('imFile')
    this.outFile = document.getElementById('downlink')
  },
  methods: {
    open() {
      this.$message('设备导入成功')
    },
    queryMachine() {
      this.loading = true
      const data = {
        parentId: this.condition.parentId,
        machineName: this.condition.machineName,
        machineId: this.condition.machineId
      }
      console.log(data)
      queryMachines(data).then(res => {
        console.log(res)
        this.excelData = res.data
        this.loading = false
      })
    },
    downloadFile(rs, name) { // 点击导出按钮
      let data = [{}]
      for (const k in rs[0]) {
        data[0][k] = k
      }
      data = data.concat(rs)
      this.downloadExl(data, '设备列表')
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
    batchAddMachine(excelData) {
      if (excelData.length <= 0) {
        this.errorDialog = true
        this.errorMsg = '请导入正确信息'
      } else {
        this.fullscreenLoading = true
        console.log(JSON.stringify(excelData))
        this.$store.dispatch('user/batchAddMachine', excelData).then(res => {
          this.fullscreenLoading = false
          this.open()
        }).catch(() => {
          this.fullscreenLoading = false
          this.errorDialog = true
          this.errorMsg = '请导入正确信息'
        })
      }
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
    openChangeInfo(scope) {
      this.detailForm.parentId = scope.row.parentId
      this.detailForm.machineName = scope.row.machineName
      this.detailForm.machineId = scope.row.machineId
      this.detailForm.pastId = scope.row.machineId
      this.detailForm.id = scope.row.id
      this.detailVisible = true
    },
    openAddInfo(scope) {
      this.addForm.parentId = ''
      this.addForm.machineName = ''
      this.addForm.machineId = ''
      this.addForm.id = ''
      this.addVisible = true
    },
    openDeleteInfo(scope) {
      this.deleteForm.machineId = scope.row.machineId
      this.deleteForm.id = scope.row.id
      this.deleteVisible = true
    },
    handleChange() {
      manageMachines(this.detailForm).then(res => {
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
        this.queryMachine()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    removeBatch() {
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.machineIds += this.multipleSelection[i].id + ','
      }
      batchDelete(this.machineIds).then(res => {
        console.log(res)
        this.$message('删除成功')
        this.queryMachine()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      this.machineIds = ''
    },
    handleAdd() {
      addMachines(this.addForm).then(res => {
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
        this.queryMachine()
      })
    },
    handleDelete() {
      deleteMachines(this.deleteForm.id).then(res => {
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
        this.queryMachine()
      })
    }
  }
}
</script>

<style>
</style>
