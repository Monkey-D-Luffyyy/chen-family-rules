<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--green)"></span>
      吾日三省吾身
    </div>

    <div class="daily-head">
      <el-date-picker v-model="currentDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:160px" />
      <span class="daily-progress">今日已完成 <b>{{ doneCount }}</b> / 3</span>
    </div>

    <div class="daily-check">
      <div v-for="q in QUESTIONS" :key="q" class="check-card" :class="{ 'has-bad': form[q].r === 'bad' }">
        <div class="emoji">{{ QUESTION_META[q].emoji }}</div>
        <div class="q">{{ QUESTION_META[q].label }}</div>
        <el-radio-group v-model="form[q].r" class="q-ans" size="small" @change="answer(q, form[q].r)">
          <el-radio-button value="ok">没有 ✓</el-radio-button>
          <el-radio-button value="bad">有 ✗</el-radio-button>
        </el-radio-group>
        <div class="q-detail">
          <el-input v-model="form[q].why" size="small" placeholder="什么原因？" @input="note(q, 'why', form[q].why)" />
          <el-input v-model="form[q].next" size="small" placeholder="下次怎么做？" @input="note(q, 'next', form[q].next)" />
        </div>
      </div>
    </div>

    <div class="daily-stats">
      <div class="d-stat"><b>{{ streak }}</b><span>连续打卡（天）</span></div>
      <div class="d-stat"><b>{{ monthCount }}</b><span>本月打卡（天）</span></div>
    </div>

    <div class="calendar">
      <div class="cal-head">
        <el-button size="small" circle @click="shiftMonth(-1)"><el-icon><ArrowLeft /></el-icon></el-button>
        <span class="cal-title">{{ monthTitle }}</span>
        <el-button size="small" circle @click="shiftMonth(1)"><el-icon><ArrowRight /></el-icon></el-button>
      </div>
      <div class="cal-grid">
        <div class="cal-dow">一</div>
        <div class="cal-dow">二</div>
        <div class="cal-dow">三</div>
        <div class="cal-dow">四</div>
        <div class="cal-dow">五</div>
        <div class="cal-dow">六</div>
        <div class="cal-dow">日</div>
        <div v-for="(cell, i) in calCells" :key="i"
             class="cal-cell"
             :class="{ checked: cell.checked, today: cell.today, other: !cell.day }">
          {{ cell.day }}
        </div>
      </div>
    </div>

    <div class="daily-history">
      <div v-if="!history.length" class="empty">还没有打卡记录，从今天开始吧 🌱</div>
      <div v-for="item in history" :key="item.date" class="dh-item">
        <div class="dh-head">
          <b>{{ item.label }}</b>
          <span>{{ item.answered }}/3</span>
        </div>
        <div v-for="line in item.lines" :key="line.q" class="dh-line" :class="line.good ? 'ok' : 'bad'">
          {{ line.emoji }} {{ line.label }}：{{ line.good ? '没有 ✓' : '有 ✗' }}
          <div v-if="line.bad && (line.why || line.next)" class="dh-notes">
            <template v-if="line.why">原因：{{ line.why }}</template>
            <template v-if="line.why && line.next"> ｜ </template>
            <template v-if="line.next">下次：{{ line.next }}</template>
          </div>
        </div>
      </div>
      <el-button v-if="historyTotal > history.length" size="small" round @click="historyLimit += 14">
        加载更多历史（还有 {{ historyTotal - history.length }} 条）
      </el-button>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { QUESTIONS, QUESTION_META, state, normalizeRec, setDailyAnswer, setDailyNote, today, dateKey, fmtDate } from "../store";

const currentDate = ref(today());
const monthKey = ref(today().slice(0, 7));
const form = reactive({ q1: { r: null, why: "", next: "" }, q2: { r: null, why: "", next: "" }, q3: { r: null, why: "", next: "" } });

function reloadForm() {
  const rec = normalizeRec(state.data.daily[currentDate.value]);
  QUESTIONS.forEach(q => {
    form[q].r = rec[q].r;
    form[q].why = rec[q].why;
    form[q].next = rec[q].next;
  });
}

watch(currentDate, () => {
  monthKey.value = (currentDate.value || today()).slice(0, 7);
  reloadForm();
});

watch(
  () => state.data.daily[currentDate.value],
  () => reloadForm()
);

reloadForm();

const doneCount = computed(() => QUESTIONS.filter(q => form[q].r).length);

function answer(q, ans) {
  setDailyAnswer(currentDate.value, q, ans);
  reloadForm();
}

function note(q, field, value) {
  setDailyNote(currentDate.value, q, field, value);
}

function isCheckedDay(rec) {
  if (!rec) return false;
  return QUESTIONS.some(q => rec[q] && rec[q].r);
}

const streak = computed(() => {
  let n = 0;
  const d = new Date();
  let cur = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (!isCheckedDay(state.data.daily[dateKey(cur)])) cur.setDate(cur.getDate() - 1);
  while (isCheckedDay(state.data.daily[dateKey(cur)])) {
    n++;
    cur.setDate(cur.getDate() - 1);
  }
  return n;
});

