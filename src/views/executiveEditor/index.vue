<template>
  <div class="executive-editor">
    <router-view/>
    <template v-if="!$route.params.id">
      <div class="select-tools">
        <div>
          <div>
            <el-date-picker
              v-model="select.budgetBelongDateString"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月"
            />
          </div>
          <div>
            <el-cascader
              :options="constant.office"
              :props="{value: 'id', label: 'name'}"
              v-model="select.officeId"
              change-on-select
              placeholder="部门"
              clearable
            />
          </div>
          <div>
            <el-input v-model.trim="select.createByName" placeholder="操作人"/>
          </div>
          <!-- 暂时隐藏 -->
          <!-- <div>
            <el-select v-model="select.state" placeholder="请选择状态">
              <el-option
                v-for="item in constant.budget_summary_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div> -->
        </div>
        <div class="btn">
          <div>
            <el-button type="primary" icon="el-icon-search" @click="fetchData('search')">搜索</el-button>
          </div>
          <div>
            <el-button icon="el-icon-refresh" @click="resetSearch">重置搜索条件</el-button>
          </div>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="dataList"
        stripe
        element-loading-text="Loading"
        highlight-current-row
        fit
      >
        <el-table-column prop="budgetSummary.budgetBelongDateString" label="年月" width="135"/>
        <el-table-column prop="budgetSummary.office.name" label="部门"/>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-html="scope.row.stateName"/>
          </template>
        </el-table-column>
        <el-table-column prop="budgetSummary.createBy.name" label="制表人"/>
        <el-table-column prop="budgetSummary.createDateString" label="制表日期" width="135"/>
        <el-table-column prop="budgetSummary.auditBy.name" label="审核人"/>
        <el-table-column prop="budgetSummary.auditDateString" label="审批日期" width="135"/>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="$router.push({name: 'ExecutiveEditorDetail', params: {id: scope.row.budgetSummary.id}})"
            >编辑</el-button>
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
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tables from '@/mixin/tables'
import { getBudgetExamineList } from '@/api/budgetApproval'
export default {
  mixins: [tables],
  data() {
    return {
      listLoading: true,
      select: {
        budgetBelongDateString: '',
        officeId: [],
        createByName: '',
        state: ''
      },
      dataList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'constant'])
  },
  created() {
    this.$store.dispatch('GetConstant', ['office', 'budget_summary_state'])
    this.fetchData()
  },
  methods: {
    fetchData(type) {
      type === 'search' && (this.page = 1)
      const office = JSON.parse(JSON.stringify(this.select.officeId))
      const params = {
        page: this.page,
        limit: this.limit,
        ...this.select,
        type: 5,
        officeId: office.length ? office.pop() : ''
      }
      this.listLoading = true
      getBudgetExamineList(params).then(res => {
        this.listLoading = false
        const { count, list } = res.data
        this.count = count
        this.dataList = list.map(item => {
          item.stateName = this.renderStateTag(item.budgetSummary.stateName)
          return item
        })
      })
    }
  }
}
</script>
