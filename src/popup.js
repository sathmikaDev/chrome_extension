document.getElementById("saveSettings").addEventListener("click", async () => {
    const sheetId = document.getElementById("sheetId").value;
    const cellRange = document.getElementById("cellRange").value;
    const email = document.getElementById("email").value;

    if (!sheetId || !cellRange || !email) {
        alert("Please fill in all fields!");
        return;
    }

    chrome.storage.sync.set({ sheetId, cellRange, email }, () => {
        alert("Settings saved. Monitoring enabled!");
        chrome.runtime.sendMessage({ action: "startMonitoring" });
    });
});
