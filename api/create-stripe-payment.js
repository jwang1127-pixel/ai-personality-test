const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  console.log('Environment check:');
  console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  console.log('Key preview:', process.env.STRIPE_SECRET_KEY?.substring(0, 15));
  
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
      success_url: `${base_url}?success=true`,
      cancel_url: `${base_url}?cancelled=true`,
      customer_email: email,
      metadata: {
        user_name: name,
        user_email: email,
        age_group: age_group,
        product_type: product_type,
        test_scores: JSON.stringify(scores)
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