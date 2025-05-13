**--Privacy Pal--**  

**Summary**    
Privacy Pal is a web application that helps users easily understand website privacy policy changes without reading pages of legal text.    

****Features****          
**-Snapshot Retrieval:**    
Users enter a website URL, and Privacy Pal automatically fetches two versions of the site’s privacy policy — one from today and one from a month ago — using the Internet Archive’s Wayback Machine.  

**-Privacy Link Discovery:**
Privacy Pal finds the privacy policy links on both snapshots using keyword search (“privacy,” “data,” “cookies”) powered by BeautifulSoup.    

**-AI Summarization:**    
Each privacy policy is summarized into a short, plain English version using OpenAI’s GPT-4o model.    

**Change Tracking:**   
Summaries for the two policy versions are shown side by side so users can easily spot any updates, differences, or important changes.    

**-User Authentication:**    
Firebase Authentication is used to secure login/logout for users.    


**Tech Stack**        
Backend:    
    Python, Flask, BeautifulSoup, Requests, html2text, OpenAI API  
    
Frontend:    
    JavaScript (vanilla), HTML, CSS    
    
Authentication:    
    Firebase Authentication    

****Setup Instructions:** **         
**Set up virtual environment:**
python3 -m venv venv    
source venv/bin/activate    

**Install Dependencies:**   
    pip install flask flask-cors requests selenium beautifulsoup4 lxml html2text openai    
    
**Run the Server:**    
    python wayback_server.py    



**Photos**     
<img width="666" alt="step_1" src="https://github.com/user-attachments/assets/832e6818-03d3-41db-b1c0-6d087e402447" />    
<img width="1140" alt="step_3" src="https://github.com/user-attachments/assets/6c4763ca-7ba4-47c6-a7a8-c0b2aaf4cebd" />    
<img width="1136" alt="step_4" src="https://github.com/user-attachments/assets/af5052d5-b79f-4165-a68a-4ec9e253261a" />    
<img width="735" alt="step_5" src="https://github.com/user-attachments/assets/195ba515-452f-4399-9b58-40387c9850b8" />    
<img width="1113" alt="step_6" src="https://github.com/user-attachments/assets/3c71686b-38f8-4f9a-ac7e-9c022c2e1345" />    


