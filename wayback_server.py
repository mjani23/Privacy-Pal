from flask import Flask, request, jsonify, render_template,redirect
from flask_cors import CORS
import requests
import html2text
from openai import OpenAI
from extract_privacy import extract_privacy_links
import markdown

client = OpenAI(api_key="APIKEY")
h = html2text.HTML2Text()
h.ignore_links = True
h.ignore_images = True

poly = []


app = Flask(__name__)
CORS(app)


@app.route("/")
def default():
    return redirect("/login",code=302)

# Bens code to get the html, convert it to text, and then send it to the AI model
@app.route("/fetch_html", methods=["POST"])
def fetch_html():
    poly.clear()
    url = request.json.get('url')
    response = requests.get(url, timeout=20)
    if response.status_code == 200:            
        
        html_content = response.text
        
        #gets it into plain text so the AI can read it
        final_text = h.handle(html_content)
        

        #Ai API call that sends the prompy to Open ai and it returns it into markdowm
        ai_response = client.responses.create(model="gpt-4o",
                                        temperature=1,
                                        
                                        instructions="You will be shown a privacy policy. Analyze, summarize, and format the key points as subheaders under a main header called \"Key Points\". After identifying the key points, list under each key point a bulleted explanation. Next, create a new section called \"Potential Issues\" and another called \"Potential Benefits\", each following the same format as the Key Points section. The structure needs to be clean, direct, and easy to digest. This output must be in markdown format, but only utilize bullet points, bold text, and headers. Do not include anything that says '''markdown, just the raw markdown itself. Limit these responses to 1800 characters." , 
                                        input=final_text).output_text
        
        #appends responses for later comparion
        poly.append(ai_response)

        
        #converts the markdown to HTML for formatting
        return jsonify({"html": markdown.markdown(ai_response)})
    else:
        print("Failed: ",response.status_code)
        return jsonify({"error": "Failed"}), response.status_code


@app.route("/privacy_finder")
def privacy_finder():
    return render_template("privacy_finder.html")

@app.route("/displayText")
def display_text():
    return render_template("displayText.html")

@app.route("/comparison", methods=["GET"])
def comp_get():
    return render_template("comparison.html")

@app.route("/comparison", methods=["POST"])
def comparison():
    #Ai API call that sends the prompt to Open ai and it returns it into markdown
    #the API call uses the global list to compare the two policies
    ai_response = client.responses.create(model="gpt-4o",
                                    temperature=1,                                        
                                    instructions= "You will be presented with two privacy policy summaries in markdown format. Please list up to 5 key differences between the policy summaries. **It is possible for there to be no significant differences.** If there are few or no significant differences, you should list fewer than 5 differences, or just say \"There are no significant differences\". Consider highly similar policies to be the same. Once you have identified the differences, list them out in raw markdown format, without starting with ```markdown. Please only respond with what was requested, do not say things like \"here are the key differences\".\nPolicy #1: "+poly[0]+ "\nPolicy #2: "+poly[1] ,
                                    input=poly[0]+ poly[1]).output_text.replace("html","").replace("`","")
        
    poly.clear()
    #returns the comparsion as HTML so it can be formatted 
    return jsonify({"html": markdown.markdown(ai_response)})
    

    
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


#this grabs the snaphots used sumilar code to mentors given code, adjusted to work for our needs  
@app.route("/snapshots", methods=["POST"])
def get_snapshots():
    data = request.get_json()
    url = data.get("url", "").strip()
    date = data.get("date", "").strip()

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    base_url = f"https://web.archive.org/cdx/search/cdx?url={url}&output=json&fl=timestamp,original&collapse=digest"


    if date: # If given date, filter for that day 
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

        # makes timestamps into Wayback snapshot URLs
        results = [
            f"https://web.archive.org/web/{timestamp}/{original}"
            for timestamp, original in data[1:]
        ]

    
        if not date:
            return jsonify([results[0]])

        return results
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#imports the extract_privacy_links 
from extract_privacy import extract_privacy_links

@app.route("/extract-privacy", methods=["POST"])

#grabs our privacy policy links 
def extract_privacy():
    data = request.get_json()
    snapshot_url = data.get("snapshot_url", "").strip()
    if not snapshot_url:
        return jsonify({"error": "No snapshot URL provided"}), 400

    links = extract_privacy_links(snapshot_url)

    return jsonify({"privacy_links": links})


if __name__ == "__main__":
    app.run(port = 1112,debug=True)
