const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

export const config = {
  api: {
    bodyParser: false,
  },
};

// ============ 报告生成函数 ============

function determinePersonalityType(scores) {
  const types = [
    { condition: (s) => s.openness >= 60 && s.extraversion >= 60 && s.conscientiousness >= 60, name: "AI时代创新领导者", description: "您兼具开放思维、社交能力和执行力，是推动组织数字化转型的理想人选" },
    { condition: (s) => s.openness >= 60 && s.conscientiousness >= 60, name: "AI技术实践者", description: "您善于将新技术转化为实际应用，适合担任AI项目经理或技术顾问" },
    { condition: (s) => s.extraversion >= 60 && s.agreeableness >= 60, name: "人际关系建设者", description: "在AI自动化时代，您的人际协调能力是不可替代的核心优势" },
    { condition: (s) => s.openness >= 60 && s.agreeableness >= 60, name: "人文科技融合者", description: "您能在技术创新中保持人文关怀，适合用户体验设计和产品管理" },
    { condition: (s) => s.conscientiousness >= 60 && s.agreeableness >= 60, name: "可靠团队支柱", description: "您的稳定性和协作精神使您成为任何团队的宝贵资产" },
    { condition: (s) => s.openness >= 60, name: "创意探索者", description: "您的开放思维让您在快速变化的AI时代保持竞争力" },
    { condition: (s) => s.extraversion >= 60, name: "社交网络专家", description: "您擅长建立和维护关系，适合需要广泛人脉的角色" },
    { condition: (s) => s.conscientiousness >= 60, name: "执行力专家", description: "您的可靠性和专注力是职业成功的坚实基础" }
  ];
  for (let type of types) {
    if (type.condition(scores)) return type;
  }
  return { name: "全面发展型人才", description: "您在各维度保持良好平衡，具有广泛的适应能力和发展潜力" };
}

function getDescription(dimension, score) {
  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const descriptions = {
    extraversion: {
      high: "您天生具备出色的社交能力和团队领导力。在群体中您感到充满活力，善于通过人际互动推动工作进展。",
      medium: "您在社交和独处之间保持良好平衡。您既能享受团队协作，也能在需要时独立工作。",
      low: "您更倾向于深度工作和专注思考。在AI时代，您的深度工作能力是稀缺且宝贵的。"
    },
    openness: {
      high: "您对新技术保持高度开放和好奇心。这种特质使您在AI快速发展的时代占据天然优势。",
      medium: "您对新事物持谨慎而开放的态度，在创新和稳定之间找到最佳平衡点。",
      low: "您更信任经过时间考验的方法。建议通过结构化学习逐步接触新技术。"
    },
    conscientiousness: {
      high: "您是高度自律和可靠的人，擅长将宏大目标分解为可实现的步骤。",
      medium: "您在计划性和灵活性之间保持平衡，既能完成任务又能适应变化。",
      low: "您喜欢保持灵活性。建议使用AI工具辅助任务管理。"
    },
    agreeableness: {
      high: "您是天生的团队协作者。您的人际协调能力在AI时代是不可替代的核心竞争力。",
      medium: "您在协作和个人主张之间保持良好平衡。",
      low: "您更注重效率和结果。在AI时代，您的直率和效率导向可以帮助组织快速应对变化。"
    },
    emotionalStability: {
      high: "您具有出色的情绪稳定性和抗压能力，能在压力下做出理性决策。",
      medium: "您的情绪状态整体稳定。可以通过压力管理技巧增强抗压能力。",
      low: "您对环境变化较为敏感。建议建立稳定的支持系统。"
    }
  };
  return descriptions[dimension]?.[level] || "您在这个维度展现出独特的特质。";
}

function getAIAdvice(dimension, score) {
  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const advice = {
    extraversion: {
      high: "利用社交优势建立AI时代的专业网络。考虑成为AI工具的企业培训师。",
      medium: "平衡线上和线下的职业网络建设。",
      low: "专注于建立深度专业关系。通过高质量内容创作建立影响力。"
    },
    openness: {
      high: "您是AI工具的理想早期采用者。建议系统性探索各类AI工具。",
      medium: "采取渐进式AI学习策略。",
      low: "将AI视为提升效率的工具。从自动化重复性任务开始。"
    },
    conscientiousness: {
      high: "您的执行力是AI时代的稀缺资源。可以成为AI项目的可靠负责人。",
      medium: "使用AI工具补充组织能力。",
      low: "让AI成为您的个人助理。"
    },
    agreeableness: {
      high: "您的人际能力将变得更加宝贵。专注于AI无法替代的角色。",
      medium: "平衡人际关系和任务效率。",
      low: "您的直接和效率导向是AI时代优势。"
    },
    emotionalStability: {
      high: "您的抗压能力使您成为变革时期的稳定力量。",
      medium: "建立个人压力管理系统。",
      low: "将敏感性视为预警系统。"
    }
  };
  return advice[dimension]?.[level] || "在AI时代，您的特质可以与技术优势互补。";
}

