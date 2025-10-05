module.exports = async (req, res) => {
  console.log('Environment check:');
  console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
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
    const { product_name, description, amount, email, name, age_group, product_type, scores, base_url } = req.body;
    
    // 创建 session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product_name,
            description: description
          },
          unit_amount: amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${base_url}/success.html?session_id={CHECKOUT_SESSION_ID}&product=${product_type}&amount=${amount}&email=${email}`,
      cancel_url: `${base_url}?cancelled=true`,
      customer_email: email,
      metadata: {
        name: name,
        email: email,
        age_group: age_group,
        product_type: product_type,
        extraversion: scores?.extraversion?.toString() || '50',
        openness: scores?.openness?.toString() || '50',
        conscientiousness: scores?.conscientiousness?.toString() || '50',
        agreeableness: scores?.agreeableness?.toString() || '50',
        neuroticism: scores?.neuroticism?.toString() || '50',
        ai_adaptability: scores?.ai_adaptability?.toString() || '50',
        human_value: scores?.human_value?.toString() || '50',
        life_integration: scores?.life_integration?.toString() || '50',
        entrepreneurship: scores?.entrepreneurship?.toString() || '50'
      }
    });
    
    return res.status(200).json({
      success: true,
      url: session.url
    });
    
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
