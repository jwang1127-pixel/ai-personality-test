const https = require('https');
const { generatePersonalityReport } = require('../report-generator/generateReport');
const { calculateThreeForces } = require('../report-generator/threeForcesSection');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, scores } = req.body;
    
    console.log('📧 开始处理报告发送请求...');
    console.log('📊 用户数据:', { email, name, scores });
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@aicocreatelife.com';

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY 未配置');
    }

    // ============ 1. 生成 PDF 报告 ============
    console.log('📄 开始生成 PDF 报告...');
    
    const userData = {
      name: name,
      email: email,
      scores: scores,
      date: new Date().toLocaleDateString('zh-CN')
    };

    let pdfBuffer;
    
    try {
      console.log('🔧 调用 generatePersonalityReport（Buffer模式）...');
      pdfBuffer = await generatePersonalityReport(userData, null);
      console.log('✅ PDF 生成成功');
      console.log('📊 PDF 大小:', pdfBuffer.length, 'bytes');
      
      if (pdfBuffer.length === 0) {
        throw new Error('PDF Buffer 大小为 0！');
      }
      
    } catch (pdfError) {
      console.error('❌ PDF 生成失败:', pdfError.message);
      throw new Error('PDF 生成失败: ' + pdfError.message);
    }

    // ============ 2. 转换为 Base64 ============
    console.log('📦 转换 PDF 为 Base64...');
    const pdfBase64 = pdfBuffer.toString('base64');
    console.log('✅ PDF 转换为 Base64 成功');

    // ============ 3. 生成邮件 HTML ============
    const emailHtml = generateEmailHtml(name, scores);

    // ============ 4. 保存到 Airtable ============
    console.log('💾 保存数据到 Airtable...');
    try {
      const threeForces = calculateThreeForces(scores);
      await saveToAirtable({ email, name, scores, threeForces });
      console.log('✅ Airtable 保存成功');
    } catch (airtableError) {
      console.error('❌ Airtable 保存失败:', airtableError.message);
      // Airtable失败不影响发送邮件，继续执行
    }

    // ============ 5. 通过 Resend 发送邮件 ============
    console.log('📨 准备通过 Resend 发送邮件...');
    
    const emailData = JSON.stringify({
      from: `AI共创人生团队 <${FROM_EMAIL}>`,
      to: [email],
      subject: `${name}，您的 AI 共创人生 18 页专业分析报告`,
      html: emailHtml,
      attachments: [{
        filename: `${name}_人格分析报告.pdf`,
        content: pdfBase64
      }]
    });

    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(emailData)
      }
    };

    return new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          if (response.statusCode === 200 || response.statusCode === 201) {
            console.log('✅ 邮件发送成功！');
            res.status(200).json({
              success: true,
              message: '18页专业报告已发送到您的邮箱，请查收附件！'
            });
          } else {
            console.error('❌ Resend 错误:', body);
            res.status(response.statusCode).json({
              success: false,
              error: body
            });
          }
          resolve();
        });
      });

      request.on('error', (error) => {
        console.error('❌ 请求失败:', error);
        res.status(500).json({ success: false, error: error.message });
        resolve();
      });

      request.write(emailData);
      request.end();
    });

  } catch (error) {
    console.error('❌ 发送报告失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============ 保存到 Airtable ============
async function saveToAirtable({ email, name, scores, threeForces }) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = 'app0q1RjfN8jwIFCZ';
  const AIRTABLE_TABLE_ID = 'tblkGRx1pzrtlDB5l';

  if (!AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY 未配置');
  }

  const fields = {
    name: name || '',
    Email: email || '',
    test_date: new Date().toISOString().split('T')[0],
    extraversion: parseInt(scores?.extraversion || 50),
    openness: parseInt(scores?.openness || 50),
    conscientiousness: parseInt(scores?.conscientiousness || 50),
    agreeableness: parseInt(scores?.agreeableness || 50),
    neuroticism: parseInt(scores?.neuroticism || 50),
    ai_adaptability: parseInt(scores?.ai_adaptability || 50),
    human_value: parseInt(scores?.human_value || 50),
    life_integration: parseInt(scores?.life_integration || 50),
    entrepreneurship: parseInt(scores?.entrepreneurship || 50),
    purchase_intent: 'paid',
    // 三力画像
    vision_force:     threeForces?.visionForce    || 0,
    judgment_force:   threeForces?.judgmentForce  || 0,
    creativity_force: threeForces?.creativityForce || 0,
    thinking_type:    threeForces?.thinkingType   || '',
  };

  const airtableData = JSON.stringify({ fields });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      path: `/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(airtableData)
      }
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => body += chunk);
      response.on('end', () => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Airtable错误: ${body}`));
        }
      });
    });

    request.on('error', reject);
    request.write(airtableData);
    request.end();
  });
}

