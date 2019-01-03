<template>
  <div class="executive-editor-left">
    <el-collapse :value="opendIds">
      <el-collapse-item v-for="(item, index) in copyParentData" :key="item.id" :name="item.id">
        <template slot="title">
          <h3>{{ item.name }}</h3>
          <div class="count">合计：￥
            <count-num :num="totalAmount[index].applyAmount" :size="15"/>
          </div>
          <div class="count">实际合计：￥
            <count-num :num="totalAmount[index].realAmount" :size="15"/>
          </div>
        </template>
        <div v-for="(inp, k) in item.budgetLevels" :key="inp.id" class="list">
          <h3>{{ inp.name }}</h3>
          <el-input
            v-model="listData[index][k].applyAmount"
            :placeholder="inp.tips"
            :disabled="true"
            clearable
            type="number"
            size="medium"
          />
          <el-input
            v-model="listData[index][k].realAmount"
            :placeholder="inp.tips"
            clearable
            type="number"
            size="medium"
            @input.native="e => priceSlice(e, index, k)"
            @blur="fixPrice(listData[index][k])"
            @mousewheel.prevent.native
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountNum from '@/components/Plugins/CountNum'
export default {
  name: 'ExecutiveEditorTable',
  components: {
    CountNum
  },
  props: {
    levelData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      copyParentData: [],
      listData: [],
      selectedAccessories: {}
    }
  },
  computed: {
    ...mapGetters(['attachmentData']),
    opendIds() {
      return this.copyParentData.map(item => item.id)
    },
    totalAmount() {
      const totalAmount = this.listData.map((item, index) => {
        const { id, name } = this.copyParentData[index]
        const newItem = {
          budgetLevel: {
            id,
            name
          },
          applyAmount: item.map(item => item.applyAmount).reduce((s, n) => (+s + +n), 0),
          realAmount: item.map(item => item.realAmount).reduce((s, n) => (+s + +n), 0),
          budgets: item.map(item => {
            const { applyAmount, realAmount, budgetLevel: { id, name, tips }, richText } = item
            item = {
              budgetLevel: {
                id,
                name,
                tips
              },
              applyAmount,
              realAmount,
              richText
            }
            return item
          })
        }
        return newItem
      })
      this.$store.dispatch('SetBudgetList', totalAmount)
      return totalAmount
    }
  },
  watch: {
    levelData: {
      handler() {
        this.copyParentData = JSON.parse(JSON.stringify(this.levelData))
        this.listData = this.copyParentData.map(item => {
          return item.budgetLevels.map(row => {
            const { id, name, tips, applyAmount = '', realAmount = '', richText } = row
            row = {
              budgetLevel: {
                id,
                name,
                tips
              },
              applyAmount,
              realAmount,
              richText
            }
            return row
          })
        })
      },
      deep: true
    },
    attachmentData: {
      handler() {
        const totalAttachMent = JSON.parse(JSON.stringify(this.attachmentData))
        for (const i in totalAttachMent) {
          totalAttachMent[i] = totalAttachMent[i].length
            ? totalAttachMent[i].map(item => item.applyAmount).reduce((s, n) => (+s + +n), 0).toFixed(2) : ''
        }
        this.listData = this.listData.map(item => {
          item.map(row => {
            for (const i in totalAttachMent) {
              if (i === row.budgetLevel.id) {
                row.applyAmount = totalAttachMent[i]
                continue
              }
            }
            return row
          })
          return item
        })
      },
      deep: true
    }
  },
  methods: {
    priceSlice(e, index, key) {
      const { value } = e.target
      if (value.length > 9) {
        this.$set(this.listData[index][key], 'applyAmount', value.slice(0, 9))
      }
    },
    fixPrice(row) {
      row.applyAmount = Number(row.applyAmount < 0 ? 0 : row.applyAmount).toFixed(2)
    },
    editAccessories(row, item) {
      this.$refs.dialog.setTitle(row.name + ' 附件')
      this.selectedAccessories = item
      this.$refs.dialog.show = true
    },
    saveAccessories(content) {
      this.$refs.dialog.show = false
      this.selectedAccessories.richText = content
    }
  }
}
</script>

<style lang="scss">
.executive-editor-left {
  .el-collapse-item__header {
    display: flex;
    > h3 {
      margin: 0 10px 0 0;
    }
    > i {
      margin: 0;
    }
    > .count {
      min-width: 150px;
      order: 3;
      justify-items: self-end;
      flex-grow: 1;
      text-align: right;
    }
  }
  .el-collapse-item__content {
    padding-bottom: 10px !important;
    .list {
      display: flex;
      align-items: center;
      margin-bottom: 19px;
      > div:nth-child(2) {
        margin-right: 10px;
      }
      h3 {
        min-width: 160px;
        padding-left: 10px;
        color: #444;
        margin: 0;
      }
    }
  }
}
</style>
