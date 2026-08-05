<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--pink)"></span>
      六心
    </div>
    <div class="chips">
      <el-tag v-for="h in hearts" :key="h" size="large" effect="light" round class="chip">{{ h }}</el-tag>
    </div>
  </section>
</template>

<script setup>
const hearts = ["真心", "关心", "细心", "耐心", "衷心", "良心"];
</script>

<style scoped>
.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.chip {
  background: var(--pink-bg);
  color: #c45b6e;
  border-color: #f5cdd4;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 9px 18px;
}

@media (max-width: 720px) {
  .chips { gap: 8px; }
  .chip {
    flex: 1 1 calc(33% - 8px);
    justify-content: center;
    font-size: 14px;
    padding: 8px 14px;
  }
}
</style>
