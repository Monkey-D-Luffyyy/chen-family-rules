<template>
  <el-config-provider :locale="zhCn">
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
    <el-backtop :right="24" :bottom="40" />
  </el-config-provider>
</template>

<script setup>
import { defineAsyncComponent, onMounted } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { APP_VERSION, syncNow, scheduleSync } from "./store";
import HeaderBar from "./components/HeaderBar.vue";
import StatsCards from "./components/StatsCards.vue";
import SyncCard from "./components/SyncCard.vue";
import MistakeForm from "./components/MistakeForm.vue";

const Loading = { template: '<div class="lazy-loading">加载中…</div>' };

const MistakeLog = defineAsyncComponent({ loader: () => import("./components/MistakeLog.vue"), loadingComponent: Loading });
const ArticlesCard = defineAsyncComponent({ loader: () => import("./components/ArticlesCard.vue"), loadingComponent: Loading });
const DailyCheck = defineAsyncComponent({ loader: () => import("./components/DailyCheck.vue"), loadingComponent: Loading });
const FiveSteps = defineAsyncComponent({ loader: () => import("./components/FiveSteps.vue"), loadingComponent: Loading });
const SixHearts = defineAsyncComponent({ loader: () => import("./components/SixHearts.vue"), loadingComponent: Loading });

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

.lazy-loading {
  text-align: center;
  color: var(--ink-soft);
  padding: 40px 0;
  font-size: 14px;
}
</style>
