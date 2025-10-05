// api/stripe-webhook.js
// 处理Stripe webhook事件并发送报告

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

// 导入报告生成逻辑（或直接复制进来）
// 这里为了简化，我们把发送报告的逻辑整合进来

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // 验证webhook签名
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook签名验证失败:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // 处理不同的事件类型
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        console.log('收到支付成功事件:', session.id);
        
        try {
            // 从session中提取用户信息和分数
            const metadata = session.metadata;
            
            const userData = {
                name: metadata.name || 'valued customer',
                email: metadata.email || session.customer_details.email,
                age: metadata.age_group || 'N/A'
            };
            
            const scores = {
                extraversion: parseInt(metadata.extraversion) || 50,
                openness: parseInt(metadata.openness) || 50,
                conscientiousness: parseInt(metadata.conscientiousness) || 50,
                agreeableness: parseInt(metadata.agreeableness) || 50,
                neuroticism: parseInt(metadata.neuroticism) || 50,
                ai_adaptability: parseInt(metadata.ai_adaptability) || 50,
                human_value: parseInt(metadata.human_value) || 50,
                life_integration: parseInt(metadata.life_integration) || 50,
                entrepreneurship: parseInt(metadata.entrepreneurship) || 50
            };
            
            const orderInfo = {
                orderId: session.id,
                productType: metadata.product_type || 'report',
                amount: session.amount_total,
                paymentStatus: session.payment_status
            };
            
            console.log('准备发送报告给:', userData.email);
            
            // 调用发送报告的函数
            await sendPersonalityReport(userData, scores, orderInfo);
            
            console.log('报告已成功发送给:', userData.email);
            
        } catch (error) {
            console.error('处理支付成功后发送报告失败:', error);
            // 即使发送失败，也返回200，避免Stripe重试
            // 但要记录错误，方便手动处理
        }
    }

    // 返回200确认收到webhook
    res.status(200).json({ received: true });
}

// 发送个性化报告的完整函数
async function sendPersonalityReport(userData, scores, orderInfo) {
    // 生成报告内容
    const reportContent = generateReportContent(userData, scores);
    
    // 生成HTML邮件
    const htmlEmail = getEmailTemplate(reportContent);
    
    // 配置SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
        to: userData.email,
        from: {
            email: 'info@aicocreatelife.com',
            name: 'AI共创人生 - 王博士团队'
        },
        subject: `${userData.name}，您的AI共创人生性格分析报告已生成`,
        html: htmlEmail,
        text: `${userData.name}，您好！您的详细性格分析报告已生成。请在支持HTML的邮箱中查看完整报告。如有任何问题，请联系 info@aicocreatelife.com`,
        // 可选：添加PDF附件（未来实现）
        // attachments: [
        //     {
        //         content: pdfBuffer.toString('base64'),
        //         filename: 'personality_report.pdf',
        //         type: 'application/pdf',
        //         disposition: 'attachment'
        //     }
        // ]
    };
    
    await sgMail.send(msg);
    console.log(`报告邮件已发送给 ${userData.email}`);
}

// ==================== 报告生成函数 ====================
// 这里复制之前的所有内容生成函数

function generateReportContent(userData, scores) {
    const emotionalStability = 100 - scores.neuroticism;
    const personalityType = determinePersonalityType(scores);
    
    return {
        userName: userData.name,
        userEmail: userData.email,
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
        week1Action: getWeekAction(1, scores),
        week2Action: getWeekAction(2, scores),
        week3Action: getWeekAction(3, scores),
        week4Action: getWeekAction(4, scores),
        recommendedResources: generateResources(scores),
        consultationBookingLink: 'https://www.aicocreatelife.com/?product=consultation'
    };
}

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
            low: "您喜欢保持灵活性。建议使用AI工具辅助任务管理，发挥您的适应优势。"
        },
        agreeableness: {
            high: "您是天生的团队协作者。您的人际协调能力在AI时代是不可替代的核心竞争力。",
            medium: "您在协作和个人主张之间保持良好平衡，能在维护关系的同时推动决策。",
            low: "您更注重效率和结果。在AI时代，您的直率和效率导向可以帮助组织快速应对变化。"
        },
        emotionalStability: {
            high: "您具有出色的情绪稳定性和抗压能力，能在压力下做出理性决策。",
            medium: "您的情绪状态整体稳定。可以通过压力管理技巧增强抗压能力。",
            low: "您对环境变化较为敏感。建议建立稳定的支持系统，这种敏感性在需要同理心的工作中是优势。"
        }
    };
    return descriptions[dimension]?.[level] || "您在这个维度展现出独特的特质。";
}

