from flask import Flask, Response
import urllib.request

app = Flask(__name__)

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as res:
        return res.read()

@app.route('/mct/<name>')
def mct(name):
    data = fetch(f'https://mctiers.com/api/v2/profile/by-name/{name}')
    return Response(data, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'})

@app.route('/pvp/<name>')
def pvp(name):
    data = fetch(f'https://pvptiers.com/api/search_profile/{name}')
    return Response(data, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'})

@app.route('/sub/<name>')
def sub(name):
    data = fetch(f'https://subtiers.net/api/search_profile/{name}')
    return Response(data, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'})

if __name__ == '__main__':
    app.run()
