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

    // Send request to Google Apps Script to start monitoring
    fetch("https://script.google.com/macros/s/AKfycbwP1fx-v6S1eIu85hQ9NPO8Hrz7IL3d5E4bkOaVO8rmtqeZNAy_-V3S5mO4wvZG1R7G/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetId, range, userEmail })
    }).then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error starting tracking:", error));
});

document.getElementById("stopTracking").addEventListener("click", () => {
    chrome.storage.local.remove(["sheetId", "range", "userEmail"], () => {
        alert("Tracking stopped.");
    });
});
