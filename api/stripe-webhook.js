const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const getRawBody = require('raw-body');

module.exports = async (req, res) => {
  console.log('=== Webhook received ===');
  console.log('Method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Webhook secret exists:', !!webhookSecret);
  console.log('Signature exists:', !!sig);

  let event;

  try {
    const rawBody = await getRawBody(req);
    const bodyString = rawBody.toString('utf8');
    console.log('Raw body length:', bodyString.length);

    event = stripe.webhooks.constructEvent(bodyString, sig, webhookSecret);
    console.log('✅ Signature verified successfully');
    console.log('Event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  let customerEmail;

  // 处理 checkout.session.completed 事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('💰 Checkout session completed!');
    console.log('Session ID:', session.id);
    
    customerEmail = session.customer_email || session.customer_details?.email;
    
    // 如果还没有邮箱，从 metadata 获取
    if (!customerEmail && session.metadata?.user_email) {
      customerEmail = session.metadata.user_email;
    }
    
    console.log('Customer email from session:', customerEmail);
  }
  
  // 处理 payment_intent.succeeded 事件
  else if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('💰 Payment intent succeeded!');
    console.log('Payment Intent ID:', paymentIntent.id);
    
    // 尝试从 payment_intent 的 metadata 获取邮箱
    if (paymentIntent.metadata?.user_email) {
      customerEmail = paymentIntent.metadata.user_email;
      console.log('Customer email from payment intent metadata:', customerEmail);
    }
    
    // 如果还是没有，尝试通过 payment_intent 查找对应的 checkout session
    if (!customerEmail) {
      try {
        console.log('Attempting to find checkout session for payment intent...');
        
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1
        });
        
        if (sessions.data.length > 0) {
          const session = sessions.data[0];
          console.log('Found checkout session:', session.id);
          customerEmail = session.customer_email || session.customer_details?.email || session.metadata?.user_email;
          console.log('Customer email from found session:', customerEmail);
        } else {
          console.log('No checkout session found for this payment intent');
        }
      } catch (searchError) {
        console.error('Error searching for checkout session:', searchError.message);
      }
    }
  }

  // 发送邮件
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
    console.error('❌ No customer email found');
    console.error('Event type was:', event.type);
  }

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

  console.log('📬 Sending email to:', toEmail);

  const result = await transporter.sendMail(mailOptions);
  
  console.log('📧 Email sent successfully!');
  
  return result;
}
