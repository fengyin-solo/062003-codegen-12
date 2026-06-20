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
        <span v-if="sentimentLogs.length" class="badge info">{{ sentimentLogs.length }}</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'debug' }"
        @click="activeTab = 'debug'"
      >
        🔧 调试
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
              {{ rumor.severity }}
            </span>
          </div>
          <p class="rumor-desc">{{ rumor.description }}</p>
          <div class="rumor-meta">
            <span>爆发日：第 {{ rumor.startDay }} 天</span>
            <span v-if="rumor.response">已回应：{{ getStrategyLabel(rumor.response) }}</span>
          </div>
          <div class="rumor-impact">
            <span class="impact-item">📊 粉丝流失率：{{ (rumor.fansLossRate * 100).toFixed(1) }}%</span>
            <span class="impact-item">📉 声誉影响：-{{ rumor.reputationLoss }}</span>
            <span class="impact-item">💔 信任影响：-{{ rumor.trustLoss }}</span>
          </div>
          <div class="response-strategies">
            <button
              v-for="(strategy, key) in strategies"
              :key="key"
              class="strategy-btn"
              :class="{ disabled: money < strategy.cost }"
              :disabled="money < strategy.cost"
              @click="onRespond(rumor.id, key)"
              :title="strategy.description + '\n风险：反咬几率 ' + (strategy.risk.backfireChance * 100) + '%'"
            >
              <span class="strategy-icon">{{ strategy.icon }}</span>
              <span class="strategy-label">{{ strategy.label }}</span>
              <span class="strategy-cost">¥{{ strategy.cost.toLocaleString() }}</span>
              <span class="strategy-effect">
                效果：严重度 -{{ strategy.effect.severityReduce[0] }}~{{ strategy.effect.severityReduce[1] }}
              </span>
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
          <span class="history-day">D{{ log.day }}</span>
          <span class="history-type">
            {{ log.type === 'rumor' ? '🚨 传闻' : log.type === 'response' ? '📢 回应' : '💝 安抚' }}
          </span>
          <span class="history-text">{{ log.text }}</span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'debug'" class="tab-content">
      <div class="debug-section">
        <h4>🔧 链路验证工具</h4>
        <p class="debug-hint">
          使用以下工具验证完整对抗链路：<br/>
          <strong>触发传闻 → 声明回应 → 粉丝安抚 → 查看记录</strong>
        </p>
        
        <div class="debug-group">
          <h5>📣 手动触发传闻</h5>
          <div class="debug-buttons">
            <button
              v-for="(rumor, key) in rumorTypes"
              :key="key"
              class="btn sm debug-btn"
              @click="onTriggerRumor(key)"
              :title="rumor.description"
            >
              {{ rumor.icon }} {{ rumor.label }}
            </button>
          </div>
        </div>

        <div class="debug-group">
          <h5>⚡ 快捷操作</h5>
          <div class="debug-buttons">
            <button class="btn sm" @click="onResolveAll">✅ 解决全部传闻</button>
            <button class="btn sm" @click="onClearLogs">🗑️ 清空舆情记录</button>
          </div>
        </div>

        <div class="debug-group">
          <h5>📊 当前状态快照</h5>
          <div class="state-snapshot">
            <div class="snapshot-item">
              <span>日程安排：</span>
              <code>{{ JSON.stringify(currentSchedule) }}</code>
            </div>
            <div class="snapshot-item">
              <span>活跃传闻数：</span>
              <code>{{ activeRumors.length }}</code>
            </div>
            <div class="snapshot-item">
              <span>舆情记录数：</span>
              <code>{{ sentimentLogs.length }}</code>
            </div>
            <div class="snapshot-item">
              <span>当前资金：</span>
              <code>¥{{ money.toLocaleString() }}</code>
            </div>
            <div class="snapshot-item">
              <span>当前粉丝：</span>
              <code>{{ fans.toLocaleString() }}</code>
            </div>
          </div>
        </div>

        <div class="debug-group">
          <h5>🔗 验证流程指引</h5>
          <ol class="flow-guide">
            <li><strong>检查日程状态</strong>：确认上方日程安排为空，首次进入无残留</li>
            <li><strong>安排日程</strong>：为几位练习生选择活动，确认按钮正确高亮</li>
            <li><strong>点击清空</strong>：确认所有按钮恢复未选中状态</li>
            <li><strong>重新排班</strong>：再次选择活动，确认显示当前真实选择</li>
            <li><strong>触发传闻</strong>：在上方选择一种传闻类型触发</li>
            <li><strong>声明回应</strong>：在「传闻处理」中选择策略回应</li>
            <li><strong>粉丝安抚</strong>：在「粉丝安抚」中选择安抚方式</li>
            <li><strong>查看记录</strong>：在「舆情记录」中确认完整链路</li>
          </ol>
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

