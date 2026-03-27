/**
 * AI时代能力画像 — 三力模块
 * 
 * 字段名适配说明（现有系统 → 本模块内部）：
 *   neuroticism       → 反向后作为 emotionalStability（100 - neuroticism）
 *   ai_adaptability   → aiAdaptability
 *   human_value       → humanValue
 *   life_integration  → lifeIntegration
 *   entrepreneurship  → entrepreneurship（同名，无需转换）
 */

// ============================================================
// 第一步：字段名标准化（适配现有 scores 对象）
// ============================================================

function normalizeScores(scores) {
  return {
    openness:              scores.openness              || 50,
    conscientiousness:     scores.conscientiousness     || 50,
    extraversion:          scores.extraversion          || 50,
    agreeableness:         scores.agreeableness         || 50,
    // ⚠️ 关键：现有系统存的是 neuroticism（高=不稳定），这里反向转换
    emotionalStability:    100 - (scores.neuroticism    || 50),
    aiAdaptability:        scores.ai_adaptability       || 50,
    humanValue:            scores.human_value           || 50,
    lifeIntegration:       scores.life_integration      || 50,
    entrepreneurship:      scores.entrepreneurship      || 50,
  };
}

// ============================================================
// 第二步：计算三力分数
// ============================================================

function calculateThreeForces(rawScores) {
  const s = normalizeScores(rawScores);

  const visionForce = Math.round(
    s.openness * 0.6 + s.aiAdaptability * 0.4
  );

  const judgmentForce = Math.round(
    s.emotionalStability * 0.5 + s.conscientiousness * 0.5
  );

  const creativityForce = Math.round(
    s.openness * 0.5 + s.entrepreneurship * 0.5
  );

  // 思维主导类型
  const typeScores = {
    executorType:  s.conscientiousness,
    creatorType:   s.openness,
    judgeType:     s.emotionalStability,
  };

  const maxScore = Math.max(...Object.values(typeScores));
  const dominantEntries = Object.entries(typeScores)
    .filter(([, v]) => v >= maxScore - 10);

  const thinkingType = dominantEntries.length >= 2
    ? 'composite'
    : dominantEntries[0][0];

  return { visionForce, judgmentForce, creativityForce, thinkingType };
}

// ============================================================
// 第三步：分数段标签
// ============================================================

function getForceLevel(score) {
  if (score >= 75) return 'strong';
  if (score >= 55) return 'moderate';
  if (score >= 35) return 'developing';
  return 'priority';
}

function getRankedForces(visionForce, judgmentForce, creativityForce) {
  const forces = { vision: visionForce, judgment: judgmentForce, creativity: creativityForce };
  const sorted = Object.entries(forces).sort((a, b) => b[1] - a[1]);
  return { strongest: sorted[0][0], weakest: sorted[sorted.length - 1][0] };
}

// ============================================================
// 第四步：构建 Prompt
// ============================================================

function buildPrompt(userData, threeForces) {
  const { visionForce, judgmentForce, creativityForce, thinkingType } = threeForces;

  const typeNameMap = {
    executorType: '执行型', creatorType: '创造型',
    judgeType: '判断型', composite: '复合型',
  };
  const forceNameMap = {
    vision: '愿景力', judgment: '判断力', creativity: '创造力',
  };
  const levelDescMap = {
    strong:     '明显优势（75分以上）',
    moderate:   '可用基础（55-74分）',
    developing: '发展缺口（35-54分）',
    priority:   '优先重构（35分以下）',
  };

  const { strongest, weakest } = getRankedForces(visionForce, judgmentForce, creativityForce);

  const systemPrompt = `你是 AI B School（美国创新商学院）报告生成系统的一部分。
你的任务是为用户生成"AI时代能力画像"报告章节。

写作原则：
1. 语气是"见过大世面的导师在和学生说实话"，不是心理咨询师，不是励志演讲。
2. 不用"你可能""也许""或许"等模糊词，直接陈述。
3. 不过度夸赞，不安慰式表扬，直接指出优势和挑战。
4. 所有内容必须和AI时代的现实场景挂钩，不是泛泛的心理描述。
5. 报告语言为中文，每个分段的字数控制在100-150字。
6. 全章节总字数控制在600-800字。`;

  const userPrompt = `请根据以下用户数据，生成"你的AI时代能力画像"报告章节。

## 用户基本信息
- 姓名/称呼：${userData.name || '用户'}

## 三力得分
- 愿景力：${visionForce}分（${levelDescMap[getForceLevel(visionForce)]}）
- 判断力：${judgmentForce}分（${levelDescMap[getForceLevel(judgmentForce)]}）
- 创造力：${creativityForce}分（${levelDescMap[getForceLevel(creativityForce)]}）

## 思维主导类型
${typeNameMap[thinkingType]}

## 最强力 / 最弱力
- 最强：${forceNameMap[strongest]}（${threeForces[strongest + 'Force']}分）
- 最弱：${forceNameMap[weakest]}（${threeForces[weakest + 'Force']}分）

---

## 请按以下结构生成内容（严格按结构，不要省略任何模块）：

### 【模块1】核心洞察（50-80字）
格式：
"你是[思维类型]主导，三力中[最强力]是你的天然优势，
[最弱力]是你最值得重构的方向——这意味着[在AI时代的具体含义]。"
要求：结尾的具体含义必须是现实场景，不是抽象描述。

---

### 【模块2】你的思维主导类型（100-150字）
描述该类型的天然优势、AI时代价值、以及主要挑战。
结尾必须点明：哪1-2项三力对该类型最值得有意识培养。

---

### 【模块3】你的三力画像（每力80-120字）

**愿景力 ${visionForce}分**
[根据分数段，描述当前状态和具体建议]

**判断力 ${judgmentForce}分**
[根据分数段，描述当前状态和具体建议]

**创造力 ${creativityForce}分**
[根据分数段，描述当前状态和具体建议]

---

### 【模块4】你的下一步（50字左右）
引导用户探索更深层的成长路径，语气自然，不强推。
结尾用这句话收尾：
"继续完成《AI时代能力重构自测》，看清你当前的真实行动层级。"

---

注意事项：
- 不要生成JSON，直接生成可读的中文报告文本
- 每个模块之间用空行分隔
- 不要在模块标题里重复显示分数或类型名称（正文里自然提及）
- 不要加多余的装饰性词语如"非常""极其""深刻"等`;

  return { systemPrompt, userPrompt };
}

