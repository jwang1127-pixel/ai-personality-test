const https = require('https');

module.exports = (req, res) => {
  console.log('Request body:', JSON.stringify(req.body));
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

  const postData = JSON.stringify({ fields: data });

  const options = {
    hostname: 'api.airtable.com',
    path: `/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, (response) => {
    let body = '';
    
    response.on('data', (chunk) => {
      body += chunk;
    });
    
    response.on('end', () => {
      try {
        const result = JSON.parse(body);
        
        if (response.statusCode === 200) {
          res.status(200).json({
            success: true,
            recordId: result.id
          });
        } else {
          console.error('Airtable error:', response.statusCode, body);
          res.status(response.statusCode).json({
            success: false,
            error: result,
            statusCode: response.statusCode,
            rawError: body
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to parse response'
        });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({
      success: false,
      error: error.message
    });
  });

  request.write(postData);
  request.end();
};