function getAIAdvice(dimension, score) {
    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    const advice = {
        extraversion: {
            high: "利用社交优势建立AI时代的专业网络。考虑成为AI工具的企业培训师或数字化转型的沟通桥梁。",
            medium: "平衡线上和线下的职业网络建设。您的平衡能力使您在虚拟和实体环境中都能表现出色。",
            low: "专注于建立深度专业关系。通过高质量内容创作建立影响力，考虑成为细分领域的深度专家。"
        },
        openness: {
            high: "您是AI工具的理想早期采用者。建议系统性探索各类AI工具，考虑成为AI顾问或创新项目负责人。",
            medium: "采取渐进式AI学习策略。从熟悉的工作场景开始，选择1-2个工具深入学习。",
            low: "将AI视为提升效率的工具。从自动化重复性任务开始，逐步建立对AI的信任。"
        },
        conscientiousness: {
            high: "您的执行力是AI时代的稀缺资源。可以成为AI项目的可靠负责人，确保创新想法真正落地。",
            medium: "使用AI工具补充组织能力。让AI处理细节追踪，您专注于战略规划和关键决策。",
            low: "让AI成为您的个人助理。使用AI工具建立日常工作流程，保持灵活性同时不遗漏重要事项。"
        },
        agreeableness: {
            high: "您的人际能力将变得更加宝贵。专注于客户成功、团队文化建设等AI无法替代的角色。",
            medium: "平衡人际关系和任务效率。使用AI处理事务性沟通，为重要互动节省时间精力。",
            low: "您的直接和效率导向是AI时代优势。使用AI提供数据支持，由您做出关键判断。"
        },
        emotionalStability: {
            high: "您的抗压能力使您成为变革时期的稳定力量。考虑在高压环境中发挥领导作用。",
            medium: "建立个人压力管理系统。使用AI工具监测工作负荷，在压力过大前主动调整。",
            low: "将敏感性视为预警系统。考虑从事需要同理心的工作，如用户研究、设计、咨询等。"
        }
    };
    return advice[dimension]?.[level] || "在AI时代，您的特质可以与技术优势互补，创造独特价值。";
}

function generateCareerAdvice(scores) {
    let advice = "<p>基于您的综合性格特征，以下是为您量身定制的AI时代职业发展建议：</p><ul>";
    if (scores.openness >= 60 && scores.extraversion >= 60) {
        advice += "<li><strong>AI创新顾问：</strong>您的开放思维和社交能力使您能够将AI技术引入组织并获得团队支持。</li>";
    }
    if (scores.conscientiousness >= 60 && scores.openness >= 60) {
        advice += "<li><strong>AI项目管理专家：</strong>您既能理解新技术潜力，又能可靠推进项目执行。</li>";
    }
    advice += "<li><strong>持续学习策略：</strong>每周投入3-5小时学习新的AI工具或技能。</li>";
    advice += "<li><strong>个人品牌建设：</strong>通过LinkedIn等平台分享您的AI应用见解和经验。</li>";
    advice += "</ul>";
    return advice;
}

function getWeekAction(week, scores) {
    const actions = {
        1: "重新审视核心价值观和长期目标。思考在AI时代，什么是您独特的、不可替代的价值。",
        2: "列出当前技能清单，识别在AI时代需要提升的能力。选择1-2个关键技能开始学习。",
        3: "拓展专业网络。参加1-2个AI、创新或行业活动，主动联系5-10位专业人士。",
        4: "将学习转化为行动。在当前工作中找到可以应用AI工具优化的场景并实践。"
    };
    return actions[week];
}

function generateResources(scores) {
    let resources = [];
    resources.push("<li><strong>书籍：</strong>《AI 2041》（李开复）- 了解AI如何重塑未来十年</li>");
    resources.push("<li><strong>在线课程：</strong>Coursera的 'AI For Everyone'（Andrew Ng）</li>");
    if (scores.openness >= 60) {
        resources.push("<li><strong>实验平台：</strong>定期访问OpenAI Playground等AI实验平台</li>");
    }
    resources.push("<li><strong>AI工具导航：</strong>查看AI工具集合网站了解最新工具</li>");
    return resources.join('\n');
}

