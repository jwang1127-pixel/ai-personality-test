// 职业推荐生成器（双语版本）
function generateCareerRecommendations(scores) {
  const careers = [
    {
      title: 'AI Research Scientist / AI 研究科学家',
      titleZh: 'AI 研究科学家',
      titleEn: 'AI Research Scientist',
      match: Math.round((scores.openness * 0.4 + scores.conscientiousness * 0.3 + (100 - scores.neuroticism) * 0.3) / 10) * 10,
      descriptionZh: '您的创新思维和严谨态度使您非常适合AI前沿研究',
      descriptionEn: 'Your innovative thinking and rigorous approach make you well-suited for cutting-edge AI research',
      aiImpactZh: '领导AI突破性研究项目',
      aiImpactEn: 'Lead breakthrough AI research projects',
      skills: ['Deep Learning', 'Research Methodology', 'Python']
    },
    {
      title: 'Product Manager / 产品经理',
      titleZh: '产品经理',
      titleEn: 'Product Manager',
      match: Math.round((scores.extraversion * 0.3 + scores.agreeableness * 0.3 + scores.conscientiousness * 0.4) / 10) * 10,
      descriptionZh: '您的沟通能力和组织能力使您擅长协调团队和推动项目',
      descriptionEn: 'Your communication and organizational skills make you excel at coordinating teams and driving projects',
      aiImpactZh: '使用AI洞察优化产品决策',
      aiImpactEn: 'Use AI insights to optimize product decisions',
      skills: ['Strategic Planning', 'Communication', 'Data Analysis']
    },
    {
      title: 'Data Scientist / 数据科学家',
      titleZh: '数据科学家',
      titleEn: 'Data Scientist',
      match: Math.round((scores.openness * 0.3 + scores.conscientiousness * 0.4 + (100 - scores.neuroticism) * 0.3) / 10) * 10,
      descriptionZh: '您的分析思维和技术能力使您在数据驱动决策中表现出色',
      descriptionEn: 'Your analytical thinking and technical abilities enable you to excel in data-driven decision making',
      aiImpactZh: '利用AI和ML构建预测模型',
      aiImpactEn: 'Leverage AI and ML to build predictive models',
      skills: ['Statistics', 'Machine Learning', 'SQL']
    }
  ];

  return careers.sort((a, b) => b.match - a.match).slice(0, 3);
}

// 资源推荐生成器（固定版本 - MVP）
function generateResources() {
  return {
    books: [
      '《安静：内向性格的竞争力》- Susan Cain\nQuiet: The Power of Introverts - Susan Cain',
      '《深度工作》- Cal Newport\nDeep Work - Cal Newport',
      '《原则》- Ray Dalio\nPrinciples - Ray Dalio'
    ],
    courses: [
      '积极心理学 (Coursera)\nPositive Psychology (Coursera)',
      '情商培养 (LinkedIn Learning)\nEmotional Intelligence (LinkedIn Learning)',
      'AI时代的个人品牌 (Udemy)\nPersonal Branding in AI Era (Udemy)'
    ],
    aiTools: [
      'Claude.ai - AI思考伙伴\nClaude.ai - AI thinking partner',
      'Notion AI - 知识管理\nNotion AI - Knowledge management',
      'Grammarly - 沟通增强\nGrammarly - Communication enhancement'
    ]
  };
}

/**
 * 根据用户的五大人格得分生成30天发展计划（双语版本）
 */
