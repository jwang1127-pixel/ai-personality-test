const https = require('https');

module.exports = async (req, res) => {
  // 暂时跳过签名验证，先测试基本功能
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // 调用发送邮件的 API
console.log('Environment check:', {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'exists' : 'missing',
  FROM_EMAIL: process.env.FROM_EMAIL,
  TO_EMAIL: process.env.TO_EMAIL,
  allKeys: Object.keys(process.env)
});

const emailData = {// 调用发送邮件的 API
    const emailData = {
      email: session.customer_email,
      name: session.metadata?.user_name || 'User',
      scores: JSON.parse(session.metadata?.test_scores || '{}')
    };

    // 调用我们的 send-report API
    const postData = JSON.stringify(emailData);
    
    const options = {
      hostname: 'www.aicocreatelife.com',
      path: '/api/send-report',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const request = https.request(options, (response) => {
      console.log('Email API response:', response.statusCode);
    });

    request.write(postData);
    request.end();
  }

  res.json({received: true});
};
