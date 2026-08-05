<template>
  <header class="header">
    <div class="seal">陈氏<br>家法</div>
    <h1>陈氏家法</h1>
    <div class="motto">持家之宝典 · 恋爱之宪法</div>
    <div class="header-actions">
      <el-button round @click="settingsVisible = true">
        <el-icon><Setting /></el-icon>&nbsp;立约人设置
      </el-button>
      <el-button round @click="exportData">
        <el-icon><Download /></el-icon>&nbsp;备份数据
      </el-button>
      <el-button round @click="$refs.importFile.click()">
        <el-icon><Upload /></el-icon>&nbsp;导入备份
      </el-button>
      <el-button round type="danger" plain @click="handleReset">
        <el-icon><Delete /></el-icon>&nbsp;清空数据
      </el-button>
      <input ref="importFile" type="file" accept="application/json" style="display:none" @change="importData">
    </div>

    <el-dialog v-model="settingsVisible" title="立约人设置" width="420px" destroy-on-close>
      <el-form label-width="90px">
        <el-form-item label="犯错方称呼一">
          <el-input v-model="nameJia" maxlength="8" placeholder="甲方" />
        </el-form-item>
        <el-form-item label="另一方称呼">
          <el-input v-model="nameYi" maxlength="8" placeholder="乙方" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNames">保存</el-button>
      </template>
    </el-dialog>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Setting, Download, Upload, Delete } from "@element-plus/icons-vue";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import { state, updateNames, resetData as resetStoreData, saveData } from "../store";

const settingsVisible = ref(false);
const nameJia = ref(state.data.names.jia);
const nameYi = ref(state.data.names.yi);

function saveNames() {
  updateNames(nameJia.value, nameYi.value);
  settingsVisible.value = false;
  ElMessage.success("已保存");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "陈氏家法备份-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.articles || !Array.isArray(parsed.articles) || !parsed.mistakes) throw new Error("格式不正确");
      ElMessageBox.confirm("导入后将覆盖当前所有数据，确定继续吗？", "提示", { type: "warning" }).then(() => {
        state.data = {
          names: parsed.names || { jia: "甲方", yi: "乙方" },
          articles: parsed.articles,
          mistakes: parsed.mistakes,
          daily: parsed.daily || {},
          deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
          updatedAt: Date.now()
        };
        saveData();
        ElMessage.success("导入成功");
      }).catch(() => {});
    } catch (err) {
      ElMessage.error("导入失败：文件不是有效的家法备份");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
}

async function handleReset() {
  try {
    await ElMessageBox.confirm("确定清空所有数据（条例、犯错记录、打卡）吗？此操作不可恢复，建议先备份！", "警告", { type: "warning" });
    await ElMessageBox.confirm("再次确认：真的要清空吗？", "警告", { type: "warning" });
    resetStoreData();
    ElMessage.success("已清空，恢复为初始家法");
  } catch (e) {
    // cancelled
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #fff7f4, #ffffff 55%, #f4f8ff);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 30px 34px 26px;
  text-align: center;
  position: relative;
}

.seal {
  position: absolute;
  right: 22px;
  top: 20px;
  width: 62px;
  height: 62px;
  border-radius: 12px;
  background: #c94f4f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  letter-spacing: 2px;
  line-height: 1.35;
  transform: rotate(6deg);
  box-shadow: 0 4px 10px rgba(201, 79, 79, .35);
  user-select: none;
}

h1 {
  margin: 0;
  font-size: 40px;
  letter-spacing: 10px;
  color: #b04a4a;
}

.motto {
  margin-top: 10px;
  color: var(--ink-soft);
  font-size: 14px;
  letter-spacing: 2px;
}

.header-actions {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .header { padding: 24px 16px 20px; border-radius: 20px; }
  h1 { font-size: 30px; letter-spacing: 6px; }
  .seal { display: none; }
  .motto { font-size: 12px; }
  .header-actions :deep(.el-button) { flex: 1 1 calc(50% - 10px); margin: 0; }
}
</style>
