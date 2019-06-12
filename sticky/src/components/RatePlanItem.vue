<template>
  <li
    class="rate-plan-item"
    @click="onShowRatePlanDetail">
    A房间
    <button>预定</button>
  </li>
</template>
<script>
export default {
  methods: {
    onShowRatePlanDetail() {
      this.$emit('showRatePlanDetail', {
        id: 1,
      });
    },
  },
};
</script>
