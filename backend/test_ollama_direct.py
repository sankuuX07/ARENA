import urllib.request
import json

data = json.dumps({
    'model': 'gemma4:31b-cloud',
    'messages': [{'role': 'user', 'content': 'Generate a JSON array with one object {"hello": "world"}. Do not include markdown fences.'}],
    'stream': False
}).encode('utf-8')

req = urllib.request.Request('http://localhost:11434/api/chat', data=data, headers={'Content-Type': 'application/json'}, method='POST')

try:
    res = urllib.request.urlopen(req)
    out = json.loads(res.read().decode('utf-8'))
    print(out['message']['content'])
except Exception as e:
    print(f"Error: {e}")
