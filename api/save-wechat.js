const { Resend } = require('resend');
const { generatePersonalityReport } = require('../report-generator/generateReport');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { wechat, source, scores } = req.body;
  console.log('收到数据:', JSON.stringify({ wechat, source, scores }));
  if (!wechat) return res.status(400).json({ error: '微信号不能为空' });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@aicocreatelife.com';
    const TO_EMAIL = process.env.ADMIN_EMAIL || FROM_EMAIL;

    let attachments = [];

    // 异步生成报告，不等待
if (scores) {
  (async () => {
    try {
      const testProfile = {
        name: wechat,
        date: new Date().toLocaleDateString('zh-CN'),
        scores: scores
      };
      const outputPath = `/tmp/report_${Date.now()}.pdf`;
      await generatePersonalityReport(testProfile, outputPath);
      const pdfBuffer = fs.readFileSync(outputPath);
      
      await resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `📊 用户报告已生成 - ${wechat}`,
        html: `
          <h2>用户报告已生成</h2>
          <p><strong>微信号：</strong>${wechat}</p>
          <p><strong>时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
          <p>完整报告见附件，请通过微信发送给用户。</p>
        `,
        attachments: [{
          filename: `AI共创人生报告_${wechat}.pdf`,
          content: pdfBuffer.toString('base64'),
          encoding: 'base64'
        }]
      });
    } catch (e) {
      console.error('报告生成失败:', e.message);
    }
  })();
}
          name: wechat,
          date: new Date().toLocaleDateString('zh-CN'),
          scores: scores
        };
        const outputPath = `/tmp/report_${Date.now()}.pdf`;
        await generatePersonalityReport(testProfile, outputPath);
        const pdfBuffer = fs.readFileSync(outputPath);
        attachments = [{
          filename: `AI共创人生报告_${wechat}.pdf`,
          content: pdfBuffer.toString('base64'),
          encoding: 'base64'
        }];
      } catch (e) {
        console.error('报告生成失败:', e);
      }
    }

   await resend.emails.send({
  from: FROM_EMAIL,
  to: TO_EMAIL,
  subject: `新用户留下微信号 - ${wechat}`,
  html: `
    <h2>新用户留下微信号</h2>
    <p><strong>微信号：</strong>${wechat}</p>
    <p><strong>来源：</strong>${source || '未知'}</p>
    <p><strong>时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
    <p>⏳ 完整报告正在生成，稍后会单独发送到此邮箱。</p>
  `
});

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('失败:', error);
    res.status(500).json({ error: '发送失败' });
  }
};
