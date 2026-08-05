<template>
  <HeaderBar />
  <StatsCards />
  <SyncCard />
  <MistakeForm />
  <MistakeLog />
  <ArticlesCard />
  <DailyCheck />
  <FiveSteps />
  <SixHearts />
  <div class="foot">陈氏家法 · 版本 {{ APP_VERSION }}</div>
</template>

<script setup>
import { onMounted } from "vue";
import { APP_VERSION, syncNow, scheduleSync } from "./store";
import HeaderBar from "./components/HeaderBar.vue";
import StatsCards from "./components/StatsCards.vue";
import SyncCard from "./components/SyncCard.vue";
import MistakeForm from "./components/MistakeForm.vue";
import MistakeLog from "./components/MistakeLog.vue";
import ArticlesCard from "./components/ArticlesCard.vue";
import DailyCheck from "./components/DailyCheck.vue";
import FiveSteps from "./components/FiveSteps.vue";
import SixHearts from "./components/SixHearts.vue";

onMounted(() => {
  setTimeout(() => { syncNow(); }, 1200);
  setInterval(() => { syncNow(); }, 60000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") scheduleSync();
  });
});
</script>

<style scoped>
.foot {
  text-align: center;
  color: var(--ink-soft);
  font-size: 12px;
  margin-top: 30px;
  letter-spacing: 1px;
}
</style>
