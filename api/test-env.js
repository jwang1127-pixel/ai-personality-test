module.exports = (req, res) => {
  const envCheck = {
    stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPreview: process.env.STRIPE_SECRET_KEY?.substring(0, 20) || 'NOT_FOUND',
    sendgridExists: !!process.env.SENDGRID_API_KEY,
    allStripeKeys: Object.keys(process.env).filter(k => k.includes('STRIPE'))
  };
  
  res.status(200).json(envCheck);
};