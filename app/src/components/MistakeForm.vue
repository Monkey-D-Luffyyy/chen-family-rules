<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--pink)"></span>
      犯错登记
      <span class="spacer"></span>
      <span style="font-size:12px;color:var(--ink-soft);font-weight:400">犯错不可怕，敢认才可贵</span>
    </div>

    <el-form label-position="top">
      <div class="form-row">
        <el-form-item label="犯错日期">
          <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
        <el-form-item label="犯错方">
          <el-radio-group v-model="form.culprit" class="culprit-group">
            <el-radio-button value="jia">{{ state.data.names.jia }}</el-radio-button>
            <el-radio-button value="yi">{{ state.data.names.yi }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="触犯条例">
        <el-select v-model="form.articleId" style="width:100%">
          <el-option label="其他 / 未列入条例" value="__other__" />
          <el-option
            v-for="(a, i) in state.data.articles"
            :key="a.id"
            :label="'第' + (i + 1) + '条：' + a.text.replace(/^第[一二三四五六七八九十百\d]+条、?/, '')"
            :value="a.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="具体经过（记录一下发生了什么）">
        <el-input v-model="form.note" type="textarea" :rows="2" placeholder="比如：今天说了狠话……" />
      </el-form-item>
      <el-form-item label="惩罚措施（默认按条例执行，可修改）">
        <el-input v-model="form.penalty" type="textarea" :rows="2" placeholder="按照所选条例的惩罚填写" />
      </el-form-item>
      <div class="form-foot">
        <span class="hint">登记后可在下方列表中标记“已履行”</span>
        <el-button type="primary" round @click="submit">
          <el-icon><EditPen /></el-icon>&nbsp;记录犯错
        </el-button>
      </div>
    </el-form>
  </section>
</template>

<script setup>
import { reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { EditPen } from "@element-plus/icons-vue";
import "element-plus/es/components/message/style/css";
import { state, addMistake, today } from "../store";

const form = reactive({
  date: today(),
  culprit: "jia",
  articleId: "__other__",
  note: "",
  penalty: ""
});

watch(() => form.articleId, id => {
  const a = state.data.articles.find(x => x.id === id);
  if (a && a.penalty && a.penalty !== "\\" && !form.penalty) {
    form.penalty = a.penalty;
  } else if (!a && !form.penalty) {
    form.penalty = "";
  }
});

function articleById(id) {
  return state.data.articles.find(a => a.id === id);
}

function submit() {
  const articleId = form.articleId === "__other__" ? null : form.articleId;
  if (!form.note.trim() && !articleId) {
    ElMessage.warning("请填写具体经过，或选择触犯的条例～");
    return;
  }
  const a = articleById(articleId);
  addMistake({
    date: form.date || today(),
    culprit: form.culprit,
    articleId,
    note: form.note.trim(),
    penalty: form.penalty.trim() || (a && a.penalty !== "\\" ? a.penalty : "")
  });
  form.note = "";
  form.penalty = "";
  form.date = today();
  ElMessage.success("已记录，同步中…");
}
</script>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}
.culprit-group { width: 100%; display: flex; }
.culprit-group :deep(.el-radio-button) { flex: 1; }
.culprit-group :deep(.el-radio-button__inner) { width: 100%; }
.form-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.hint { font-size: 12px; color: var(--ink-soft); }

@media (max-width: 720px) {
  .form-row { grid-template-columns: 1fr; }
  .form-foot { flex-direction: column; align-items: stretch; }
  .form-foot :deep(.el-button) { width: 100%; }
}
</style>
