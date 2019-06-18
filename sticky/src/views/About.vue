<template>
  <div class="about">
    <div class="top-box">
      占位区域
    </div>
    <div class="sticky-wrapper" ref="stickyWrapper">
      <div class="parent">
        <div style="height: 140px; background: purple"></div>
        <div class="sticky-bar" ref="bar">bar1</div>
        <div class="content">
          <p>asd</p>
          <p>asdasdasd</p>
          <p>asdasdasdasdasd</p>
        </div>
      </div>
      <!-- <div class="parent">
        <div style="height: 40px; background: purple"></div>
        <div class="sticky-bar" ref="bar">bar2</div>
        <div class="content">
          asd
          asdasdasd
          asdasdasdasdasd
        </div>
      </div> -->
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
    this.stickybits = stickybits(document.querySelectorAll('.sticky-bar'), {
        useStickyClasses: true,
        scrollEl: this.$refs.stickyWrapper,
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
.sticky-wrapper {
  position: relative;

  overflow-y: scroll;

  height: 300px;

  background: grey;
  .parent {
    position: relative;
  }
  .sticky-bar {
    // top: 0;
    width: 100%;
    height: 50px;

    background: blue;
    &.js-is-sticky {
      background: red;
    }
    &.js-is-stuck {
      background: pink;
    }
  }
  .content {
    height: 500px;

    background: green;
  }
}
</style>
