<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--gold)"></span>
      犯错记录册
      <span class="spacer"></span>
      <span style="font-size:12px;color:var(--ink-soft);font-weight:400">共 {{ state.data.mistakes.length }} 条</span>
    </div>

    <div v-if="!sorted.length" class="empty">记录册空空如也，愿永不新增 🍀</div>

    <div v-if="paged.length" class="log-list">
      <div v-for="m in paged" :key="m.id" class="log-item" :class="{ done: m.status === 'done' }">
        <div class="log-top">
          <span class="log-date">{{ shortDate(m.date) }}</span>
          <el-tag v-if="m.status === 'done'" size="small" type="success" effect="light" round>已履行</el-tag>
          <el-tag v-else size="small" type="warning" effect="light" round>待履行</el-tag>
        </div>
        <div class="log-tags">
          <el-tag :type="m.culprit === 'jia' ? 'danger' : 'primary'" size="small" effect="light" round>
            {{ nameOf(m.culprit) }} 犯错
          </el-tag>
          <el-tag v-if="m.articleId" size="small" type="warning" effect="dark" round>{{ articleLabel(m.articleId) }}</el-tag>
          <el-tag v-else size="small" effect="plain" round>其他</el-tag>
        </div>
        <div v-if="m.note" class="log-note">{{ m.note }}</div>
        <div v-if="m.penalty && m.penalty !== '\\'" class="log-penalty">⚖ 惩罚：{{ m.penalty }}</div>
        <div class="log-actions">
          <el-button size="small" :type="m.status === 'done' ? 'default' : 'success'" round @click="toggleMistake(m.id)">
            {{ m.status === 'done' ? '撤销' : '标记已履行' }}
          </el-button>
          <el-button size="small" type="danger" plain round @click="remove(m.id)">删除</el-button>
        </div>
      </div>
    </div>

    <div v-if="sorted.length > pageSize" class="pager">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="sorted.length"
        layout="prev, pager, next"
        background
        small
      />
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { ElMessageBox } from "element-plus";
import "element-plus/es/components/message-box/style/css";
import { state, toggleMistake, deleteMistake } from "../store";

const sorted = computed(() =>
  [...state.data.mistakes].sort((x, y) => (y.date + y.createdAt).localeCompare(x.date + x.createdAt))
);

const pageSize = 10;
const page = ref(1);
const paged = computed(() => {
  const start = (page.value - 1) * pageSize;
  return sorted.value.slice(start, start + pageSize);
});

watch(sorted, () => {
  const maxPage = Math.max(1, Math.ceil(sorted.value.length / pageSize));
  if (page.value > maxPage) page.value = maxPage;
});

function shortDate(iso) {
  if (!iso) return "";
  const p = iso.split("-");
  return p.length === 3 ? parseInt(p[1], 10) + "月" + parseInt(p[2], 10) + "日" : iso;
}

function nameOf(k) {
  return k === "yi" ? state.data.names.yi : state.data.names.jia;
}

function articleLabel(id) {
  const idx = state.data.articles.findIndex(a => a.id === id);
  return idx >= 0 ? "第" + (idx + 1) + "条" : "其他";
}

async function remove(id) {
  try {
    await ElMessageBox.confirm("确定删除这条犯错记录吗？", "提示", { type: "warning" });
    deleteMistake(id);
  } catch (e) {
    // cancelled
  }
}
</script>

<style scoped>
.empty {
  text-align: center;
  color: var(--ink-soft);
  padding: 22px 0 8px;
  font-size: 14px;
}
.log-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.log-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--line);
  border-left: 4px solid var(--pink);
  border-radius: 12px;
  padding: 14px 16px;
  background: #fffdfa;
  transition: box-shadow .18s ease, transform .18s ease;
}
.log-item:hover {
  box-shadow: 0 6px 16px rgba(122, 90, 60, .08);
}
.log-item.done { border-left-color: var(--green); opacity: .82; }
.log-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.log-date {
  background: var(--pink-bg);
  color: #c45b6e;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
}
.log-item.done .log-date { background: var(--green-bg); color: #5f9b5d; }
.log-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-top: 4px;
}
.log-note { font-size: 14px; line-height: 1.6; }
.log-penalty {
  margin-top: 2px;
  font-size: 13px;
  color: var(--purple);
  background: var(--purple-bg);
  border-radius: 8px;
  padding: 6px 10px;
  line-height: 1.55;
}
.log-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}
.pager {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

@media (max-width: 720px) {
  .log-actions { width: 100%; }
  .log-actions :deep(.el-button) { flex: 1; }
}
</style>
