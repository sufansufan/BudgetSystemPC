<template>
  <div class="budget-general-table">
    <el-collapse :value="opendIds">
      <el-collapse-item v-for="(item, index) in copyParentData" :key="item.id" :name="item.id">
        <template slot="title">
          <h3>{{ item.name }}</h3>
          <div class="count">合计：￥
            <count-num :num="+totalAmount[index].applyAmount"/>
          </div>
        </template>
        <div v-for="(inp, k) in item.budgetLevels" :key="inp.id" class="list">
          <h3>{{ inp.name }}</h3>
          <el-input
            v-model="listData[index][k].applyAmount"
            :placeholder="inp.tips"
            :disabled="inp.auto || !isEdit"
            clearable
            type="number"
            size="medium"
            @input.native="e => priceSlice(e, index, k)"
            @blur="fixPrice(listData[index][k])"
            @mousewheel.prevent.native
          />
          <template v-if="!isMerge">
            <i
              v-if="listData[index][k].richText || isEdit || listData[index][k].whetherHasRichText"
              :class="{enclosure: true, yes: listData[index][k].richText || (listData[index][k].status !== undefined ? listData[index][k].status : listData[index][k].whetherHasRichText)}"
              title="附件"
              @click="editAccessories(inp, listData[index][k])"
            />
            <i v-else-if="!inp.auto" class="enclosure" title="暂无附件"/>
          </template>
        </div>
      </el-collapse-item>
    </el-collapse>
    <Dialog ref="dialog">
      <edit-accessories
        :init-data="selectedAccessories"
        :is-edit="isEdit"
        :fet-upload-data="uploadData"
        @saved="saveAccessories"
        @close="$refs.dialog.show = false"
        @temp="tempChanged = true"
      />
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountNum from '@/components/Plugins/CountNum'
import Dialog from '@/components/Plugins/Dialog'
import EditAccessories from './EditAccessories'
import { getFile } from '@/api/myBudget'
export default {
  components: {
    CountNum,
    Dialog,
    EditAccessories
  },
  props: {
    levelData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    isMerge: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      copyParentData: [],
      listData: [],
      selectedAccessories: {},
      tempChanged: false,
      uploadData: {
        typeId: '',
        fileList: []
      }
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
          budgets: item.map(item => {
            const { applyAmount, budgetLevel: { id, name, tips, whetherHasRichText }, richText, fileList, status } = item
            item = {
              budgetLevel: {
                id,
                name,
                tips
              },
              applyAmount,
              richText,
              fileList,
              whetherHasRichText,
              status
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
            const { id, name, tips, applyAmount = '', richText, fileList, whetherHasRichText } = row
            row = {
              budgetLevel: {
                id,
                name,
                tips
              },
              applyAmount,
              richText,
              fileList,
              whetherHasRichText
            }
            return row
          })
        })
      },
      deep: true
    },
    listData: {
      handler() {
        const ids = []
        this.listData.forEach(item => {
          if (Array.isArray(item)) {
            item.forEach(d => {
              if (d.fileList) {
                d.fileList.map(o => {
                  ids.push(o.id)
                })
              }
            })
          }
        })
        this.$store.dispatch('SetFileIdList', ids)
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
      this.uploadData.typeId = row.id
      this.$refs.dialog.setTitle(row.name + ' 附件')
      this.selectedAccessories = item
      if (item.fileList === undefined) {
        this.selectedAccessories.fileList = []
      }
      if (this.tempChanged) {
        this.$set(this.selectedAccessories, '__key', new Date().getTime())
      }
      const { id } = this.$route.params
      if (id) {
        const params = {
          budgetSummaryId: id,
          budgetLevelId: row.id
        }
        getFile(params).then(({ data }) => {
          this.uploadData.fileList = data.fileList
        })
      } else {
        this.uploadData.fileList = item.fileList
      }
      this.$refs.dialog.show = true
    },
    saveAccessories(content, file) {
      console.log(content, file)
      this.tempChanged = false
      this.$refs.dialog.show = false
      this.selectedAccessories.richText = content
      this.selectedAccessories.fileList = file
      if (content || file && file.length) {
        this.selectedAccessories.status = true
      } else {
        this.selectedAccessories.status = false
      }
    }
  }
}
</script>

<style lang="scss">
.budget-general-table {
  .el-collapse-item__header {
    display: flex;
    > h3 {
      margin: 0 10px 0 0;
    }
    > i {
      margin: 0;
    }
    > .count {
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
      h3 {
        min-width: 160px;
        padding-left: 10px;
        color: #444;
        margin: 0;
      }
      .enclosure {
        cursor: pointer;
        width: 60px;
        height: 36px;
        margin-left: 10px;
        background: url("../../../assets/def_images/enclosure.png") center
          no-repeat;
        &.yes {
          background: url("../../../assets/def_images/enclosure_yes.png") center
            no-repeat;
        }
      }
    }
  }
}
</style>