// ============================================================
// 第五步：调用 Claude API
// ============================================================

async function generateThreeForcesContent(userData, threeForces) {
  const { systemPrompt, userPrompt } = buildPrompt(userData, threeForces);

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY 未配置');
  }

  const https = require('https');
  const body = JSON.stringify({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`Claude API错误: ${parsed.error.message}`));
          } else {
            resolve(parsed.content[0].text);
          }
        } catch (e) {
          reject(new Error('Claude API响应解析失败: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ============================================================
// 第六步：将生成内容渲染到 PDF（PDFKit）
// ============================================================

function renderThreeForcesInPDF(doc, colors, threeForces, content) {
  const { visionForce, judgmentForce, creativityForce, thinkingType } = threeForces;

  const typeNameMap = {
    executorType: '执行型', creatorType: '创造型',
    judgeType: '判断型', composite: '复合型',
  };

  // 章节标题
  doc.font('ChineseBold').fontSize(18).fillColor(colors.primary)
    .text('你的AI时代能力画像', { align: 'center' });
  doc.moveDown(0.3);
  doc.font('Chinese').fontSize(11).fillColor(colors.lightText)
    .text('Your AI Era Capability Profile', { align: 'center' });
  doc.moveDown(1.5);

  // 三力分数条
  const barStartX = 60;
  const barWidth = 430;
  const forces = [
    { label: '愿景力  Vision', score: visionForce,    color: colors.secondary },
    { label: '判断力  Judgment', score: judgmentForce, color: colors.green },
    { label: '创造力  Creativity', score: creativityForce, color: colors.orange },
  ];

  forces.forEach(({ label, score, color }) => {
    doc.font('ChineseBold').fontSize(10).fillColor(colors.text)
      .text(`${label}`, barStartX, doc.y, { continued: true })
      .font('Chinese').fillColor(color)
      .text(`  ${score}分`, { align: 'right' });

    const barY = doc.y + 2;
    // 背景条
    doc.rect(barStartX, barY, barWidth, 10)
      .fill('#E5E7EB');
    // 分数条
    doc.rect(barStartX, barY, Math.round(barWidth * score / 100), 10)
      .fill(color);
    doc.moveDown(1.5);
  });

  // 思维类型标签
  doc.moveDown(0.5);
  const typeLabel = `思维主导类型：${typeNameMap[thinkingType] || thinkingType}`;
  const typeLabelWidth = 180;
  const typeLabelX = (doc.page.width - typeLabelWidth) / 2;
  doc.rect(typeLabelX, doc.y, typeLabelWidth, 22).fill(colors.secondary);
  doc.font('ChineseBold').fontSize(11).fillColor('white')
    .text(typeLabel, typeLabelX, doc.y - 18, { width: typeLabelWidth, align: 'center' });
  doc.moveDown(2.5);

  // 分割线
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke(colors.border);
  doc.moveDown(1);

  // Claude 生成的正文内容
  const lines = content.split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      doc.moveDown(0.6);
      return;
    }

    // 模块标题行：【模块N】
    if (trimmed.startsWith('###') || trimmed.startsWith('【模块')) {
      const cleanTitle = trimmed.replace(/^###\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
      doc.moveDown(0.4);
      doc.font('ChineseBold').fontSize(12).fillColor(colors.primary)
        .text(cleanTitle, 50, doc.y, { width: 495 });
      doc.moveDown(0.5);
      return;
    }

    // 三力子标题行：**愿景力 XX分**
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const cleanTitle = trimmed.replace(/\*\*/g, '');
      doc.font('ChineseBold').fontSize(11).fillColor(colors.orange)
        .text(cleanTitle, 50, doc.y, { width: 495 });
      doc.moveDown(0.3);
      return;
    }

    // 正文
    doc.font('Chinese').fontSize(10).fillColor(colors.text)
      .text(trimmed, 50, doc.y, { width: 495, lineGap: 3 });
    doc.moveDown(0.3);
  });

  doc.moveDown(1);
}

// ============================================================
// 导出
// ============================================================

module.exports = {
  calculateThreeForces,
  generateThreeForcesContent,
  renderThreeForcesInPDF,
};
