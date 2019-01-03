
<template>
  <count-to
    :end-val="num"
    :duration="time"
    :decimals="toFixed"
    :prefix="prefix"
    :style="{fontSize: size + 'px'}"
    class="price-font"
  />
</template>

<script>
import countTo from 'vue-count-to'
export default {
  components: {
    countTo
  },
  props: {
    time: {
      type: Number,
      default: 500
    },
    num: {
      type: Number,
      default: 0
    },
    toFixed: {
      type: Number,
      default: 2
    },
    prefix: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 18
    }
  }
}
</script>