function generateCareerAdvice(scores) {
  let advice = "<p>基于您的综合性格特征，以下是为您量身定制的AI时代职业发展建议：</p><ul>";
  if (scores.openness >= 60 && scores.extraversion >= 60) {
    advice += "<li><strong>AI创新顾问：</strong>您的开放思维和社交能力使您能够将AI技术引入组织。</li>";
  }
  if (scores.conscientiousness >= 60 && scores.openness >= 60) {
    advice += "<li><strong>AI项目管理专家：</strong>您既能理解新技术潜力，又能可靠推进执行。</li>";
  }
  advice += "<li><strong>持续学习：</strong>每周投入3-5小时学习新的AI工具或技能。</li>";
  advice += "<li><strong>个人品牌：</strong>通过LinkedIn等平台分享您的AI应用见解。</li>";
  advice += "</ul>";
  return advice;
}

function getWeekAction(week) {
  const actions = {
    1: "重新审视核心价值观和长期目标。思考在AI时代，什么是您独特的、不可替代的价值。",
    2: "列出当前技能清单，识别在AI时代需要提升的能力。",
    3: "拓展专业网络。参加1-2个AI、创新或行业活动。",
    4: "将学习转化为行动。在工作中找到可以应用AI工具优化的场景。"
  };
  return actions[week];
}

function generateResources() {
  return `<li><strong>书籍：</strong>《AI 2041》（李开复）</li>
<li><strong>在线课程：</strong>Coursera的 'AI For Everyone'</li>
<li><strong>AI工具导航：</strong>查看AI工具集合网站了解最新工具</li>`;
}

function generateReportContent(userData, scores) {
  const emotionalStability = 100 - scores.neuroticism;
  const personalityType = determinePersonalityType(scores);
  
  return {
    userName: userData.name,
    extraversionScore: scores.extraversion,
    opennessScore: scores.openness,
    conscientiousnessScore: scores.conscientiousness,
    agreeablenessScore: scores.agreeableness,
    emotionalStabilityScore: emotionalStability,
    personalityType: personalityType.name,
    personalityTypeDescription: personalityType.description,
    extraversionDescription: getDescription('extraversion', scores.extraversion),
    extraversionAIAdvice: getAIAdvice('extraversion', scores.extraversion),
    opennessDescription: getDescription('openness', scores.openness),
    opennessAIAdvice: getAIAdvice('openness', scores.openness),
    conscientiousnessDescription: getDescription('conscientiousness', scores.conscientiousness),
    conscientiousnessAIAdvice: getAIAdvice('conscientiousness', scores.conscientiousness),
    agreeablenessDescription: getDescription('agreeableness', scores.agreeableness),
    agreeablenessAIAdvice: getAIAdvice('agreeableness', scores.agreeableness),
    emotionalStabilityDescription: getDescription('emotionalStability', emotionalStability),
    emotionalStabilityAIAdvice: getAIAdvice('emotionalStability', emotionalStability),
    careerAdvice: generateCareerAdvice(scores),
    week1Action: getWeekAction(1),
    week2Action: getWeekAction(2),
    week3Action: getWeekAction(3),
    week4Action: getWeekAction(4),
    recommendedResources: generateResources()
  };
}