const monthCount = computed(() => {
  let n = 0;
  Object.keys(state.data.daily).forEach(k => {
    if (k.indexOf(monthKey.value) === 0 && isCheckedDay(state.data.daily[k])) n++;
  });
  return n;
});

const monthTitle = computed(() => {
  const p = monthKey.value.split("-");
  return p[0] + "年" + parseInt(p[1], 10) + "月";
});

const calCells = computed(() => {
  const p = monthKey.value.split("-");
  const y = parseInt(p[0], 10);
  const m = parseInt(p[1], 10);
  const daysInMonth = new Date(y, m, 0).getDate();
  let dowFirst = new Date(y, m - 1, 1).getDay();
  dowFirst = (dowFirst + 6) % 7;
  const cells = [];
  for (let i = 0; i < dowFirst; i++) cells.push({ day: "", checked: false, today: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    cells.push({ day: d, checked: isCheckedDay(state.data.daily[key]), today: key === today() });
  }
  return cells;
});

function shiftMonth(delta) {
  const p = monthKey.value.split("-");
  const d = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1 + delta, 1);
  monthKey.value = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

const historyLimit = ref(14);

const history = computed(() => {
  return Object.keys(state.data.daily)
    .filter(k => isCheckedDay(state.data.daily[k]))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, historyLimit.value)
    .map(k => {
      const rec = normalizeRec(state.data.daily[k]);
      const answered = QUESTIONS.filter(q => rec[q].r);
      return {
        date: k,
        label: fmtDate(k),
        answered: answered.length,
        lines: answered.map(q => ({
          q,
          emoji: QUESTION_META[q].emoji,
          label: QUESTION_META[q].label,
          good: rec[q].r === "ok",
          why: rec[q].why,
          next: rec[q].next
        }))
      };
    });
});

const historyTotal = computed(() =>
  Object.keys(state.data.daily).filter(k => isCheckedDay(state.data.daily[k])).length
);
</script>

<style scoped>
.daily-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.daily-progress {
  font-size: 13px;
  color: var(--ink-soft);
  margin-left: auto;
}
.daily-progress b { color: #5f9b5d; }

.daily-check {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 14px;
}
.check-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px 12px;
  text-align: center;
  background: #fffdfa;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.check-card:hover {
  border-color: #e0cfba;
  box-shadow: 0 4px 14px rgba(122, 90, 60, .06);
}
.check-card .emoji { font-size: 24px; }
.check-card .q {
  font-size: 13px;
  margin-top: 6px;
  line-height: 1.5;
  color: var(--ink);
}
.q-ans {
  display: flex;
  margin-top: 10px;
}
.q-ans :deep(.el-radio-button) { flex: 1; }
.q-ans :deep(.el-radio-button__inner) { width: 100%; }
.q-ans :deep(.el-radio-button:first-child .el-radio-button__inner) { border-radius: 999px 0 0 999px; }
.q-ans :deep(.el-radio-button:last-child .el-radio-button__inner) { border-radius: 0 999px 999px 0; }
.q-ans :deep(.el-radio-button__inner) { border-color: var(--line); }
.q-detail {
  display: none;
  margin-top: 10px;
  text-align: left;
}
.check-card.has-bad .q-detail { display: block; }
.q-detail :deep(.el-input) { margin-top: 6px; }

.daily-stats {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.d-stat {
  flex: 1;
  background: var(--green-bg);
  border: 1px solid #d4e7d0;
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
}
.d-stat b { font-size: 24px; color: #5f9b5d; display: block; line-height: 1.2; }
.d-stat span { font-size: 12px; color: var(--ink-soft); }

.calendar {
  margin-top: 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px;
  background: #fffdfa;
}
.cal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.cal-title { font-size: 13px; font-weight: 700; }
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}
.cal-dow {
  font-size: 10px;
  color: var(--ink-soft);
  text-align: center;
  padding: 1px 0;
}
.cal-cell {
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border-radius: 6px;
  color: var(--ink-soft);
}
.cal-cell.checked {
  background: var(--green-bg);
  color: #4e7e4c;
  font-weight: 700;
}
.cal-cell.today { outline: 2px solid var(--green); outline-offset: -1px; }
.cal-cell.other { visibility: hidden; }

.daily-history {
  margin-top: 16px;
  border-top: 1px dashed var(--line);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dh-item {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  background: #fffdfa;
}
.dh-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 6px;
}
.dh-head span { font-size: 11px; color: var(--ink-soft); }
.dh-line {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.7;
}
.dh-line.ok { color: #4e7e4c; }
.dh-line.bad { color: #c45b6e; }
.dh-notes { color: var(--ink-soft); }
.empty {
  text-align: center;
  color: var(--ink-soft);
  padding: 12px 0;
  font-size: 14px;
}

@media (max-width: 720px) {
  .daily-check { grid-template-columns: 1fr; }
  .check-card { padding: 14px; }
}
</style>
