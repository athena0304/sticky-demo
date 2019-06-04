<template>
  <div class="about">
    <div class="top-box">
      占位区域
    </div>
    <div class="sticky-wrapper" ref="stickyWrapper">
      <div class="sticky-bar" ref="bar">bar</div>
      <div class="content">
        asd
        asdasdasd
        asdasdasdasdasd
      </div>
    </div>
  </div>
</template>
<script>
import stickybits from '../stickybits';
export default {
  data() {
    return {
      stickybits:null
    }
  },
  mounted () {
    this.stickybits = stickybits(this.$refs.bar, {
        useStickyClasses: true,
        scrollEl: this.$refs.stickyWrapper,
        stickyBitStickyOffset: 0,
      });
  }
}
</script>


<style lang="scss" scoped>
.top-box {
  height: 100px;

  background: yellow;
}
.sticky-wrapper {
  overflow: scroll;

  height: 300px;

  background: grey;
  .sticky-bar {
    height: 50px;

    background: blue;
    &.js-is-sticky {
      background: red;
    }
  }
  .content {
    height: 1000px;

    background: green;
  }
}
</style>
