from http.server import BaseHTTPRequestHandler
import json
import os
import requests

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        AIRTABLE_API_KEY = os.environ.get('AIRTABLE_API_KEY')
        AIRTABLE_BASE_ID = os.environ.get('AIRTABLE_BASE_ID')
        AIRTABLE_TABLE_ID = os.environ.get('AIRTABLE_TABLE_ID')
        
        record_id = data.get('recordId')
        purchase_intent = data.get('purchaseIntent')
        
        url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_ID}/{record_id}"
        
        headers = {
            'Authorization': f'Bearer {AIRTABLE_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "fields": {
                "purchase_intent": purchase_intent
            }
        }
        
        try:
            response = requests.patch(url, headers=headers, json=payload)
            
            self.send_response(200 if response.status_code == 200 else response.status_code)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': response.status_code == 200
            }).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()