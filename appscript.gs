var webhookURL = "https://ecfd-112-135-204-205.ngrok-free.app/notify";  // Your backend URL

function atEdit(e) {
    Logger.log(e)
    var sheet = e.source.getActiveSheet();
    var range = e.range;
    
    // Get user-tracked range from script properties
    var properties = PropertiesService.getScriptProperties().getProperties();
    var trackedRange = properties["range"];
    Logger.log(trackedRange)

    if (!trackedRange) return; // No tracking set

    var rangeDetails = trackedRange.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
    if (!rangeDetails) return;  // Invalid range

    var startCol = columnToNumber(rangeDetails[1]);
    var startRow = parseInt(rangeDetails[2]);
    var endCol = columnToNumber(rangeDetails[3]);
    var endRow = parseInt(rangeDetails[4]);

    if (range.getRow() >= startRow && range.getRow() <= endRow &&
        range.getColumn() >= startCol && range.getColumn() <= endCol) {
        
        console.log("Change detected in selected range!");

        var payload = {
            sheetId: e.source.getId(),
            sheetName: sheet.getName(),
            cell: range.getA1Notation(),
            newValue: range.getValue()
        };

        Logger.log(payload);

        var options = {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify(payload)
        };

        UrlFetchApp.fetch(webhookURL, options);
    }
}

// Converts column letters (e.g., A, B, AA) to numbers
function columnToNumber(col) {
    var num = 0, pow = 1;
    for (var i = col.length - 1; i >= 0; i--) {
        num += (col.charCodeAt(i) - 64) * pow;
        pow *= 26;
    }
    return num;
}

// Store user settings (triggered from extension)
function setTrackingSettings(sheetId, range, userEmail) {
    Logger.log("Email: " + userEmail);
    var properties = PropertiesService.getScriptProperties();
    properties.setProperty("sheetId", sheetId);
    properties.setProperty("range", range);
    properties.setProperty("userEmail", userEmail);
}

function doPost(e) {
    var data = JSON.parse(e.postData.contents);
    
    if (data.action === "setSettings") {
        setTrackingSettings(data.sheetId, data.range, data.userEmail);
        return ContentService.createTextOutput(JSON.stringify({ status: "Settings stored" }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function testAuthorization() {
    UrlFetchApp.fetch("https://ecfd-112-135-204-205.ngrok-free.app/notify");
}