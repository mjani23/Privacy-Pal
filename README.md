Set Up virtual enviornment: 
    python3 -m venv venv
    source venv/bin/activate

Install Dependencies:
    pip install flask flask-cors requests
    pip install selenium beautifulsoup4 lxml


Run the Server: 
    python wayback_server.py


File Structure
    wayback_server.py - Flask backend
    templates/ - HTML pages
    static/ - JavaScript and CSS files


What needs to be done: 
    Break Privacy Policy into key parts 
    Compare them using LLM with clear prompts 
    present differences 
    
    
Flask: (run server and connect website to our Python code)
    Show pages like login and dashboard
    Handle buttons and forms
    Run Python functions when users click things