<template>
  <section class="card">
    <div class="sec-title">
      <span class="dot" style="background:var(--gold)"></span>
      五步走战略
    </div>
    <div class="flow">
      <div v-for="(s, i) in steps" :key="i" class="step">
        <div class="sno">{{ i + 1 }}</div>
        <div class="stext">{{ s }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = ["这话说的对吗", "这话说得好听吗", "这话能说吗", "以后还说吗", "是不是乖宝宝"];
</script>

<style scoped>
.flow {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.step {
  background: var(--green-bg);
  border: 1px solid #d4e7d0;
  border-radius: 14px;
  padding: 14px 8px;
  text-align: center;
  position: relative;
}
.step .sno {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--green);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}
.step .stext { font-size: 14px; line-height: 1.5; }
.step:not(:last-child)::after {
  content: "→";
  position: absolute;
  right: -11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gold);
  font-weight: 800;
  z-index: 1;
}

@media (max-width: 720px) {
  .flow { grid-template-columns: 1fr; gap: 16px; }
  .step { padding: 16px 12px; }
  .step:not(:last-child)::after {
    content: "↓";
    right: auto;
    left: 50%;
    top: auto;
    bottom: -14px;
    transform: translateX(-50%);
  }
}
</style>
