const GOOGLE_API_KEY = "AIzaSyDSxAA9WnOSA_6hd9nKgWhxeSTmLuEHrQM";
let previousData = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startMonitoring") {
        monitorSheet();
    }
});

async function monitorSheet() {
    chrome.storage.sync.get(["sheetId", "cellRange", "email"], async (data) => {
        if (!data.sheetId || !data.cellRange || !data.email) {
            console.error("Missing settings!");
            return;
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${data.sheetId}/values/${data.cellRange}?key=${GOOGLE_API_KEY}`;
        
        try {
            const response = await fetch(url);
            const result = await response.json();
            console.log(result)

            if (JSON.stringify(previousData) !== JSON.stringify(result.values)) {
                previousData = result.values;
                sendEmailNotification(data.email);
            }

            setTimeout(monitorSheet, 60000); // Check every minute
        } catch (error) {
            console.error("Error fetching Google Sheets data:", error);
        }
    });
}

function sendEmailNotification(userEmail) {
    fetch("https://ecfd-112-135-204-205.ngrok-free.app/notify", { // Change to your deployed API URL later
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: userEmail,
            subject: "Viva Schedule Updated!",
            text: "A change has been detected in your monitored Google Sheet range."
        })
    })
    .then(response => response.json())
    .then(data => console.log("Email sent:", data))
    .catch(error => console.error("Email sending failed:", error));
}