const emit = defineEmits(['respond-rumor', 'comfort-fans', 'trigger-rumor', 'clear-sentiment-logs', 'resolve-all-rumors'])

const activeTab = ref('rumors')
const strategies = GAME_CONFIG.sentiment.responseStrategies
const comfortActions = GAME_CONFIG.sentiment.comfortActions
const rumorTypes = GAME_CONFIG.sentiment.rumorTypes

const reputation = computed(() => props.state?.reputation ?? GAME_CONFIG.sentiment.initialReputation)
const trust = computed(() => props.state?.trust ?? GAME_CONFIG.sentiment.initialTrust)
const fans = computed(() => props.state?.fans ?? 0)
const activeRumors = computed(() => (props.state?.rumors ?? []).filter((r) => !r.resolved))
const sentimentLogs = computed(() => props.state?.sentimentLogs ?? [])
const reversedLogs = computed(() => [...sentimentLogs.value].reverse().slice(0, 50))
const currentSchedule = computed(() => props.state?.schedule ?? {})

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

function onTriggerRumor(rumorType) {
  emit('trigger-rumor', rumorType)
}

function onClearLogs() {
  if (confirm('确定清空所有舆情记录？')) {
    emit('clear-sentiment-logs')
  }
}

function onResolveAll() {
  if (confirm('确定标记所有传闻为已解决？')) {
    emit('resolve-all-rumors')
  }
}
</script>

<style scoped>
.sentiment-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 650px;
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
  flex-wrap: wrap;
}

.tab-btn {
  flex: 1;
  min-width: 70px;
  padding: 0.4rem 0.6rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.78rem;
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
  font-size: 0.65rem;
  min-width: 16px;
  text-align: center;
  line-height: 1.4;
}

.badge.info {
  background: var(--accent);
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
  min-width: 36px;
  text-align: center;
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

.rumor-impact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
  padding: 0.4rem;
  background: var(--bg-card);
  border-radius: 6px;
}

.impact-item {
  font-size: 0.7rem;
  color: var(--text-secondary);
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
  gap: 0.1rem;
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
  font-size: 0.72rem;
  color: var(--text-primary);
  font-weight: 500;
}

.strategy-cost {
  font-size: 0.62rem;
  color: var(--text-muted);
}

.strategy-effect {
  font-size: 0.6rem;
  color: var(--accent);
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
  min-width: 40px;
  font-weight: 600;
}

.history-type {
  min-width: 55px;
  font-size: 0.7rem;
}

.history-text {
  flex: 1;
  color: var(--text-secondary);
}

.debug-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.25rem 0;
}

.debug-section h4 {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0;
}

.debug-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--accent-soft);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  line-height: 1.5;
}

.debug-hint strong {
  color: var(--accent);
}

.debug-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.debug-group h5 {
  font-size: 0.8rem;
  color: var(--text-primary);
  margin: 0;
}

.debug-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.debug-btn {
  font-size: 0.75rem;
}

.state-snapshot {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.snapshot-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.snapshot-item code {
  background: var(--bg-card);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.72rem;
  color: var(--accent);
}

.flow-guide {
  margin: 0;
  padding-left: 1.2rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.flow-guide li strong {
  color: var(--text-primary);
}

.flow-guide code {
  background: var(--bg-card);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.72rem;
  color: var(--accent);
}
</style>
