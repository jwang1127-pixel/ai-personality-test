const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // 发送报告邮件
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: session.customer_email,
      from: process.env.FROM_EMAIL,
      subject: '您的AI共创人生测试报告',
      html: `
        <h1>感谢您的购买！</h1>
        <p>您好，${session.metadata.user_name}</p>
        <p>这是您的详细性格分析报告...</p>
      `
    };

    await sgMail.send(msg);
  }

  res.json({received: true});
};