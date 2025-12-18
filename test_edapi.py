
from edapi import EdAPI
import os

# Token provided by user
API_TOKEN = "wgOHU7.uiTd3S5psq1V9xafPAPBxJyocL1OxENYK9dpVRKP"
os.environ["ED_API_TOKEN"] = API_TOKEN

def test():
    ed = EdAPI()
    try:
        ed.login()
        print("Logged in.")
        # Try to get a specific thread that we know exists
        tid = 7452189
        
        # Test 1: get_thread
        if hasattr(ed, 'get_thread'):
            print("Method get_thread exists.")
            t = ed.get_thread(tid)
            print("Keys in thread:", t.keys())
            if 'comments' in t:
                print("Found comments field!")
            else:
                print("No comments field in response.")
        else:
            print("Method get_thread DOES NOT exist.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
