<template>
<div class="mh-wrapper">
  <div
      class="navbar"
      ref="navbar">头部</div>
    <div class="mh-content">
      <div class="wrapper hotel-intro-wrapper">头图<i
        class="iconfont iconfont-close"
      /></div>
      <div class="wrapper booking-wrapper">
        <div class="booking-date-wrapper">占位</div>
        <!-- <div class="filter-tag-wrapper">
          <span>含早餐</span>
          <span>免费取消</span>
        </div> -->
        <div
          class="room-info-wrapper"
          ref="roomlist">
          <RoomListItem
            v-for="(item, index) in RoomList"
            :key="index"
            />
        </div>
      </div>
      <div class="wrapper gonglve-wrapper">
        占位
      </div>
      <div class="wrapper questions-wrapper">
        占位
      </div>
    </div>
  </div>
</template>

<script>
import RoomListItem from '../components/RoomListItem';
export default {
  components: {
    RoomListItem,
  },
  data() {
    return {
      RoomList: [1, 2, 3],
      stickybits: null,
    };
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .mh-wrapper {
    display: flex;
    flex-direction: column;
    font-size: 18px;
    background:rgba(246,247,249,1);

    .wrapper {
      margin-bottom: 8px;
      background: #fff;
      // padding: 12px 16px;
    }
    .navbar {
      position: fixed;
      height: 40px;
      background: #fff;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .mh-content {
      padding-top: 40px;
      background: transparent;

    }
    .hotel-intro-wrapper {
      height: 200px;
      background: rgb(255, 230, 0);
    }
    .booking-wrapper {
      .booking-date-wrapper {
        height: 112px;
        background:linear-gradient(133deg,rgba(51,136,255,1) 0%,rgba(102,166,255,1) 100%);
      }
      .filter-tag-wrapper {
        margin-top: 16px;
        display: flex;
        span {
          font-size:28px;
          line-height:36px;
          padding: 14px 24px;
          background:rgba(246,247,249,1);
          margin-right: 16px;
        }
      }
    }
    .gonglve-wrapper, .questions-wrapper {
      height: 600px;
        background:linear-gradient(133deg,rgba(51,136,255,1) 0%,rgba(102,166,255,1) 100%);
    }
  }
</style>