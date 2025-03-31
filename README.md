Set Up virtual enviornment: 
    python3 -m venv venv
    source venv/bin/activate

Install Dependencies:
    pip install flask flask-cors requests


Run the Server: 
    python wayback_server.py

File Structure
    wayback_server.py - Flask backend
    templates/ - HTML pages
    static/ - JavaScript and CSS files


What needs to be done: 
    Grab most recent privacy policy, and store it 
    Break Privacy Policy into key parts 
    Compare them using LLM with clear prompts 
    present differences 
    