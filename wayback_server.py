from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")

#Routes for web pages 
@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/create-account")
def create_account():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/snapshot")
def snapshot():
    return render_template("snapshot.html")


@app.route("/snapshots", methods=["POST"])
#this grabs the snaphots used sumilar code to mentors given code, adjusted to work for our needs  
def get_snapshots():
    data = request.get_json()
    url = data.get("url", "").strip()
    date = data.get("date", "").strip()

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    base_url = f"https://web.archive.org/cdx/search/cdx?url={url}&output=json&fl=timestamp,original&collapse=digest"

    if date:
        try:
            yyyymmdd = date.replace("-", "")
            from_date = f"{yyyymmdd}000000"
            to_date = f"{yyyymmdd}235959"
            base_url += f"&from={from_date}&to={to_date}"
        except:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    else:
        base_url += "&sort=descending"

    try:
        print("Fetching URL:", base_url)
        response = requests.get(base_url, timeout=30)
        response.raise_for_status()
        data = response.json()

        if len(data) <= 1:
            return []

        results = [
            f"https://web.archive.org/web/{timestamp}/{original}"
            for timestamp, original in data[1:]
        ]

    
        if not date:
            return [results[0]]

        return results
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
