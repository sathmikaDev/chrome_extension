function initializeTracking(config) {
    const { sheetId, range, userEmail } = config;

    function onEdit(e) {
        var sheet = e.source;
        var editedRange = e.range;
        var webhookURL = "https://4666-112-135-186-82.ngrok-free.app/notify";

        var properties = PropertiesService.getScriptProperties();
        var trackedRange = properties.getProperty("range");
        var trackedEmail = properties.getProperty("userEmail");

        if (!trackedRange || !trackedEmail) return;

        if (editedRange.getA1Notation().includes(trackedRange)) {
            var payload = {
                sheetId: sheet.getId(),
                sheetName: sheet.getName(),
                cell: editedRange.getA1Notation(),
                newValue: editedRange.getValue(),
                userEmail: trackedEmail
            };

            var options = {
                'method': 'post',
                'contentType': 'application/json',
                'payload': JSON.stringify(payload)
            };

            UrlFetchApp.fetch(webhookURL, options);
        }
    }

    function setupTracking() {
        var properties = PropertiesService.getScriptProperties();
        properties.setProperty("sheetId", sheetId);
        properties.setProperty("range", range);
        properties.setProperty("userEmail", userEmail);

        // Remove existing triggers first
        var triggers = ScriptApp.getProjectTriggers();
        triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

        // Create new trigger
        ScriptApp.newTrigger('onEdit')
            .forSpreadsheet(SpreadsheetApp.getActive())
            .onEdit()
            .create();

        return "Tracking setup complete";
    }

    return setupTracking();
}

function removeTracking() {
    var triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
    PropertiesService.getScriptProperties().deleteAllProperties();
    return "Tracking removed";
}