function generate30DayPlan(scores) {
  const {
    openness = 50,
    conscientiousness = 50,
    extraversion = 50,
    agreeableness = 50,
    neuroticism = 50
  } = scores;

  // 分析优势和待发展领域
  const analysis = analyzeProfile(scores);
  
  const plan = {
    week1: {
      title: 'Week 1: 自我认知与基线建立 / Self-Awareness & Baseline',
      goals: [
        '每天花10分钟记录情绪和行为模式日志，使用笔记或AI助手\nSpend 10 minutes daily documenting emotional and behavioral patterns using notes or AI assistants',
        '完成完整的自我评估：列出5个核心优势和3个改进领域\nComplete a comprehensive self-assessment: list 5 core strengths and 3 areas for improvement',
        '设定本月的3个SMART目标（具体、可衡量、可达成、相关、有时限）\nSet 3 SMART goals for the month (Specific, Measurable, Achievable, Relevant, Time-bound)',
        '与AI工具（ChatGPT/Claude）进行每日反思对话，探索行为模式\nEngage in daily reflection conversations with AI tools (ChatGPT/Claude) to explore behavioral patterns'
      ]
    },
    week2: {
      title: 'Week 2: 优势强化与技能深化 / Strengthen Your Strengths & Deepen Skills',
      goals: generateWeek2Goals(analysis.strengths, scores)
    },
    week3: {
      title: 'Week 3: 弱项提升与突破舒适区 / Address Weaknesses & Push Beyond Comfort Zone',
      goals: generateWeek3Goals(analysis.weaknesses, scores)
    },
    week4: {
      title: 'Week 4: 整合实践与未来规划 / Integration & Future Planning',
      goals: [
        '回顾30天进展：评估3个目标的达成率，记录关键收获\nReview 30-day progress: assess achievement rate of 3 goals, document key takeaways',
        '识别最有效的3个个人发展策略，形成可复用的方法论\nIdentify the 3 most effective personal development strategies, form reusable methodologies',
        '制定下季度（90天）长期发展计划，设定里程碑\nDevelop next quarter (90-day) long-term development plan, set milestones',
        '庆祝进步：给自己一个奖励，并分享经验给他人\nCelebrate progress: reward yourself and share experiences with others',
        '使用AI工具生成个人发展报告，可视化您的成长轨迹\nUse AI tools to generate personal development report, visualize your growth trajectory'
      ]
    }
  };

  return plan;
}

/**
 * 分析用户画像，识别优势和待发展领域
 */
function analyzeProfile(scores) {
  const strengths = [];
  const weaknesses = [];
  
  if (scores.openness > 65) strengths.push('openness_high');
  else if (scores.openness < 35) weaknesses.push('openness_low');
  
  if (scores.conscientiousness > 65) strengths.push('conscientiousness_high');
  else if (scores.conscientiousness < 35) weaknesses.push('conscientiousness_low');
  
  if (scores.extraversion > 65) strengths.push('extraversion_high');
  else if (scores.extraversion < 35) weaknesses.push('extraversion_low');
  
  if (scores.agreeableness > 65) strengths.push('agreeableness_high');
  else if (scores.agreeableness < 35) weaknesses.push('agreeableness_low');
  
  // 神经质：低分是优势，高分需要改善
  if (scores.neuroticism < 35) strengths.push('neuroticism_low');
  else if (scores.neuroticism > 65) weaknesses.push('neuroticism_high');
  
  return { strengths, weaknesses };
}

/**
 * 生成第二周目标（优势强化 - 双语）
 */
function generateWeek2Goals(strengths, scores) {
  const goals = [];
  
  strengths.forEach(strength => {
    switch(strength) {
      case 'openness_high':
        goals.push('学习一项前沿技能（AI提示工程、数据分析等），每天投入1小时\nLearn a cutting-edge skill (AI prompt engineering, data analysis, etc.), invest 1 hour daily');
        goals.push('尝试3种不同的思维工具（思维导图、六顶思考帽、SCAMPER等）\nTry 3 different thinking tools (mind mapping, Six Thinking Hats, SCAMPER, etc.)');
        break;
      case 'conscientiousness_high':
        goals.push('优化您的生产力系统：整合GTD方法论和番茄工作法\nOptimize your productivity system: integrate GTD methodology and Pomodoro Technique');
        goals.push('创建个人知识管理体系（使用Notion/Obsidian），每天整理学习笔记\nCreate personal knowledge management system (using Notion/Obsidian), organize learning notes daily');
        break;
      case 'extraversion_high':
        goals.push('主动建立5个新的职业联系，每周参加1次行业活动或在线社群\nProactively build 5 new professional connections, attend 1 industry event or online community weekly');
        goals.push('在社交媒体或专业平台分享2篇专业见解或经验文章\nShare 2 professional insights or experience articles on social media or professional platforms');
        break;
      case 'agreeableness_high':
        goals.push('主导一次团队协作项目，发挥您的沟通和协调能力\nLead a team collaboration project, leveraging your communication and coordination abilities');
        goals.push('担任新人导师或提供3次职业建议，帮助他人成长\nServe as a mentor for newcomers or provide career advice 3 times, helping others grow');
        break;
      case 'neuroticism_low':
        goals.push('分享您的压力管理技巧：写一篇文章或做一次分享\nShare your stress management techniques: write an article or give a presentation');
        goals.push('在高压情境中担任稳定力量，帮助2-3位同事处理焦虑\nServe as a stabilizing force in high-pressure situations, help 2-3 colleagues manage anxiety');
        break;
    }
  });
  
  // 如果优势较少，添加通用强化目标
  if (goals.length < 3) {
    goals.push('记录您本周3次"巅峰体验"时刻，分析成功要素\nDocument 3 "peak experience" moments this week, analyze success factors');
    goals.push('向3位同事/朋友收集关于您优势的具体反馈\nGather specific feedback about your strengths from 3 colleagues/friends');
    goals.push('使用AI工具分析您的工作风格，生成个人品牌关键词\nUse AI tools to analyze your work style, generate personal brand keywords');
  }
  
  return goals.slice(0, 5); // 最多5个目标
}

