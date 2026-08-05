<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:#6ba3d6"></span>
      云端同步
      <span class="spacer"></span>
    </div>
    <div class="sync-status" :class="state.syncClass">{{ state.syncStatus }}</div>
  </section>
</template>

<script setup>
import { state } from "../store";
</script>

<style scoped>
.sync-status {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.6;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fffdf9;
  border: 1px solid var(--line);
}
.sync-status.ok { color: #4e7e4c; background: var(--green-bg); border-color: #d4e7d0; }
.sync-status.err { color: #c94f4f; background: #fdf0f2; border-color: #f3cdd4; }
</style>
