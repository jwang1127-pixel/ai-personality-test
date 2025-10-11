// report-generator/i18n.js - 中英文对照
const translations = {
  // 维度名称
  dimensions: {
    openness: {
      en: 'Openness',
      zh: '开放性',
      emoji: '🚀'
    },
    conscientiousness: {
      en: 'Conscientiousness',
      zh: '尽责性',
      emoji: '📋'
    },
    extraversion: {
      en: 'Extraversion',
      zh: '外向性',
      emoji: '🗣️'
    },
    agreeableness: {
      en: 'Agreeableness',
      zh: '宜人性',
      emoji: '🤝'
    },
    neuroticism: {
      en: 'Neuroticism',
      zh: '神经质（情绪稳定性）',
      emoji: '🧘'
    }
  },

  // 页面标题
  pageTitle: {
    cover: '大五人格测评报告',
    subtitle: 'OCEAN模型分析',
    tableOfContents: '目录',
    overview: '你的人格概览',
    dimensionsIntro: 'OCEAN五个维度',
    careerRecommendations: '职业推荐',
    developmentPlan: '30天发展计划',
    resources: '资源与下一步'
  },

  // 概览页
  overview: {
    profileTitle: '你的OCEAN档案',
    basedOn: '基于大五人格理论 - 科学验证'
  },

  // 维度介绍
  dimensionIntro: {
    openness: '对新体验和想法的接受程度',
    conscientiousness: '组织能力和目标导向程度',
    extraversion: '从外部互动中获取能量',
    agreeableness: '合作态度和共情水平',
    neuroticism: '情绪调节能力和压力韧性'
  },

  // 分析页标题
  analysis: {
    score: '你的分数',
    category: '类别',
    coreTraits: '核心特质',
    specificBehaviors: '具体行为',
    aiEraGuidance: 'AI时代指导',
    aiEraAdvantages: 'AI时代优势',
    developmentTips: '发展建议'
  },

  // 职业推荐
  career: {
    title: '职业推荐',
    subtitle: '基于你的大五人格档案，这些职业与你的优势高度匹配：',
    match: '匹配度',
    aiImpact: 'AI影响',
    keySkills: '关键技能'
  },

  // 30天计划
  plan: {
    title: '30天发展计划',
    subtitle: '基于你的档案的个性化成长计划：',
    week1: '第1周：自我觉察',
    week2: '第2周：技能培养',
    week3: '第3周：实践与精进',
    week4: '第4周：整合与规划'
  },

  // 资源页
  resourcesPage: {
    title: '资源与下一步',
    subtitle: '用这些资源继续你的发展之旅：',
    books: '书籍',
    onlineCourses: '在线课程',
    aiTools: 'AI工具',
    remember: '记住：',
    reminderText: '你的人格是你的基础，而非你的限制。利用这些洞察来发展你的优势并培养新能力。'
  }
};

// 获取翻译函数
function t(path, lang = 'zh') {
  const keys = path.split('.');
  let value = translations;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return path;
  }
  
  return typeof value === 'object' ? value[lang] || value.en : value;
}

// 获取维度的双语标题
function getDimensionTitle(dimension) {
  const dim = translations.dimensions[dimension];
  if (!dim) return dimension;
  return `${dim.zh} ${dim.en}`;
}

module.exports = {
  translations,
  t,
  getDimensionTitle
};