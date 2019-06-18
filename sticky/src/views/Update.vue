<template>
  <div class="about">
    <div class="top-box">
      占位区域
      <div>
        <button @click="add">增加节点</button>
      </div>
    </div>
    <div>
      <div v-for="item in arr" :key="item" style="height: 40px; background: purple">{{item}}</div>
      <div>
        <div class="sticky-bar" ref="bar">bar</div>
        <div class="content">
          <p>asd</p>
          <p>asdasdasd</p>
          <p>asdasdasdasdasd</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import stickybits from '../stickybits';
export default {
  data() {
    return {
      stickybits:null,
      arr: [0, 1]
    }
  },
  mounted () {
    this.stickybits = stickybits(this.$refs.bar, {
        useStickyClasses: true,
        stickyBitStickyOffset: 0,
        // noStyles: true,
        useFixed: true,
      });
  },
  methods: {
    add() {
      const {arr} = this
      this.arr.push(arr[arr.length - 1] + 1)
    }
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
