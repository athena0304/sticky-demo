<template>
  <div class="about">
    <div class="top-box">
      占位区域
    </div>
    <div>
      <div style="height: 40px; background: purple"></div>
      <div class="sticky-bar" ref="bar">bar</div>
      <div class="content">
        <p>asd</p>
        <p>asdasdasd</p>
        <p>asdasdasdasdasd</p>
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
        stickyBitStickyOffset: 0,
        // noStyles: true,
        // useFixed: true,
      });
  }
}
</script>


<style lang="scss" scoped>
.top-box {
  height: 100px;

  background: yellow;
}

  .sticky-bar {
    width: 100%;
    height: 50px;
    // top: 0;
    // position: sticky;

    background: blue;
    &.js-is-sticky {
      background: red;
    }
    &.js-is-stuck {
      background: pink;
    }
  }
  .content {
    height: 1000px;

    background: green;
  }

</style>
