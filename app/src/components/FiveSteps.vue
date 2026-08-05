<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--gold)"></span>
      五步走战略
    </div>
    <el-steps :active="1" align-center class="steps">
      <el-step v-for="(s, i) in steps" :key="i" :title="s" />
    </el-steps>
  </section>
</template>

<script setup>
const steps = ["这话说的对吗", "这话说得好听吗", "这话能说吗", "以后还说吗", "是不是乖宝宝"];
</script>

<style scoped>
@media (max-width: 720px) {
  .steps :deep(.el-step__title) { font-size: 12px; }
}
</style>
