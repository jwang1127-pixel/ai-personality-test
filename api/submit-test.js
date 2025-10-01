module.exports = async (req, res) => {
  // 添加 CORS 头
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
    console.log('Received request body:', JSON.stringify(req.body));
    
    const data = req.body;
    
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;
    
    console.log('Environment variables check:', {
      hasApiKey: !!AIRTABLE_API_KEY,
      hasBaseId: !!AIRTABLE_BASE_ID,
      hasTableId: !!AIRTABLE_TABLE_ID
    });

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
      console.error('Missing environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
    console.log('Calling Airtable URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: data })
    });

    const result = await response.json();
    console.log('Airtable response status:', response.status);
    console.log('Airtable response:', JSON.stringify(result));

    if (response.ok) {
      return res.status(200).json({
        success: true,
        recordId: result.id
      });
    } else {
      return res.status(response.status).json({
        success: false,
        error: result
      });
    }
    
  } catch (error) {
    console.error('Caught error:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};