const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const getRawBody = require('raw-body');

module.exports = async (req, res) => {
  console.log('=== Webhook received ===');
  console.log('Method:', req.method);
  
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Webhook secret exists:', !!webhookSecret);
  console.log('Signature exists:', !!sig);

  let event;

  try {
    // 读取原始 body
    const rawBody = await getRawBody(req);
    const bodyString = rawBody.toString('utf8');

    console.log('Raw body length:', bodyString.length);

    // 验证 webhook 签名
    event = stripe.webhooks.constructEvent(bodyString, sig, webhookSecret);
    console.log('✅ Signature verified successfully');
    console.log('Event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // 处理支付成功事件
  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    let customerEmail;
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('💰 Checkout session completed!');
      console.log('Session ID:', session.id);
      console.log('Session data:', JSON.stringify(session, null, 2));
      customerEmail = session.customer_details?.email;
    } else if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('💰 Payment intent succeeded!');
      console.log('Payment Intent ID:', paymentIntent.id);
      console.log('Payment Intent data:', JSON.stringify(paymentIntent, null, 2));
      
      // 从 payment_intent 获取邮箱 - 多种方式尝试
      customerEmail = paymentIntent.receipt_email || 
                     paymentIntent.metadata?.email ||
                     paymentIntent.shipping?.email;
      
      // 如果还是没有邮箱，尝试从 charges 获取
      if (!customerEmail && paymentIntent.charges?.data?.[0]) {
        customerEmail = paymentIntent.charges.data[0].billing_details?.email;
      }
    }

    console.log('Customer email:', customerEmail);

    if (customerEmail) {
      try {
        console.log('📧 Attempting to send email to:', customerEmail);
        await sendReportEmail(customerEmail);
        console.log('✅ Report email sent successfully to:', customerEmail);
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError.message);
        console.error('Email error stack:', emailError.stack);
      }
    } else {
      console.error('❌ No customer email found in payment data');
      console.error('Please check Stripe Dashboard to see what data is available');
    }
  } else {
    console.log('ℹ️  Event type not handled:', event.type);
  }

  // 返回成功响应
  console.log('=== Webhook processing complete ===');
  res.status(200).json({ received: true });
};

// 发送报告邮件的函数
async function sendReportEmail(toEmail) {
  console.log('📮 Setting up email transporter...');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });

  console.log('SendGrid API key exists:', !!process.env.SENDGRID_API_KEY);

  const mailOptions = {
    from: 'jwang1127@gmail.com',
    to: toEmail,
    subject: 'Your Biorhythm Report',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Your biorhythm report is ready.</p>
      <p>We appreciate your business.</p>
    `
  };

  console.log('📬 Sending email with options:', JSON.stringify(mailOptions, null, 2));

  const result = await transporter.sendMail(mailOptions);
  
  console.log('📧 Email sent result:', JSON.stringify(result, null, 2));
  
  return result;
}
