from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import requests
import html2text
client = OpenAI(api_key="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")



h = html2text.HTML2Text()
h.ignore_links = True
h.ignore_images = True


app = Flask(__name__)

@app.route('/',methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/fetch_html', methods=['POST'])
def fetch_html():
    url = request.json.get('url')

    response = requests.get(url)
    if response.status_code == 200:            
        html_content = response.text
        final_text = h.handle(html_content)
        ai_response = client.responses.create(model="gpt-4o",
                                        instructions="Take this privacy policy and give me the key points about it, any potential issues, and any potenial benefits we have. Provide the response as plain text, which means: no bold, no italics, no headers, no bullet points, no links, no code blocks. Just words, without any special characters.",
                                        input=final_text).output_text
        
        
            
        return jsonify({"html": ai_response})
    else:
        print("Failed: ",response.status_code)
        return jsonify({"error": "Failed"}), response.status_code
    
    

if __name__ == '__main__':
    app.run(port=8000)

