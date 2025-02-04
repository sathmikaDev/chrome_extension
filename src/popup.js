document.getElementById("startTracking").addEventListener("click", () => {
    const sheetId = document.getElementById("sheetId").value;
    const range = document.getElementById("range").value;
    const userEmail = document.getElementById("userEmail").value;

    if (!sheetId || !range || !userEmail) {
        alert("Please enter all details.");
        return;
    }

    chrome.storage.local.set({ sheetId, range, userEmail }, () => {
        alert("Tracking started for range: " + range);
    });

    chrome.runtime.sendMessage({
        action: "startMonitoring",
        config: { sheetId, range }
    });

    // Send request to Google Apps Script to start monitoring
    fetch("https://script.google.com/macros/s/AKfycbyt1sWAyVWDT_EfR9c0vesUvVXrbXW7_5roj-4lxE1U59AFnheFZFVRKpZv2vxZW5zA/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setSettings", sheetId, range, userEmail })
    }).then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error starting tracking:", error));
});

document.getElementById("stopTracking").addEventListener("click", () => {
    chrome.storage.local.remove(["sheetId", "range", "userEmail"], () => {
        alert("Tracking stopped.");
    });
    document.getElementById("stopTracking").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "stopMonitoring" });
    });
});
