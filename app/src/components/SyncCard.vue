<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:#6ba3d6"></span>
      云端同步
      <span class="spacer"></span>
    </div>
    <div class="sync-status" :class="state.syncClass">
      <span>{{ state.syncStatus }}</span>
      <el-button v-if="state.syncClass === 'err'" size="small" round class="retry" @click="syncNow">重试</el-button>
    </div>
  </section>
</template>

<script setup>
import { state, syncNow } from "../store";
</script>

<style scoped>
.sync-status {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 2px;
}
.retry {
  flex: none;
}
.sync-status.ok {
  color: #4e7e4c;
  background: var(--green-bg);
  border: 1px solid #d4e7d0;
  border-radius: 12px;
  padding: 10px 14px;
}
.sync-status.err {
  color: #c94f4f;
  background: #fdf0f2;
  border: 1px solid #f3cdd4;
  border-radius: 12px;
  padding: 10px 14px;
}
</style>
