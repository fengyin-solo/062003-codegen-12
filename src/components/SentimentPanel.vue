<template>
  <div class="sentiment-panel card">
    <div class="panel-header">
      <h3>📰 舆情中心</h3>
      <div class="sentiment-stats">
        <div class="stat-item">
          <span class="stat-label">事务所声誉</span>
          <div class="stat-bar">
            <div
              class="stat-fill reputation"
              :style="{ width: reputation + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ reputation }}/100</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">粉丝信任度</span>
          <div class="stat-bar">
            <div
              class="stat-fill trust"
              :style="{ width: trust + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ trust }}/100</span>
        </div>
      </div>
    </div>

    <div class="panel-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'rumors' }"
        @click="activeTab = 'rumors'"
      >
        🚨 传闻处理
        <span v-if="activeRumors.length" class="badge">{{ activeRumors.length }}</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'comfort' }"
        @click="activeTab = 'comfort'"
      >
        💝 粉丝安抚
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        📜 舆情记录
      </button>
    </div>

    <div v-if="activeTab === 'rumors'" class="tab-content">
      <div v-if="activeRumors.length === 0" class="empty-state">
        <span class="empty-icon">✨</span>
        <p>暂无负面传闻，舆情平稳。</p>
      </div>
      <div v-else class="rumor-list">
        <div
          v-for="rumor in activeRumors"
          :key="rumor.id"
          class="rumor-card"
          :class="getSeverityClass(rumor.severity)"
        >
          <div class="rumor-header">
            <span class="rumor-icon">{{ rumor.icon }}</span>
            <div class="rumor-title">
              <h4>{{ rumor.label }}</h4>
              <span class="rumor-target" v-if="rumor.targetName">涉及：{{ rumor.targetName }}</span>
            </div>
            <span class="severity-tag" :class="getSeverityClass(rumor.severity)">
              严重度 {{ rumor.severity }}
            </span>
          </div>
          <p class="rumor-desc">{{ rumor.description }}</p>
          <div class="rumor-meta">
            <span>爆发日：第 {{ rumor.startDay }} 天</span>
            <span v-if="rumor.response">已回应：{{ getStrategyLabel(rumor.response) }}</span>
          </div>
          <div class="response-strategies">
            <button
              v-for="(strategy, key) in strategies"
              :key="key"
              class="strategy-btn"
              :class="{ disabled: money < strategy.cost }"
              :disabled="money < strategy.cost"
              @click="onRespond(rumor.id, key)"
              :title="strategy.description"
            >
              <span class="strategy-icon">{{ strategy.icon }}</span>
              <span class="strategy-label">{{ strategy.label }}</span>
              <span class="strategy-cost">¥{{ strategy.cost.toLocaleString() }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'comfort'" class="tab-content">
      <div class="comfort-list">
        <button
          v-for="(action, key) in comfortActions"
          :key="key"
          class="comfort-btn"
          :class="{ disabled: money < action.cost }"
          :disabled="money < action.cost"
          @click="onComfort(key)"
        >
          <span class="comfort-icon">{{ action.icon }}</span>
          <div class="comfort-info">
            <h4>{{ action.label }}</h4>
            <p class="comfort-desc">{{ action.description }}</p>
            <div class="comfort-effects">
              <span class="effect-tag good">粉丝 +{{ action.fansGain[0] }}~{{ action.fansGain[1] }}</span>
              <span class="effect-tag good">信任 +{{ action.trustGain[0] }}~{{ action.trustGain[1] }}</span>
              <span class="effect-tag bad">疲劳 +{{ action.fatigueAdd[0] }}~{{ action.fatigueAdd[1] }}</span>
            </div>
          </div>
          <span class="comfort-cost">¥{{ action.cost.toLocaleString() }}</span>
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'history'" class="tab-content">
      <div v-if="!sentimentLogs || sentimentLogs.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无舆情记录。</p>
      </div>
      <div v-else class="history-list">
        <div
          v-for="(log, idx) in reversedLogs"
          :key="idx"
          class="history-item"
          :class="log.type"
        >
          <span class="history-day">第 {{ log.day }} 天</span>
          <span class="history-type">
            {{ log.type === 'rumor' ? '🚨 传闻' : log.type === 'response' ? '📢 回应' : '💝 安抚' }}
          </span>
          <span class="history-text">{{ log.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GAME_CONFIG } from '../config/gameConfig'

const props = defineProps({
  state: Object,
  money: Number,
})

const emit = defineEmits(['respond-rumor', 'comfort-fans'])

const activeTab = ref('rumors')
const strategies = GAME_CONFIG.sentiment.responseStrategies
const comfortActions = GAME_CONFIG.sentiment.comfortActions

const reputation = computed(() => props.state?.reputation ?? GAME_CONFIG.sentiment.initialReputation)
const trust = computed(() => props.state?.trust ?? GAME_CONFIG.sentiment.initialTrust)
const activeRumors = computed(() => (props.state?.rumors ?? []).filter((r) => !r.resolved))
const sentimentLogs = computed(() => props.state?.sentimentLogs ?? [])
const reversedLogs = computed(() => [...sentimentLogs.value].reverse().slice(0, 30))

function getSeverityClass(severity) {
  if (severity >= 65) return 'critical'
  if (severity >= 40) return 'warning'
  return 'mild'
}

function getStrategyLabel(key) {
  return strategies[key]?.label ?? key
}

function onRespond(rumorId, strategyKey) {
  emit('respond-rumor', rumorId, strategyKey)
}

function onComfort(actionKey) {
  emit('comfort-fans', actionKey)
}
</script>

<style scoped>
.sentiment-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow: hidden;
}

.panel-header h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.sentiment-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 70px;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.stat-fill.reputation {
  background: linear-gradient(90deg, var(--danger), var(--warning), var(--success));
}

.stat-fill.trust {
  background: linear-gradient(90deg, var(--accent), var(--success));
}

.stat-value {
  font-size: 0.75rem;
  color: var(--text-muted);
  min-width: 50px;
  text-align: right;
}

.panel-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.4rem 0.6rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  border-radius: 6px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.tab-btn:hover {
  background: var(--bg-secondary);
}

.tab-btn.active {
  background: var(--accent-soft);
  color: var(--accent);
}

.badge {
  background: var(--danger);
  color: white;
  padding: 0 0.35rem;
  border-radius: 10px;
  font-size: 0.7rem;
  min-width: 18px;
  text-align: center;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.25rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: var(--text-muted);
  gap: 0.5rem;
}

.empty-icon {
  font-size: 2rem;
}

.empty-state p {
  font-size: 0.85rem;
}

.rumor-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rumor-card {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
}

.rumor-card.critical {
  border-color: var(--danger);
  background: var(--danger-soft);
}

.rumor-card.warning {
  border-color: var(--warning);
}

.rumor-card.mild {
  border-color: var(--border);
}

.rumor-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.rumor-icon {
  font-size: 1.5rem;
}

.rumor-title {
  flex: 1;
}

.rumor-title h4 {
  font-size: 0.9rem;
  margin: 0;
  color: var(--text-primary);
}

.rumor-target {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.severity-tag {
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
}

.severity-tag.critical {
  background: var(--danger);
  color: white;
}

.severity-tag.warning {
  background: var(--warning);
  color: white;
}

.severity-tag.mild {
  background: var(--accent);
  color: white;
}

.rumor-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.rumor-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.response-strategies {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
}

.strategy-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.5rem 0.3rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s;
}

.strategy-btn:hover:not(.disabled) {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.strategy-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.strategy-icon {
  font-size: 1.1rem;
}

.strategy-label {
  font-size: 0.75rem;
  color: var(--text-primary);
}

.strategy-cost {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.comfort-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comfort-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.comfort-btn:hover:not(.disabled) {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.comfort-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.comfort-icon {
  font-size: 1.8rem;
}

.comfort-info {
  flex: 1;
}

.comfort-info h4 {
  font-size: 0.9rem;
  margin: 0 0 0.2rem 0;
  color: var(--text-primary);
}

.comfort-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 0.3rem 0;
}

.comfort-effects {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.effect-tag {
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.65rem;
}

.effect-tag.good {
  background: var(--success-soft);
  color: var(--success);
}

.effect-tag.bad {
  background: var(--danger-soft);
  color: var(--danger);
}

.comfort-cost {
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: bold;
  white-space: nowrap;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  background: var(--bg-secondary);
  font-size: 0.78rem;
}

.history-item.rumor {
  border-left: 3px solid var(--danger);
}

.history-item.response {
  border-left: 3px solid var(--accent);
}

.history-item.comfort {
  border-left: 3px solid var(--success);
}

.history-day {
  color: var(--text-muted);
  min-width: 55px;
}

.history-type {
  min-width: 60px;
  font-size: 0.72rem;
}

.history-text {
  flex: 1;
  color: var(--text-secondary);
}
</style>
