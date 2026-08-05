<template>
  <div class="stats">
    <div class="stat pink">
      <div class="stat-icon"><el-icon><Warning /></el-icon></div>
      <div class="stat-num">{{ stats.total }}</div>
      <div class="stat-label">累计犯错</div>
    </div>
    <div class="stat blue">
      <div class="stat-icon"><el-icon><Clock /></el-icon></div>
      <div class="stat-num">{{ stats.pending }}</div>
      <div class="stat-label">待履行惩罚</div>
    </div>
    <div class="stat green">
      <div class="stat-icon"><el-icon><CircleCheck /></el-icon></div>
      <div class="stat-num">{{ stats.done }}</div>
      <div class="stat-label">已履行惩罚</div>
    </div>
    <div class="stat gold">
      <div class="stat-icon"><el-icon><Trophy /></el-icon></div>
      <div class="stat-num">{{ stats.rate }}</div>
      <div class="stat-label">履行率</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Warning, Clock, CircleCheck, Trophy } from "@element-plus/icons-vue";
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
.stat {
  border-radius: 18px;
  padding: 18px 12px 14px;
  text-align: center;
  border: 1px solid transparent;
  transition: transform .18s ease, box-shadow .18s ease;
}
.stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(122, 90, 60, .1);
}
.stat.pink { background: var(--pink-bg); border-color: #f8d9df; }
.stat.blue { background: var(--blue-bg); border-color: #d8e7f6; }
.stat.green { background: var(--green-bg); border-color: #d9e9d6; }
.stat.gold { background: #fdf3e0; border-color: #f3e2bd; }

.stat-icon {
  width: 36px;
  height: 36px;
  margin: 0 auto 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: rgba(255, 255, 255, .75);
  box-shadow: 0 2px 8px rgba(122, 90, 60, .08);
}
.stat.pink .stat-icon { color: #d46b7e; }
.stat.blue .stat-icon { color: #4e87b8; }
.stat.green .stat-icon { color: #5f9b5d; }
.stat.gold .stat-icon { color: #b8862d; }

.stat-num {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
}
.stat.pink .stat-num { color: #d46b7e; }
.stat.blue .stat-num { color: #4e87b8; }
.stat.green .stat-num { color: #5f9b5d; }
.stat.gold .stat-num { color: #b8862d; }

.stat-label {
  font-size: 12px;
  color: var(--ink-soft);
  margin-top: 4px;
  letter-spacing: 1px;
}

@media (max-width: 720px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 14px;
  }
  .stat { padding: 14px 8px 12px; }
  .stat-num { font-size: 22px; }
}
</style>
