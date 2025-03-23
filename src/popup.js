require("dotenv").config();

// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const statusDiv = document.getElementById("status");

  document
    .getElementById("startTracking")
    .addEventListener("click", async () => {
      try {
        const sheetId = document.getElementById("sheetId").value.trim();
        const range = document.getElementById("range").value.trim();
        const userEmail = document.getElementById("userEmail").value.trim();

        if (!sheetId || !range || !userEmail) {
          throw new Error("Please fill in all fields");
        }

        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab.url.includes("docs.google.com/spreadsheets")) {
          throw new Error("Please open the Google Sheet you want to track");
        }

        chrome.storage.local.set({ sheetId, range, userEmail }, () => {
          alert("Tracking started for range: " + range);
        });

        const projectKey = process.env.PROJECT_KEY;

        // Send request to Google Apps Script to start monitoring
        fetch(`https://script.google.com/macros/s/${projectKey}/exec`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "setSettings",
            sheetId,
            range,
            userEmail,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error starting tracking:", error));

        statusDiv.textContent = "Tracking started!";
      } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
      }
    });

  document
    .getElementById("stopTracking")
    .addEventListener("click", async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        console.log(tab);

        chrome.storage.local.remove(["sheetId", "range", "userEmail"], () => {
          alert("Tracking stopped.");
        });

        statusDiv.textContent = "Tracking stopped";
      } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
      }
    });
});