/**
 * 生成第三周目标（弱项提升 - 双语）
 */
function generateWeek3Goals(weaknesses, scores) {
  const goals = [];
  
  weaknesses.forEach(weakness => {
    switch(weakness) {
      case 'openness_low':
        goals.push('每天尝试一个"第一次"：新路线、新食物、新话题、新方法\nTry a "first time" daily: new route, new food, new topic, new method');
        goals.push('阅读跨领域书籍（科幻、哲学、艺术等），拓展思维边界\nRead interdisciplinary books (sci-fi, philosophy, art, etc.), expand thinking boundaries');
        break;
      case 'conscientiousness_low':
        goals.push('使用时间追踪工具（RescueTime/Toggl）了解时间分配，优化效率\nUse time tracking tools (RescueTime/Toggl) to understand time allocation, optimize efficiency');
        goals.push('每天早晨规划3个MIT（最重要任务），晚上复盘完成情况\nPlan 3 MITs (Most Important Tasks) each morning, review completion in the evening');
        break;
      case 'extraversion_low':
        goals.push('每周参加1次小型社交活动（5-10人），练习主动交流\nAttend 1 small social event weekly (5-10 people), practice proactive communication');
        goals.push('在团队会议中主动发言3次，分享观点或提问\nSpeak up proactively 3 times in team meetings, share viewpoints or ask questions');
        break;
      case 'agreeableness_low':
        goals.push('练习"积极倾听"：每天与1人深度对话，先理解后回应\nPractice "active listening": have deep conversations with 1 person daily, understand before responding');
        goals.push('在分歧情境中，先寻找共同点，再表达不同意见\nIn disagreement situations, first find common ground, then express different opinions');
        break;
      case 'neuroticism_high':
        goals.push('建立情绪调节工具箱：每天10分钟冥想+运动+感恩日记\nBuild emotional regulation toolkit: 10 minutes daily of meditation + exercise + gratitude journal');
        goals.push('识别3个主要压力触发器，为每个设计应对预案\nIdentify 3 main stress triggers, design coping strategies for each');
        goals.push('使用认知重构技术：将负面想法转化为中性或积极表述\nUse cognitive reframing: transform negative thoughts into neutral or positive expressions');
        break;
    }
  });
  
  // 如果弱项较少，添加通用成长目标
  if (goals.length < 3) {
    goals.push('选择1个挑战性任务（略超舒适区），分解为每日小步骤\nChoose 1 challenging task (slightly beyond comfort zone), break down into daily small steps');
    goals.push('向导师或教练预约1次深度发展对话\nSchedule 1 in-depth development conversation with a mentor or coach');
    goals.push('建立"成长档案"：记录每周3个学习时刻和反思\nCreate a "growth portfolio": document 3 learning moments and reflections weekly');
  }
  
  return goals.slice(0, 5); // 最多5个目标
}

// 导出所有函数
module.exports = { 
  generateCareerRecommendations,
  generateResources,
  generate30DayPlan
};