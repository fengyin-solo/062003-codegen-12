/**
 * 偶像养成事务所 — 全部数值规则集中配置
 * 调整平衡性时只需修改此文件
 */
export const GAME_CONFIG = {
  // ── 胜利 / 失败条件 ──
  victory: {
    targetGroups: 3,        // 需培养出道组合数
    totalDays: 1095,        // 3 年（天）
    requirePositiveProfit: true,
  },

  // ── 初始资源 ──
  initial: {
    money: 80000,
    fans: 200,
    traineeCount: 5,
    statMin: 18,
    statMax: 42,
    fatigue: 10,
    stress: 8,
  },

  // ── 五维属性键名 ──
  stats: ['vocal', 'dance', 'rap', 'looks', 'charm'],
  statLabels: {
    vocal: '唱功',
    dance: '舞蹈',
    rap: '说唱',
    looks: '颜值',
    charm: '魅力',
  },

  // ── 日程活动 ──
  activities: {
    vocal: {
      label: '声乐课',
      icon: '🎤',
      statGain: { vocal: [4, 7] },
      fatigue: [10, 14],
      stress: [2, 4],
      moneyCost: 400,
      requiresTraining: true,
    },
    dance: {
      label: '舞蹈课',
      icon: '💃',
      statGain: { dance: [4, 7] },
      fatigue: [12, 16],
      stress: [2, 4],
      moneyCost: 400,
      requiresTraining: true,
    },
    rap: {
      label: '说唱课',
      icon: '🎧',
      statGain: { rap: [4, 7] },
      fatigue: [10, 14],
      stress: [3, 5],
      moneyCost: 400,
      requiresTraining: true,
    },
    physical: {
      label: '体能训练',
      icon: '🏋️',
      statGain: { dance: [1, 3], looks: [0, 1] },
      fatigue: [6, 10],
      stress: [-2, 0],
      moneyCost: 250,
      requiresTraining: true,
    },
    rest: {
      label: '休息',
      icon: '😴',
      statGain: {},
      fatigue: [-28, -18],
      stress: [-10, -5],
      moneyCost: 0,
      requiresTraining: false,
    },
    pr: {
      label: '公关活动',
      icon: '📸',
      statGain: { charm: [2, 4], looks: [1, 3] },
      fatigue: [5, 8],
      stress: [6, 14],
      fansGain: [80, 250],
      moneyCost: 1200,
      requiresTraining: false,
    },
  },

  // ── 疲劳 / 压力阈值 ──
  thresholds: {
    fatigueExhausted: 75,   // 训练效果减半
    fatigueCollapse: 92,    // 强制休息
    stressHigh: 65,         // 训练效果 -20%
    stressBreakdown: 88,    // 当天无法训练
    statCap: 100,
  },

  // ── 每日运营成本 ──
  dailyCosts: {
    baseOperatingCost: 600,
    perTraineeCost: 250,
    perDebutedCost: 800,
    perGroupCost: 500,
  },

  // ── 周末内部评级 ──
  rating: {
    interval: 7,
    debutScoreThreshold: 58,  // 综合评分达标可出道
    minGroupSize: 2,
    maxGroupSize: 5,
    scoreWeights: {
      vocal: 0.22,
      dance: 0.22,
      rap: 0.16,
      looks: 0.2,
      charm: 0.2,
    },
  },

  // ── 单曲发行 ──
  single: {
    creationCost: 15000,
    baseSales: 800,
    statWeight: 0.45,
    fansWeight: 0.35,
    charmWeight: 0.2,
    revenuePerSale: 6,
    cooldownDays: 30,
  },

  // ── 练习生关系 ──
  relationships: {
    min: -100,
    max: 100,
    synergyThreshold: 55,       // 默契线
    competitionThreshold: -35,    // 竞争线
    synergyBonus: 0.25,           // 默契训练加成
    competitionStress: [12, 22],
    dailyDrift: [-3, 3],
    trainingTogether: [4, 9],
    statGapCompetition: 18,
    initialRange: [-15, 25],
  },

  // ── 随机事件 ──
  events: {
    dailyChance: 0.18,
    types: {
      negative_news: {
        label: '负面新闻',
        weight: 22,
        fansLoss: [150, 600],
        stressGain: [8, 18],
        description: '媒体曝出练习生训练期间发生冲突，粉丝舆论下滑。',
      },
      poaching: {
        label: '挖角危机',
        weight: 14,
        successChance: 0.28,
        description: '竞争对手试图挖走你旗下最有潜力的练习生！',
      },
      illness: {
        label: '生病',
        weight: 20,
        duration: [2, 4],
        statDecay: [1, 3],
        stressGain: [5, 10],
        description: '一名练习生身体不适，需要休养。',
      },
      inspiration: {
        label: '灵感爆发',
        weight: 22,
        statBoost: [6, 14],
        description: '一名练习生突然迸发出创作灵感，能力大幅提升！',
      },
      fan_surge: {
        label: '粉丝暴涨',
        weight: 22,
        fansGain: [300, 900],
        description: '一段练习室花絮意外走红，粉丝数激增！',
      },
    },
  },

  // ── 练习生名字池 ──
  names: [
    '林星遥', '苏晚晴', '陈予安', '顾念初', '沈知夏',
    '江月白', '陆清欢', '唐小满', '许未央', '韩鹿鸣',
    '方念慈', '宋时雨', '叶知秋', '周慕青', '赵星河',
  ],

  // ── 舆情中心 ──
  sentiment: {
    initialReputation: 70,
    initialTrust: 75,
    reputationMin: 0,
    reputationMax: 100,
    trustMin: 0,
    trustMax: 100,
    dailyChance: 0.15,
    rumorDecayPerDay: 8,

    rumorTypes: {
      dating_rumor: {
        label: '恋爱传闻',
        icon: '💔',
        severity: [30, 55],
        fansLossRate: [0.08, 0.18],
        reputationLoss: [10, 20],
        trustLoss: [8, 16],
        description: '练习生被拍到与异性亲密接触，恋爱传闻满天飞！',
      },
      bullying_rumor: {
        label: '霸凌传闻',
        icon: '😤',
        severity: [50, 80],
        fansLossRate: [0.15, 0.3],
        reputationLoss: [18, 30],
        trustLoss: [15, 28],
        description: '匿名爆料称练习生涉嫌霸凌队友，舆论哗然！',
      },
      plagiarism_rumor: {
        label: '抄袭传闻',
        icon: '📝',
        severity: [40, 65],
        fansLossRate: [0.1, 0.22],
        reputationLoss: [14, 25],
        trustLoss: [12, 22],
        description: '作品被质疑抄袭他人创意，原创性遭受质疑！',
      },
      attitude_rumor: {
        label: '态度争议',
        icon: '😒',
        severity: [20, 45],
        fansLossRate: [0.05, 0.12],
        reputationLoss: [6, 15],
        trustLoss: [5, 12],
        description: '被指责在公开场合态度傲慢不敬业，引发粉丝不满！',
      },
      sasaeng_rumor: {
        label: '私生风波',
        icon: '📷',
        severity: [25, 50],
        fansLossRate: [0.06, 0.15],
        reputationLoss: [8, 18],
        trustLoss: [6, 14],
        description: '私生饭追堵曝光私生活，事务所安保措施遭质疑！',
      },
    },

    responseStrategies: {
      deny: {
        label: '强硬否认',
        icon: '✊',
        cost: 3000,
        effect: { severityReduce: [15, 30], trustGain: [5, 12], reputationGain: [3, 8] },
        risk: { backfireChance: 0.25, backfireSeverityAdd: [10, 20] },
        description: '发布严正声明，坚决否认传闻。',
      },
      admit: {
        label: '诚恳道歉',
        icon: '🙇',
        cost: 5000,
        effect: { severityReduce: [25, 45], trustGain: [10, 20], reputationGain: [8, 15] },
        risk: { backfireChance: 0.1, backfireSeverityAdd: [5, 10] },
        description: '承认失误并公开道歉，争取公众谅解。',
      },
      legal: {
        label: '法律声明',
        icon: '⚖️',
        cost: 12000,
        effect: { severityReduce: [35, 60], trustGain: [15, 25], reputationGain: [12, 22] },
        risk: { backfireChance: 0.05, backfireSeverityAdd: [0, 5] },
        description: '发律师函，追究造谣者法律责任。',
      },
      silence: {
        label: '沉默冷处理',
        icon: '🤫',
        cost: 0,
        effect: { severityReduce: [5, 15], trustGain: [-5, 2], reputationGain: [-3, 3] },
        risk: { backfireChance: 0.35, backfireSeverityAdd: [15, 30] },
        description: '不做任何回应，等待风波平息。',
      },
    },

    comfortActions: {
      livestream: {
        label: '粉丝直播',
        icon: '📺',
        cost: 2000,
        fansGain: [200, 500],
        trustGain: [5, 12],
        fatigueAdd: [8, 15],
        description: '组织练习生进行粉丝互动直播。',
      },
      fanmeeting: {
        label: '粉丝见面会',
        icon: '🤝',
        cost: 8000,
        fansGain: [500, 1200],
        trustGain: [12, 22],
        fatigueAdd: [15, 25],
        description: '举办线下粉丝见面会，面对面交流。',
      },
      freesong: {
        label: '发布免费曲',
        icon: '🎵',
        cost: 5000,
        fansGain: [300, 800],
        trustGain: [8, 18],
        fatigueAdd: [10, 18],
        description: '免费发布一首新曲回馈粉丝。',
      },
      photocard: {
        label: '周边福利',
        icon: '🎁',
        cost: 3500,
        fansGain: [250, 600],
        trustGain: [6, 14],
        fatigueAdd: [3, 8],
        description: '发放限量签名周边，安抚粉丝情绪。',
      },
    },
  },

  // ── 存档 ──
  storage: {
    savesKey: 'idol-agency-saves-v1',
    themeKey: 'idol-agency-theme',
    maxSlots: 5,
  },
}
