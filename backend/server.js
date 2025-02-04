const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(bodyParser.json());
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Load SendGrid API key from .env

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Server is running successfully!" });
});


// Webhook endpoint for Google Sheets changes
app.post("/notify", (req, res) => {
    const { sheetId, sheetName, cell, newValue } = req.body;

    if (!sheetId || !cell || !newValue) {
        return res.status(400).send("Missing required data.");
    }

    const msg = {
        to: process.env.USER_EMAIL, // Load email from .env
        from: process.env.FROM_EMAIL, // Your verified SendGrid sender email
        subject: "Google Sheet Update Alert",
        text: `Change detected in ${sheetName} (Sheet ID: ${sheetId})!\nCell: ${cell}\nNew Value: ${newValue}`
    };

    sgMail.send(msg)
        .then(() => res.status(200).send("Notification sent."))
        .catch(error => res.status(500).send("Error sending notification."));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