function getEmailTemplate(content) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC',sans-serif;background-color:#f5f5f5;line-height:1.6;">
<div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
<div style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:white;padding:40px 30px;text-align:center;">
<h1 style="margin:0 0 10px 0;font-size:28px;">🧠 AI共创人生</h1>
<p style="margin:0;font-size:16px;">您的专业性格分析报告已生成</p>
</div>
<div style="padding:30px;">
<div style="font-size:18px;color:#333;margin-bottom:20px;"><strong>${content.userName}</strong>，您好！</div>
<div style="background:#f8f9fa;border-left:4px solid #4facfe;padding:20px;margin:20px 0;border-radius:5px;">
<p><strong>感谢您完成AI共创人生性格评估测试！</strong></p>
<p>基于您的测试问卷，我们为您生成了这份详细的个性化分析报告。</p>
</div>
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;padding-bottom:10px;border-bottom:2px solid #4facfe;">📊 您的性格全景图</h2>
<div style="text-align:left;max-width:400px;margin:20px auto;">
<div style="margin:10px 0;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>社交活力</span><strong>${content.extraversionScore}%</strong></div><div style="background:#e0e0e0;height:12px;border-radius:6px;"><div style="height:100%;background:linear-gradient(90deg,#4facfe 0%,#00f2fe 100%);border-radius:6px;width:${content.extraversionScore}%;"></div></div></div>
<div style="margin:10px 0;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>创新开放</span><strong>${content.opennessScore}%</strong></div><div style="background:#e0e0e0;height:12px;border-radius:6px;"><div style="height:100%;background:linear-gradient(90deg,#4facfe 0%,#00f2fe 100%);border-radius:6px;width:${content.opennessScore}%;"></div></div></div>
<div style="margin:10px 0;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>执行可靠</span><strong>${content.conscientiousnessScore}%</strong></div><div style="background:#e0e0e0;height:12px;border-radius:6px;"><div style="height:100%;background:linear-gradient(90deg,#4facfe 0%,#00f2fe 100%);border-radius:6px;width:${content.conscientiousnessScore}%;"></div></div></div>
<div style="margin:10px 0;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>协作共情</span><strong>${content.agreeablenessScore}%</strong></div><div style="background:#e0e0e0;height:12px;border-radius:6px;"><div style="height:100%;background:linear-gradient(90deg,#4facfe 0%,#00f2fe 100%);border-radius:6px;width:${content.agreeablenessScore}%;"></div></div></div>
<div style="margin:10px 0;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span>情绪稳定</span><strong>${content.emotionalStabilityScore}%</strong></div><div style="background:#e0e0e0;height:12px;border-radius:6px;"><div style="height:100%;background:linear-gradient(90deg,#4facfe 0%,#00f2fe 100%);border-radius:6px;width:${content.emotionalStabilityScore}%;"></div></div></div>
</div>
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;">🎯 您的性格类型</h2>
<div style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:white;padding:25px;border-radius:10px;text-align:center;">
<h3 style="margin:0 0 10px 0;font-size:24px;">${content.personalityType}</h3>
<p style="margin:0;font-size:16px;">${content.personalityTypeDescription}</p>
</div>
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;">🚀 AI时代职业发展建议</h2>
<div style="color:#666;font-size:15px;line-height:1.7;">${content.careerAdvice}</div>
<h2 style="font-size:22px;color:#333;margin:30px 0 15px;">📋 30天行动计划</h2>
<div style="background:white;border-left:3px solid #4facfe;padding:15px;margin:10px 0;border-radius:5px;"><strong style="color:#4facfe;">第1周：自我认知</strong><br>${content.week1Action}</div>
<div style="background:white;border-left:3px solid #4facfe;padding:15px;margin:10px 0;border-radius:5px;"><strong style="color:#4facfe;">第2周：技能提升</strong><br>${content.week2Action}</div>
<div style="background:white;border-left:3px solid #4facfe;padding:15px;margin:10px 0;border-radius:5px;"><strong style="color:#4facfe;">第3周：网络拓展</strong><br>${content.week3Action}</div>
<div style="background:white;border-left:3px solid #4facfe;padding:15px;margin:10px 0;border-radius:5px;"><strong style="color:#4facfe;">第4周：行动落地</strong><br>${content.week4Action}</div>
<div style="background:#fff9e6;border:1px solid #ffd700;border-radius:10px;padding:20px;margin:20px 0;">
<h4 style="color:#f39c12;margin-top:0;">📚 为您推荐的学习资源</h4>
<ul style="margin:10px 0;padding-left:20px;">${content.recommendedResources}</ul>
</div>
<div style="background:#f8f9fa;border-left:4px solid #4facfe;padding:20px;margin:30px 0;border-radius:5px;">
<p><strong>王博士寄语</strong></p>
<p style="color:#666;">性格测试只是起点，真正的改变来自于持续的自我探索和行动。祝您在AI共创人生的旅程中，找到属于自己的精彩！</p>
<p style="margin-top:15px;font-size:14px;color:#666;"><em>— 王青平博士<br>斯坦福大学博士 | 企业创新咨询顾问</em></p>
</div>
<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:25px;border-radius:10px;text-align:center;">
<h3 style="margin:0 0 15px;">🌟 想要更深入的指导？</h3>
<p>预约王博士的个性化咨询服务，获得一对一深度咨询。</p>
<a href="${content.consultationBookingLink}" style="display:inline-block;background:white;color:#667eea;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:600;margin-top:15px;">预约深度咨询 $99</a>
</div>
<div style="background:#f8f9fa;padding:20px;border-radius:10px;margin-top:30px;">
<h4 style="color:#333;margin-top:0;">📞 需要帮助？</h4>
<p style="color:#666;margin:5px 0;">邮箱：info@aicocreatelife.com</p>
<p style="color:#666;margin:5px 0;">微信：wxid_boe94vvd7pen12</p>
<p style="color:#666;margin:5px 0;">电话：1 (310) 951-1326</p>
</div>
</div>
<div style="background:#333;color:white;padding:30px;text-align:center;font-size:14px;">
<p><strong>AI共创人生 | www.aicocreatelife.com</strong></p>
<p style="font-size:12px;opacity:0.8;margin-top:15px;">您收到此邮件是因为您完成了测试并购买了报告。</p>
</div>
</div>
</body>
</html>`;
}
