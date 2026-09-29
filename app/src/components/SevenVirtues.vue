<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--purple)"></span>
      七词之约
    </div>
    <div class="chips">
      <el-tag v-for="v in virtues" :key="v" size="large" effect="light" round class="chip">{{ v }}</el-tag>
    </div>
  </section>
</template>

<script setup>
const virtues = ["承诺", "诚挚", "尊重", "宽容", "享受", "珍惜", "信任"];
</script>

<style scoped>
.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.chip {
  background: var(--purple-bg);
  color: #7b4f9d;
  border-color: #e2d0ef;
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
