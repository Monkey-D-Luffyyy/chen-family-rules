<template>
  <div class="stats">
    <el-statistic title="累计犯错" :value="stats.total" class="pink" />
    <el-statistic title="待履行惩罚" :value="stats.pending" class="blue" />
    <el-statistic title="已履行惩罚" :value="stats.done" class="green" />
    <el-statistic :title="'履行率'" :value="stats.rate" class="gold" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { state } from "../store";

const stats = computed(() => {
  const total = state.data.mistakes.length;
  const done = state.data.mistakes.filter(m => m.status === "done").length;
  const pending = total - done;
  return {
    total,
    pending,
    done,
    rate: total ? Math.round(done / total * 100) + "%" : "—"
  };
});
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 22px;
}

:deep(.el-statistic) {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 16px 10px;
  text-align: center;
}

:deep(.el-statistic__head) {
  color: var(--ink-soft);
  font-size: 12px;
  margin-bottom: 6px;
}

:deep(.el-statistic__content) {
  font-size: 28px;
  font-weight: 800;
}

:deep(.pink .el-statistic__content) { color: #d46b7e; }
:deep(.blue .el-statistic__content) { color: #4e87b8; }
:deep(.green .el-statistic__content) { color: #5f9b5d; }
:deep(.gold .el-statistic__content) { color: #b8862d; }

@media (max-width: 720px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 14px;
  }
  :deep(.el-statistic) { padding: 12px 6px; }
}
</style>