function getEmailHTML(content) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;line-height:1.6;">
<div style="max-width:600px;margin:0 auto;background:#fff;">
<div style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:white;padding:40px 30px;text-align:center;">
<h1 style="margin:0 0 10px;font-size:28px;">🧠 AI共创人生</h1>
<p style="margin:0;font-size:16px;">您的专业性格分析报告</p>
</div>
<div style="padding:30px;">
<div style="font-size:18px;color:#333;margin-bottom:20px;"><strong>${content.userName}</strong>，您好！</div>
<div style="background:#f8f9fa;border-left:4px solid #4facfe;padding:20px;margin:20px 0;border-radius:5px;">
<p><strong>感谢您完成AI共创人生性格评估测试！</strong></p>
<p>基于您的测试问卷，我们为您生成了这份详细的个性化分析报告。</p>
</div>
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;padding-bottom:10px;border-bottom:2px solid #4facfe;">🎯 您的性格类型</h2>
<div style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:white;padding:25px;border-radius:10px;text-align:center;">
<h3 style="margin:0 0 10px;font-size:24px;">${content.personalityType}</h3>
<p style="margin:0;">${content.personalityTypeDescription}</p>
</div>
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;border-bottom:2px solid #4facfe;">📊 五大维度分析</h2>
<div style="background:#f8f9fa;border-radius:10px;padding:20px;margin:20px 0;">
<h3 style="color:#4facfe;">💬 社交活力：${content.extraversionScore}%</h3>
<p>${content.extraversionDescription}</p>
<p><strong>AI时代建议：</strong>${content.extraversionAIAdvice}</p>
</div>
<div style="background:#f8f9fa;border-radius:10px;padding:20px;margin:20px 0;">
<h3 style="color:#4facfe;">💡 创新开放：${content.opennessScore}%</h3>
<p>${content.opennessDescription}</p>
<p><strong>AI时代建议：</strong>${content.opennessAIAdvice}</p>
</div>
<div style="background:#f8f9fa;border-radius:10px;padding:20px;margin:20px 0;">
<h3 style="color:#4facfe;">⚡ 执行可靠：${content.conscientiousnessScore}%</h3>
<p>${content.conscientiousnessDescription}</p>
<p><strong>AI时代建议：</strong>${content.conscientiousnessAIAdvice}</p>
</div>
<div style="background:#f8f9fa;border-radius:10px;padding:20px;margin:20px 0;">
<h3 style="color:#4facfe;">🤝 协作共情：${content.agreeablenessScore}%</h3>
<p>${content.agreeablenessDescription}</p>
<p><strong>AI时代建议：</strong>${content.agreeablenessAIAdvice}</p>
</div>
<div style="background:#f8f9fa;border-radius:10px;padding:20px;margin:20px 0;">
<h3 style="color:#4facfe;">🧘 情绪稳定：${content.emotionalStabilityScore}%</h3>
<p>${content.emotionalStabilityDescription}</p>
<p><strong>AI时代建议：</strong>${content.emotionalStabilityAIAdvice}</p>
</div>
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;">🚀 职业发展建议</h2>
${content.careerAdvice}
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;">📋 30天行动计划</h2>
<div style="border-left:3px solid #4facfe;padding:15px;margin:10px 0;"><strong style="color:#4facfe;">第1周：</strong>${content.week1Action}</div>
<div style="border-left:3px solid #4facfe;padding:15px;margin:10px 0;"><strong style="color:#4facfe;">第2周：</strong>${content.week2Action}</div>
<div style="border-left:3px solid #4facfe;padding:15px;margin:10px 0;"><strong style="color:#4facfe;">第3周：</strong>${content.week3Action}</div>
<div style="border-left:3px solid #4facfe;padding:15px;margin:10px 0;"><strong style="color:#4facfe;">第4周：</strong>${content.week4Action}</div>
<div style="background:#fff9e6;border:1px solid #ffd700;border-radius:10px;padding:20px;margin:20px 0;">
<h4 style="color:#f39c12;">📚 推荐资源</h4>
<ul>${content.recommendedResources}</ul>
</div>
<div style="background:#f8f9fa;border-left:4px solid #4facfe;padding:20px;margin:30px 0;">
<p><strong>王博士寄语</strong></p>
<p>性格测试只是起点，真正的改变来自持续的自我探索和行动。祝您在AI共创人生的旅程中找到属于自己的精彩！</p>
<p style="margin-top:15px;font-size:14px;"><em>— 王青平博士<br>斯坦福大学博士 | 企业创新咨询顾问</em></p>
</div>
<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:25px;border-radius:10px;text-align:center;">
<h3>🌟 想要更深入的指导？</h3>
<p>预约王博士的个性化咨询服务</p>
<a href="https://www.aicocreatelife.com/?product=consultation" style="display:inline-block;background:white;color:#667eea;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:600;margin-top:15px;">预约深度咨询 $99</a>
</div>
<div style="background:#f8f9fa;padding:20px;border-radius:10px;margin-top:30px;">
<h4>📞 需要帮助？</h4>
<p>邮箱：info@aicocreatelife.com</p>
<p>微信：wxid_boe94vvd7pen12</p>
<p>电话：1 (310) 951-1326</p>
</div>
</div>
<div style="background:#333;color:white;padding:30px;text-align:center;font-size:14px;">
<p><strong>AI共创人生 | www.aicocreatelife.com</strong></p>
</div>
</div>
</body>
</html>`;
}

// ============ Webhook 主函数 ============

module.exports = async (req, res) => {
  console.log('=== Webhook 被调用 ===');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event, body;

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    body = Buffer.concat(chunks).toString('utf8');
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('Webhook 验证成功');
  } catch (err) {
    console.error('Webhook 失败:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('收到支付成功:', session.id);
    
    try {
      const metadata = session.metadata;
      const userEmail = metadata.email || session.customer_details.email;
      const userName = metadata.name || 'Valued Customer';
      
      const scores = {
        extraversion: parseInt(metadata.extraversion) || 50,
        openness: parseInt(metadata.openness) || 50,
        conscientiousness: parseInt(metadata.conscientiousness) || 50,
        agreeableness: parseInt(metadata.agreeableness) || 50,
        neuroticism: parseInt(metadata.neuroticism) || 50
      };
      
      const reportContent = generateReportContent({ name: userName }, scores);
      const htmlEmail = getEmailHTML(reportContent);
      
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: userEmail,
        from: {
          email: 'jwang1127@gmail.com',
          name: 'AI Co-create Life'
        },
        replyTo: 'info@aicocreatelife.com',
        subject: `${userName}，您的AI共创人生性格分析报告已生成`,
        html: htmlEmail,
        text: `${userName}，您好！您的详细性格分析报告已生成。请在支持HTML的邮箱中查看。`
      };
      
      await sgMail.send(msg);
      console.log('完整报告已发送到:', userEmail);
      
    } catch (error) {
      console.error('发送失败:', error);
      if (error.response) console.error('SendGrid 错误:', error.response.body);
    }
  }

  res.status(200).json({ received: true });
};
