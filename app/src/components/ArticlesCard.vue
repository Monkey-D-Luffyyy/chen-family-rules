<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--blue)"></span>
      共同纲领
      <span class="spacer"></span>
      <el-button type="primary" plain size="small" round @click="openAdd">
        <el-icon><Plus /></el-icon>&nbsp;新增条例
      </el-button>
    </div>

    <div v-if="!state.data.articles.length" class="empty">暂无条例，点击右上角“新增条例”开始立规矩～</div>

    <div v-if="paged.length" class="article-list">
      <div v-for="a in paged" :key="a.id" class="article">
        <div class="no">{{ articleIndex(a.id) }}</div>
        <div class="body">
          <div class="text">{{ a.text }}</div>
          <div class="penalty">
            <span class="plabel">惩罚：</span>
            <span v-if="a.penalty && a.penalty !== '\\'">{{ a.penalty }}</span>
            <span v-else class="no-penalty">暂无（念在初犯）</span>
          </div>
        </div>
        <div class="ops">
          <el-button size="small" round @click="openEdit(a)">编辑</el-button>
          <el-button size="small" type="danger" plain round @click="remove(a.id)">删除</el-button>
        </div>
      </div>
    </div>

    <div v-if="state.data.articles.length > pageSize" class="pager">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="state.data.articles.length"
        layout="prev, pager, next"
        background
        small
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑条例' : '新增条例'" width="520px" destroy-on-close>
      <el-form label-position="top">
        <el-form-item label="条例内容">
          <el-input v-model="formText" type="textarea" :rows="3" placeholder="第X条、……" />
        </el-form-item>
        <el-form-item label="惩罚措施">
          <el-input v-model="formPenalty" type="textarea" :rows="2" placeholder="没有惩罚可留空，或填一个反斜杠" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存条例</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import { state, addArticle, updateArticle, deleteArticle } from "../store";

const dialogVisible = ref(false);
const editing = ref(null);
const formText = ref("");
const formPenalty = ref("");

const pageSize = 20;
const page = ref(1);
const paged = computed(() => {
  const start = (page.value - 1) * pageSize;
  return state.data.articles.slice(start, start + pageSize);
});

function articleIndex(id) {
  return state.data.articles.findIndex(a => a.id === id) + 1;
}

watch(() => state.data.articles.length, () => {
  const maxPage = Math.max(1, Math.ceil(state.data.articles.length / pageSize));
  if (page.value > maxPage) page.value = maxPage;
});

function openAdd() {
  editing.value = null;
  formText.value = "";
  formPenalty.value = "";
  dialogVisible.value = true;
}

function openEdit(a) {
  editing.value = a;
  formText.value = a.text;
  formPenalty.value = a.penalty === "\\" ? "" : a.penalty;
  dialogVisible.value = true;
}

function save() {
  if (!formText.value.trim()) {
    ElMessage.warning("条例内容不能为空～");
    return;
  }
  if (editing.value) {
    updateArticle(editing.value.id, formText.value.trim(), formPenalty.value.trim());
  } else {
    addArticle(formText.value.trim(), formPenalty.value.trim());
  }
  dialogVisible.value = false;
}

async function remove(id) {
  try {
    await ElMessageBox.confirm("确定删除这条条例吗？", "提示", { type: "warning" });
    deleteArticle(id);
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
.article {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 12px;
  background: #fffdfa;
  display: flex;
  gap: 14px;
}
.no {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), #6d9fd0);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
}
.body { flex: 1; min-width: 0; }
.text { font-size: 15px; line-height: 1.7; }
.penalty {
  margin-top: 8px;
  font-size: 13px;
  color: var(--purple);
  line-height: 1.6;
  background: var(--purple-bg);
  border-radius: 8px;
  padding: 7px 11px;
}
.plabel { font-weight: 700; margin-right: 4px; }
.no-penalty { color: var(--ink-soft); }
.ops { flex: none; display: flex; gap: 6px; }
.pager {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

@media (max-width: 720px) {
  .article { flex-wrap: wrap; }
  .ops { width: 100%; justify-content: flex-end; }
  .ops :deep(.el-button) { flex: 1; max-width: 120px; }
}
</style>
