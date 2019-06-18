<template>
  <div class="room-list-item">
    <div
      ref="roomInfo"
      class="room-info"
      :class="{'is-expand': isExpand}">
      <p>占位</p>
      <p @click="onToggle">{{ isExpand ? '收起' : '展开' }}</p>
    </div>
    <ul
      ref="ratePlanBox"
      v-show="isExpand"
      class="rate-plan-wrapper">
      <li class="rate-plan-item">
        A占位
      </li>
      <li class="rate-plan-item">
        b占位
      </li>
    </ul>
  </div>
</template>

<script>
import stickybits from '../stickybits';
import RatePlanItem from './RatePlanItem';

export default {
  // components: { RatePlanItem },
  data() {
    return {
      isExpand: false,
      stickybits: null,
      ratePlanDialogVisible: false,
    };
  },
  methods: {
    onToggle() {
      this.isExpand = !this.isExpand;

      const ratePlanBox = this.$refs.ratePlanBox.getBoundingClientRect();
      const roomInfo = this.$refs.roomInfo.getBoundingClientRect();

      const ratePlanTop = ratePlanBox.top;
      const infoBottom = roomInfo.bottom;
      const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      if (!this.isExpand) {
        window.scrollTo({
          top: currentScrollTop - Math.abs(ratePlanTop - infoBottom),
        });
      }
      if (this.stickybits && this.stickybits.els.length !== 0) {
        this.stickybits.cleanup();
      }
      this.$nextTick(() => {
        if (this.isExpand) {
          this.stickybits = stickybits(this.$refs.roomInfo, {
            useStickyClasses: true,
            stickyBitStickyOffset: this.$parent.$refs.navbar.offsetHeight,
            useFixed: true,
          });
        }
      })
    },
    onShowRatePlanDetail() {
      this.ratePlanDialogVisible = true;
    },
  },
};
</script>


<style lang="scss" scoped>
.slide-up-down {
  &-enter-active, &-leave-active {
    transition: all .3s ease;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
  &-leave, &-enter-to {
    opacity: 1;
  }
}
.room-list-item {
  position: relative;
  .room-info {
    z-index: 4;

    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 120px;

    border-bottom: 1px solid #444;
    background: rgb(172, 224, 180);
    &.js-is-sticky {
      background: green;
    }
    &.js-is-stuck {
      background: pink;
    }
    &.is-expand {
      width: 100%;
    }
  }

  .rate-plan-wrapper {
    .rate-plan-item {
      height: 125px;
      &:nth-child(odd) {
        background:rgba(51,136,255,0.03);
      }
      &:nth-child(even) {
        background:#e6e6e6;
      }
    }
  }
}
</style>
