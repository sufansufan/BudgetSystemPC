<template>
  <split-pane
    :style="{minHeight: `calc(100vh - ${fastNav ? '162px' : '106px'})`}"
    :min-percent="20"
    split="vertical"
    class="budget-detail"
  >
    <template slot="paneL">
      <div class="budget-detail-left">
        <div class="goback">
          <el-button icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane :label="levelData.name" name="generalTable">
            <general-tabel
              v-loading="detailLoading"
              :level-data="levelData.budgetLevels"
              :is-edit="isEdit"
              :is-merge="isMerge"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <template slot="paneR">
      <div class="budget-detail-right">
        <budget-overview
          v-loading="detailLoading"
          :detail-content="detailContent"
          :reserve-fund-apply="reserveFundApply"
          :is-edit="isEdit"
          :is-merge="isMerge"
          v-bind="$attrs"
          class="box-shadow"
        >
          <slot :auditId="auditId"/>
        </budget-overview>
      </div>
    </template>
  </split-pane>
</template>

<script>
import SplitPane from 'vue-splitpane'
import { mapGetters } from 'vuex'
import { getBudgetLevelList, getBudgetDetail } from '@/api/myBudget'
import GeneralTabel from './GeneralTabel'
import BudgetOverview from './BudgetOverview'
export default {
  components: {
    SplitPane,
    GeneralTabel,
    BudgetOverview
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isMerge: {
      type: Boolean,
      default: false
    },
    mergeData: {
      type: Object,
      default: () => ({ offices: [] })
    }
  },
  data() {
    return {
      detailLoading: true,
      activeName: 'generalTable',
      levelData: [],
      LevelAttachs: [],
      generalTotalData: {},
      historyList: [],
      detailContent: {
        id: null,
        name: null,
        date: null
      },
      auditId: {},
      reserveFundApply: {
        reserveFundKeep: '',
        reserveFundApply: ''
      },
      isMergerSummary: false
    }
  },
  computed: {
    ...mapGetters(['fastNav']),
    isEditor() {
      return (!!this.detailContent.id && this.isEdit)
    }
  },
  watch: {
    mergeData: {
      handler() {
        const {
          officeIds,
          offices,
          budgetLevel,
          budgetLevelAttachs,
          budgetBelongDateString,
          reserveFundApply } = this.mergeData
        this.levelData = budgetLevel
        this.LevelAttachs = budgetLevelAttachs
        this.detailContent.date = budgetBelongDateString
        this.detailContent.officeIds = officeIds
        this.detailContent.offices = offices
        this.reserveFundApply = reserveFundApply ? { ...reserveFundApply } : {
          reserveFundKeep: '',
          reserveFundApply: ''
        }
        this.detailLoading = false
      },
      deep: true
    }
  },
  created() {
    if (this.$route.params.id === undefined) {
      this.$router.go(-1)
      return
    }
    const { id = null, rid = null } = this.$route.params
    this.detailContent.id = id
    if (this.isEditor || id) {
      this.auditId = {
        id,
        rid
      }
      if (!this.isMerge) this.getBudgetDetail(id)
    } else {
      this.getLeverList()
    }
  },
  methods: {
    getLeverList() {
      this.detailLoading = true
      getBudgetLevelList().then(res => {
        this.detailLoading = false
        const { budgetLevel, budgetLevelAttachs } = res.data
        this.levelData = budgetLevel[0]
        this.LevelAttachs = budgetLevelAttachs
        this.levelData.budgetLevels = budgetLevel[0].budgetLevels.map(item => {
          item.budgetLevels.map((row, index) => {
            if (budgetLevelAttachs.some(item => item.parent.id === row.id)) {
              row.auto = true
            }
            return row
          })
          return item
        })
      })
    },
    getBudgetDetail(id) {
      this.detailLoading = true
      getBudgetDetail({ id }).then(res => {
        this.detailLoading = false
        const {
          budgetLevel,
          budgetSummary: {
            name,
            isMergerSummary,
            budgetBelongDate,
            budgetBelongDateString: date
          },
          offices,
          reason,
          budgetApprovalRecords,
          budgetLevelAttachs,
          reserveFundApply } = res.data
        this.levelData = budgetLevel
        this.detailContent.name = name
        this.detailContent.dateTime = budgetBelongDate
        this.detailContent.date = date
        this.detailContent.offices = offices
        this.detailContent.reason = reason
        this.isMergerSummary = !!isMergerSummary
        this.historyList = budgetApprovalRecords
        this.LevelAttachs = budgetLevelAttachs
        this.reserveFundApply = reserveFundApply ? { ...reserveFundApply } : {
          reserveFundKeep: '',
          reserveFundApply: ''
        }
      })
    }
  }
}
</script>
<style lang="scss">
.budget-detail {
  .el-tabs__header {
    margin-left: 100px;
  }
  .splitter-paneL,
  .splitter-paneR {
    position: relative !important;
    padding: 0 !important;
  }
  .splitter-paneL {
    padding-right: 11px !important;
  }
  .splitter-paneR {
    padding-left: 11px !important;
  }
}
</style>
<style lang="scss" scoped>
.budget-detail {
  display: flex;
  justify-content: space-between;
  background: #f3f5f7;
  align-items: flex-start;
  margin: -22px;
  .goback {
    position: absolute;
    margin: 5px 0 0 0;
  }
  &-left,
  &-right {
    background: #fff;
  }
  &-left {
    box-shadow: 0 0 20px 10px #ececec;
    border-radius: 5px;
    padding: 15px 20px;
  }
  .box-shadow {
    padding: 15px 20px 25px;
    box-shadow: 0 0 20px 10px #ececec;
    border-radius: 5px;
  }
}
</style>
