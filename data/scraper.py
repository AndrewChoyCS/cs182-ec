import requests
import json
import time

# --- Configuration ---
COURSE_ID = "84647"
# TODO: Update with your fresh token from browser Network tab (look for 'x-token' header)
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidG9rZW4iLCJ1c2VyX2lkIjo2NDc3MzksInNlc3Npb25faWQiOjE1NTUwMDcyMywicmVnaW9uIjoiIiwiaWF0IjoxNzY1OTQwNDMzLCJleHAiOjE3NjcxNTAwMzN9.YC74V2hETYQyKWDgaXDqxm_zfiSjQRAwix5VZQg3eNk"
BASE_URL = "https://edstem.org/api"
SEARCH_STRING = "Special Participation A:"
HEADERS = {
    "x-token": TOKEN,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_thread_details(thread_id):
    """Fetches full content and comments for a specific thread."""
    url = f"{BASE_URL}/threads/{thread_id}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        # Return the full response to include comments/answers, not just the thread body
        return response.json()
    return None

def scrape_edstem():
    all_matching_data = []
    offset = 0
    limit = 100
    
    print(f"🚀 Starting crawl for: '{SEARCH_STRING}'...")

    while True:
        # Step 1: Get list of threads with pagination
        list_url = f"{BASE_URL}/courses/{COURSE_ID}/threads?limit={limit}&offset={offset}&sort=new"
        response = requests.get(list_url, headers=HEADERS)
        
        if response.status_code != 200:
            print(f"❌ Error: {response.status_code} - {response.text}")
            break
            
        data = response.json()
        threads = data.get('threads', [])
        
        if not threads:
            print("🏁 No more threads found.")
            break
            
        for t in threads:
            title = t.get('title', '')
            # Step 2: Filter Logic
            if SEARCH_STRING.lower() in title.lower():
                print(f"✅ Found match: {title}")
                # Step 3: Deep dive into the thread to get interactions/comments
                full_thread = get_thread_details(t.get('id'))
                if full_thread:
                    all_matching_data.append(full_thread)
                
                # Be a "good citizen" to avoid rate limits
                time.sleep(0.5) 
        
        offset += limit
        print(f"--- Scanned {offset} threads so far... ---")

    # Step 4: Export to JSON
    with open("interactions.json", "w", encoding="utf-8") as f:
        json.dump(all_matching_data, f, indent=4)
    
    print(f"\n🎉 Done! Saved {len(all_matching_data)} matching interactions to 'interactions.json'.")

if __name__ == "__main__":
    scrape_edstem()


    # wgOHU7.uiTd3S5psq1V9xafPAPBxJyocL1OxENYK9dpVRKP