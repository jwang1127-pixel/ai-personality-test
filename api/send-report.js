const https = require('https');

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
    
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL;

    // 生成报告 HTML
    const reportHtml = generateReportHtml(name, scores);

    const emailData = JSON.stringify({
      personalizations: [{
        to: [{ email: email }],
        subject: `${name}，您的AI共创人生详细分析报告`
      }],
      from: { email: FROM_EMAIL, name: 'AI共创人生团队' },
      content: [{
        type: 'text/html',
        value: reportHtml
      }]
    });

    const options = {
      hostname: 'api.sendgrid.com',
      path: '/v3/mail/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(emailData)
      }
    };

    return new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          if (response.statusCode === 202) {
            res.status(200).json({
              success: true,
              message: '报告已发送到您的邮箱'
            });
          } else {
            console.error('SendGrid error:', body);
            res.status(response.statusCode).json({
              success: false,
              error: body
            });
          }
          resolve();
        });
      });

      request.on('error', (error) => {
        res.status(500).json({
          success: false,
          error: error.message
        });
        resolve();
      });

      request.write(emailData);
      request.end();
    });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

function generateReportHtml(name, scores) {
  const dimensionNames = {
    extraversion: '社交活力指数',
    openness: '创新开放指数',
    conscientiousness: '执行可靠指数',
    agreeableness: '协作共情指数',
    neuroticism: '情绪波动指数',
    ai_adaptability: 'AI适应指数',
    human_value: '人文价值指数',
    life_integration: '生活整合指数',
    entrepreneurship: '创业潜力指数'
  };

  let dimensionsHtml = '';
  for (const [dim, score] of Object.entries(scores || {})) {
    dimensionsHtml += `
      <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <h3 style="color: #4facfe; margin-bottom: 10px;">${dimensionNames[dim] || dim}: ${score}%</h3>
        <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="width: ${score}%; height: 100%; background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);"></div>
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="margin: 0; padding: 20px; background: #f0f0f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 40px; text-align: center;">
          <h1>AI共创人生 - 详细性格分析报告</h1>
          <p>${name}，感谢您的参与！</p>
        </div>
        
        <div style="padding: 40px;">
          <h2 style="color: #333;">您的性格维度分析</h2>
          ${dimensionsHtml}
          
          <div style="margin-top: 40px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
            <h2>个性化建议</h2>
            <p>基于您的测试结果，我们为您准备了详细的职业发展建议和AI时代适应策略。</p>
            <p>如需进一步深度咨询，请联系我们：</p>
            <p>📧 info@aicocreatelife.com</p>
            <p>📱 微信：wxid_boe94vvd7pen12（王青平）</p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666; border-top: 1px solid #eee;">
          <p>© 2025 AI共创人生 | www.aicocreatelife.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}