// ============ 生成邮件 HTML 内容 ============
function generateEmailHtml(name, scores) {
  const dimensionNames = {
    extraversion: '外向性 Extraversion',
    openness: '开放性 Openness',
    conscientiousness: '尽责性 Conscientiousness',
    agreeableness: '宜人性 Agreeableness',
    neuroticism: '神经质 Neuroticism'
  };

  let dimensionsHtml = '';
  for (const [dim, score] of Object.entries(scores || {})) {
    if (dimensionNames[dim]) {
      const percentage = Math.round(score);
      dimensionsHtml += `
        <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #1E3A8A;">${dimensionNames[dim]}</span>
            <span style="color: #3B82F6; font-weight: bold;">${percentage} 分</span>
          </div>
          <div style="background: #e0e0e0; height: 16px; border-radius: 8px; overflow: hidden;">
            <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #3B82F6 0%, #1E3A8A 100%); transition: width 0.3s;"></div>
          </div>
        </div>
      `;
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; background: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;">
      <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px;">🎉 您的专业分析报告已生成！</h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.95;">AI Co-Create Life - Professional Personality Report</p>
        </div>
        
        <div style="padding: 35px 30px;">
          
          <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); padding: 20px; border-radius: 10px; border-left: 4px solid #3B82F6; margin-bottom: 30px;">
            <p style="margin: 0; font-size: 16px; color: #1F2937; line-height: 1.6;">
              <strong>${name}</strong>，您好！👋<br><br>
              感谢您完成 AI 共创人生人格测试。我们已经为您生成了一份 <strong style="color: #3B82F6;">18 页专业分析报告</strong>，请查看邮件附件中的 PDF 文件。
            </p>
          </div>

          <h2 style="color: #1E3A8A; margin: 30px 0 20px 0; font-size: 20px; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px;">
            📊 您的 Big Five 人格维度
          </h2>
          ${dimensionsHtml}

          <div style="margin: 35px 0; padding: 25px; background: #FFFBEB; border-radius: 10px; border: 1px solid #FDE68A;">
            <h3 style="color: #D97706; margin: 0 0 15px 0; font-size: 18px;">📄 报告包含内容：</h3>
            <ul style="margin: 0; padding-left: 20px; color: #78350F; line-height: 1.8;">
              <li>完整的 OCEAN 五维度深度分析</li>
              <li>AI 时代个性优势与发展建议</li>
              <li>基于人格的职业推荐（含匹配度）</li>
              <li>综合指数分析（人文价值、生活整合等）</li>
              <li>定制化 30 天发展计划</li>
              <li>书籍、课程和 AI 工具推荐</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6B7280; margin-bottom: 15px;">如果您在邮件中没有看到附件，请检查垃圾邮件文件夹</p>
          </div>

          <div style="background: linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%); padding: 20px; border-radius: 10px; margin-top: 25px;">
            <h3 style="color: #7C3AED; margin: 0 0 12px 0; font-size: 16px;">💬 需要进一步咨询？</h3>
            <p style="margin: 5px 0; color: #5B21B6; font-size: 14px;">📧 邮箱：info@aicocreatelife.com</p>
            <p style="margin: 5px 0; color: #5B21B6; font-size: 14px;">📱 微信：wxid_boe94vvd7pen12（王青平）</p>
            <p style="margin: 5px 0; color: #5B21B6; font-size: 14px;">🌐 官网：www.aicocreatelife.com</p>
          </div>

        </div>
        
        <div style="padding: 25px 30px; text-align: center; background: #F9FAFB; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 13px;">
            © 2025 AI 共创人生 | AI Co-Create Life
          </p>
          <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
            让 AI 成为您个人成长的最佳伙伴
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}
