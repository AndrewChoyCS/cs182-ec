
// Configuration
const CONFIG = {
    courseId: "84647",
    searchString: "Special Participation A:",
    limit: 100 // items per page
};

// ---------------------------------------------------------
// IMPORTANT: PASTE YOUR TOKEN BELOW
// ---------------------------------------------------------
const MANUAL_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidG9rZW4iLCJ1c2VyX2lkIjo2NDc3MzksInNlc3Npb25faWQiOjE1NTUwMDcyMywicmVnaW9uIjoiIiwiaWF0IjoxNzY1OTQwNDMzLCJleHAiOjE3NjcxNTAwMzN9.YC74V2hETYQyKWDgaXDqxm_zfiSjQRAwix5VZQg3eNk";
// ---------------------------------------------------------

function getAuthToken() {
    if (MANUAL_TOKEN && MANUAL_TOKEN !== "YOUR_TOKEN_HERE") {
        return MANUAL_TOKEN;
    }
    // Attempt to find token in localStorage
    const token = localStorage.getItem('token');
    if (token) return token;

    return null;
}

const token = getAuthToken();

if (!token) {
    console.error("❌ CRTICAL ERROR: Could not find a token.");
    console.log("%c👉 PLEASE FOLLOW THESE STEPS:", "font-weight: bold; font-size: 14px; color: orange;");
    console.log("1. Go to the Network tab in Developer Tools.");
    console.log("2. Refresh the page.");
    console.log("3. Click on any request (like 'user' or 'threads').");
    console.log("4. Scroll down to 'Request Headers' and copy the value for 'x-token'.");
    console.log("5. Paste it securely into the 'MANUAL_TOKEN' variable at the top of this script.");
}

const HEADERS = {
    'x-token': token
};

async function scrapeEdStem() {
    if (!token) return; // Stop if no token

    console.log(`🚀 Starting crawl for: '${CONFIG.searchString}'...`);

    let allMatchingData = [];
    let offset = 0;
    let hasMore = true;

    // Helper to sleep
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    while (hasMore) {
        // Construct URL for list of threads
        const listUrl = `/api/courses/${CONFIG.courseId}/threads?limit=${CONFIG.limit}&offset=${offset}&sort=new`;

        try {
            const response = await fetch(listUrl, { headers: HEADERS });
            if (!response.ok) {
                console.error(`❌ Error fetching threads: ${response.status}`);
                if (response.status === 401) {
                    console.error("⛔️ Your token is invalid or expired. Please get a fresh one from the Network tab.");
                }
                break;
            }

            const data = await response.json();
            const threads = data.threads || [];

            if (threads.length === 0) {
                console.log("🏁 No more threads found.");
                hasMore = false;
                break;
            }

            for (const t of threads) {
                const title = t.title || "";

                // Filter Logic
                if (title.toLowerCase().includes(CONFIG.searchString.toLowerCase())) {
                    console.log(`✅ Found match: ${title}`);

                    // Fetch full details
                    const detailUrl = `/api/threads/${t.id}`;
                    const detailResp = await fetch(detailUrl, { headers: HEADERS });

                    if (detailResp.ok) {
                        const detailData = await detailResp.json();
                        // Save the whole object (usually contains 'thread' and 'users' etc)
                        allMatchingData.push(detailData);
                    } else {
                        console.warn(`⚠️ Failed to fetch details for thread ${t.id}`);
                    }

                    // Be nice to the API
                    await sleep(500);
                }
            }

            offset += CONFIG.limit;
            console.log(`--- Scanned ${offset} threads so far... ---`);

            // Safety break for testing (optional, remove if you want full crawl)
            // if (offset > 1000) break; 

            await sleep(500);

        } catch (e) {
            console.error("Critical error:", e);
            break;
        }
    }

    console.log(`🎉 Done! Found ${allMatchingData.length} matches.`);

    if (allMatchingData.length > 0) {
        // Download as JSON
        const blob = new Blob([JSON.stringify(allMatchingData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "interactions.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Run it
scrapeEdStem();
