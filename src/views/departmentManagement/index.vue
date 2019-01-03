<template>
  <div class="deparment-mag">
    <div class="deparment-mag-contant">
      <div>
        <h3>总部</h3>
        <div class="headquarter active"> 总部</div>
      </div>
      <div>
        <h3>部门归属</h3>
        <div>
          <ul v-loading="loading">
            <li v-for="(item, index) in ascriptionList" :class="index === 0 ? 'active' : '' " :key="index" class="headquarter" @click="headquarterClick(index, ascriptionList.length, 'ascription', item.id)">
              <div>
                <el-input :ref="'editRef' + index" :maxlength="12" v-model.trim="item.name" :disabled="isEdit[index]" :autofocus="true" placeholder="请输入" @blur="editBlur(item, index, 'ascription')" @keyup.enter.native="editBlur(item, index, 'ascription')"/>
              </div>
              <div>
                <p @click="deleteDepart(item.id)"><i class="el-icon-delete"/></p>
                <p @click="edit(index, 'ascription')"><i class="el-icon-edit"/></p>
              </div>
            </li>
            <li v-if="!ascriptionList.length" class="headquarter no-data"> 暂无数据</li>
            <li class="headquarter">
              <div>
                <el-input v-model.trim="ascription" :maxlength="12" placeholder="请输入" @keyup.enter.native="modify(1)"/>
              </div>
              <div>
                <i/>
                <p @click="modify(1)"><i class="el-icon-plus"/></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h3>部门</h3>
        <div>
          <ul v-loading="loading">
            <li v-for="(item ,index) in departmentList" :key="index" class="headquarter" @click="headquarterClick(index, departmentList.length, 'department')">
              <div>
                <el-input v-model.trim="item.name" :ref="'editDepRef' + index" :disabled="isEditDep[index]" :maxlength="12" placeholder="请输入" @blur="editBlur(item, index, 'department')" @keyup.enter.native="editBlur(item, index, 'department')"/>
              </div>
              <div>
                <p @click="deleteDepart(item.id)"><i class="el-icon-delete"/></p>
                <p @click="edit(index, 'department')"><i class="el-icon-edit"/></p>
              </div>
            </li>
            <li v-if="!departmentList.length" class="headquarter no-data"> 暂无数据</li>
            <li class="headquarter">
              <div>
                <el-input v-model.trim="department" :maxlength="12" placeholder="请输入" @keyup.enter.native="modify(2)" />
              </div>
              <div>
                <i/>
                <p @click="modify(2)"><i class="el-icon-plus"/> </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOfficeTree, addAndEditOffice, deleteOffice } from '@/api/departmentManage'
export default {
  data() {
    return {
      isEdit: [],
      isEditDep: [],
      ascriptionList: [],
      departmentList: [],
      ascription: '',
      department: '',
      parentId: null,
      loading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(parentId = 1) {
      this.loading = true
      getOfficeTree({ parentId }).then(({ data }) => {
        this.loading = false
        if (parentId === 1) {
          this.ascriptionList = data.list
          this.parentId ? this.fetchData(this.parentId) : this.fetchData(this.ascriptionList[0].id)
          this.ascriptionList.forEach(item => {
            this.isEdit.push(true)
          })
        } else {
          this.departmentList = data.list
          this.departmentList.forEach(item => {
            this.isEditDep.push(true)
          })
        }
      })
    },
    edit(index, type) {
      if (type === 'ascription') {
        this.$set(this.isEdit, index, false)
        this.$nextTick(() => {
          this.$refs['editRef' + index][0].focus()
        })
      } else {
        this.$set(this.isEditDep, index, false)
        this.$nextTick(() => {
          this.$refs['editDepRef' + index][0].focus()
        })
      }
    },
    editBlur(data, index, type) {
      if (type === 'ascription') {
        this.$refs['editRef' + index][0].blur()
        this.$set(this.isEdit, index, true)
        this.modify(1, data)
      } else {
        this.$refs['editDepRef' + index][0].blur()
        this.$set(this.isEditDep, index, true)
        this.modify(2, data)
      }
      this.$store.dispatch('GetOffice')
    },
    headquarterClick(index, length, type, id) {
      if (type === 'ascription') {
        this.parentId = id
        this.fetchData(id)
        for (let i = 0; i < length; i++) {
          this.$refs['editRef' + i][0].$el.parentNode.parentNode.classList.remove('active')
        }
        this.$refs['editRef' + index][0].$el.parentNode.parentNode.classList.add('active')
      } else {
        for (let i = 0; i < length; i++) {
          this.$refs['editDepRef' + i][0].$el.parentNode.parentNode.classList.remove('active')
        }
        this.$refs['editDepRef' + index][0].$el.parentNode.parentNode.classList.add('active')
      }
    },
    modify(val, data) {
      const param = {
        Loading: true,
        id: '',
        parentId: val,
        name: '',
        type: val
      }
      if (data) {
        param.id = data.id
        param.name = data.name
        if (val !== 1) {
          param.parentId = this.parentId || this.ascriptionList[0].id
        }
        if (param.name === '') {
          this.$message.warning('输入值不能为空')
          return
        }
      } else {
        if (val === 1) {
          param.name = this.ascription
        } else {
          param.name = this.department
          param.parentId = this.parentId || this.ascriptionList[0].id
        }
        if (param.name === '') {
          this.$message.warning('输入值不能为空')
          return
        }
      }
      addAndEditOffice(param).then(res => {
        this.fetchData()
        this.ascription = ''
        this.department = ''
        this.$message.success(res.msg)
        this.$store.dispatch('GetOffice')
      })
    },
    deleteDepart(id) {
      this.$confirm('是否删除该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOffice({ id }).then(res => {
          this.$message.success(res.msg)
          this.fetchData()
          this.$store.dispatch('GetOffice')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>
<style lang="scss">
  .deparment-mag{
    .headquarter{
      .el-input__inner{
        border: none;
        margin-left: -20px;
      }
      .el-input__inner{
         font-size: 16px;
      }
      .el-input.is-disabled .el-input__inner{
        background: none;
        color: #363636;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
</style>

<style lang="scss" scoped>
.deparment-mag{
  margin: -22px;
  min-height: calc(100vh - 105px);
  ul{
    list-style: none;
    padding: 0px;
  }
  .deparment-mag-contant{
    display: flex;
    justify-content: space-between;
    background: #f3f5f7;
    width: 100%;
    min-height: calc(100vh - 105px);
    > div {
      width: calc(33% - 11px);
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 20px 10px #ececec;
      padding: 0 20px 15px;
      .no-data{
        color: #aeb3be;
        justify-content: center !important;
      }
      .headquarter{
        border: 1px solid #d8dce5;
        height: 40px;
        border-radius: 5px;
        padding: 10px 15px 10px 20px;
        cursor: pointer;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        &.active{
          border: 1px solid #c19b62;
        }
        & div{
          display: flex;
          align-items: center;
          & p{
            width: 25px;
            height: 25px;
            background: #f2f2f2;
            border-radius: 50%;
            line-height: 25px;
            text-align: center;
            color: #c19b62;
            &:first-child{
              margin-right: 10px;
            }
          }
        }

      }
    }
  }

}
</style>
