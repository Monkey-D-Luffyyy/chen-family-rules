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
}
.sync-status.ok { color: #5f9b5d; }
.sync-status.err { color: #c94f4f; }
</style>
