<template>
  <div class="approval-flow">
    <div class="select-tools">
      <div>
        <div>
          <el-cascader
            :options="constant.office"
            :props="departmentType"
            v-model="select.selectDepart"
            change-on-select
            placeholder="部门"
            clearable
          />
        </div>
        <div>
          <el-input v-model.trim="select.examinePersonName" placeholder="请输入审批人" clearable/>
        </div>
      </div>
      <div class="btn">
        <div>
          <el-button type="primary" icon="el-icon-search" @click="fetchData('clear')">搜索</el-button>
        </div>
        <div>
          <el-button icon="el-icon-refresh" @click="resetSearch">重置搜索条件</el-button>
        </div>
      </div>
    </div>
    <el-table :data="dataList" stripe element-loading-text="Loading" highlight-current-row fit>
      <el-table-column prop="officeName" label="部门"/>
      <el-table-column label="第一级审批">
        <template
          slot-scope="scope"
        >{{ scope.row.examinePerson[0] && scope.row.examinePerson[0].name }}</template>
      </el-table-column>
      <el-table-column label="第二级审批">
        <template
          slot-scope="scope"
        >{{ scope.row.examinePerson[1] && scope.row.examinePerson[1].name }}</template>
      </el-table-column>
      <el-table-column label="第三级审批">
        <template
          slot-scope="scope"
        >{{ scope.row.examinePerson[2] && scope.row.examinePerson[2].name }}</template>
      </el-table-column>
      <el-table-column label="第四级审批">
        <template
          slot-scope="scope"
        >{{ scope.row.examinePerson[3] && scope.row.examinePerson[3].name }}</template>
      </el-table-column>
      <el-table-column label="第五级审批">
        <template
          slot-scope="scope"
        >{{ scope.row.examinePerson[4] && scope.row.examinePerson[4].name }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="!scope.row.whetherEdit" type="text" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="count"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="count"
      :current-page="page"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <Dialog ref="dialog" width="40%">
      <div class="approval-dialog">
        <div class="title">
          <div>部门归属
            <h1>{{ editInfo.affiliationOfficeName }}</h1>
          </div>
          <div>部门
            <h1>{{ editInfo.officeName }}</h1>
          </div>
        </div>
        <div class="content">
          <p>角色及姓名</p>
          <div v-for="(item, index) in examinePerson" :key="index">
            <el-autocomplete
              v-model="item.name"
              :fetch-suggestions="querySearch"
              placeholder="请输入姓名"
              style="width: 100%"
              @select="roleSelect($event, index)"
              @focus="getUserFromRole(item.roleId, index)"
            >>
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
              <el-select
                slot="prepend"
                v-model="item.roleId"
                placeholder="请选择角色"
                style="width: 150px"
                @change="getUserFromRole(item.roleId)"
              >
                <el-option
                  v-for="item in constant.role"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-autocomplete>
            <div class="content-icon" @click="delNode(index)">
              <div>
                <svg-icon icon-class="delete"/>
              </div>
            </div>
          </div>
          <div>
            <div class="content-icon add" @click="addNode">
              <div>
                <svg-icon icon-class="add"/>
              </div>
              <span>添加审批节点</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="big" @click="$refs.dialog.show = false">取 消</el-button>
        <el-button type="primary" size="big" @click="editConfirm">确 定</el-button>
      </span>
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getExamineList, editExamineSetting, getUserManageList } from '@/api/approvalSettings'
import tables from '@/mixin/tables'
import Dialog from '@/components/Plugins/Dialog'
export default {
  components: {
    Dialog
  },
  mixins: [tables],
  data() {
    return {
      select: {
        officeIds: '',
        approvalByName: '',
        selectDepart: []
      },
      dataList: [],
      userList: [],
      editInfo: {},
      examinePerson: [
        {
          id: '',
          name: '',
          level: ''
        }
      ],

      departmentType: {
        value: 'id',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters(['constant'])
  },
  created() {
    this.$store.dispatch('GetConstant', ['office', 'role']).then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(clear) {
      this.select.officeIds = this.select.selectDepart && this.select.selectDepart[this.select.selectDepart.length - 1] || ''
      const param = {
        page: clear ? this.page = 1 : this.page,
        limit: this.limit,
        ...this.select
      }
      delete param.selectDepart
      getExamineList(param).then(({ data }) => {
        this.count = data.count
        this.dataList = data.list
      })
    },
    edit(row) {
      this.editInfo = row
      this.examinePerson = JSON.parse(JSON.stringify(row.examinePerson))
      this.$refs.dialog.show = true
      this.$refs.dialog.setTitle('审批流设置')
    },
    addNode() {
      if (this.examinePerson.length === 5) {
        this.$message.info('审批级别最大是5级')
        return false
      } else {
        this.examinePerson.push({
          id: '',
          name: '',
          level: ''
        })
      }
    },
    delNode(index) {
      this.examinePerson.splice(index, 1)
    },
    editConfirm() {
      const flag = this.examinePerson.find((item, index) => {
        if (!item.name) {
          this.$message.warning(`第${index + 1}项名字为空`)
          return 1
        }
        if (!item.id) {
          this.$message.warning(`第${index + 1}项输入的名字存在问题`)
          return 1
        }
      })
      if (flag) {
        return
      } else {
        const param = {
          Loading: true,
          officeId: this.editInfo.officeId,
          examinePerson: this.examinePerson
        }
        param.examinePerson.map((item, index) => {
          item.level = index + 1
        })
        editExamineSetting(param).then(res => {
          this.$refs.dialog.show = false
          this.$message.success(res.msg)
          this.fetchData()
        })
      }
    },
    getUserFromRole(roleId, index) {
      this.examinePerson[index] ? this.examinePerson[index].id = '' : ''
      const param = {
        officeId: '',
        childreOfficeId: '',
        nameAndMobile: '',
        isUseable: true,
        roleId
      }
      getUserManageList(param).then(({ data }) => {
        this.userList = data.list
      })
    },
    querySearch(queryString, cb, event) {
      const results = queryString ? this.userList.filter(item => item.name.includes(queryString)) : this.userList
      cb(results)
    },
    roleSelect(item, index) {
      this.examinePerson[index].id = item.id
      this.examinePerson[index].name = item.name
      // this.examinePerson[index].level = index + 1
    }
  }
}
</script>

<style lang="scss">
.approval-flow {
  .approval-dialog {
    min-height: 600px;
    .title {
      display: flex;
      flex-wrap: wrap;
      & > div {
        width: 50%;
      }
    }
    .content {
      .el-input.is-focus .el-input__inner {
        border-color: none !important;
      }
      .el-input-group__prepend {
        color: #5a5e66;
      }
      & > div {
        display: flex;
        margin-bottom: 20px;
        .content-icon {
          margin-left: 20px;
          margin-top: 5px;
          display: flex;
          &.add {
            margin-left: 0px;
            cursor: pointer;
            & > div {
              margin-right: 10px;
            }
          }
          > div {
            width: 25px;
            height: 25px;
            background: #f2f2f2;
            border-radius: 50%;
            line-height: 25px;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
