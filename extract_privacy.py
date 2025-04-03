from bs4 import BeautifulSoup
import requests

# privacy keywords 
PRIVACY_KEYWORDS = ["privacy", "data", "cookies"]

def extract_privacy_links(snapshot_url):
    try:
        #using beautifulsoup to parse the html content (seems like a popular libbrary for scraping)
        res = requests.get(snapshot_url, timeout=15)
        soup = BeautifulSoup(res.text, "lxml")
        a_tags = soup.find_all("a")
        matches = []

        # check for our key words 
        for a in a_tags:
            href = a.get("href", "").lower() 
            text = (a.text or "").lower()     
            matched = False  

            # check if is in href or text
            for keyword in PRIVACY_KEYWORDS:
                if keyword in href or keyword in text:
                    matched = True

            # store it 
            if matched and href and href not in matches:
                matches.append(href)

        return matches

    except Exception as e:
        print("Failed to extract:", e)
        return []