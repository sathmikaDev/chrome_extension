const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/notify", async (req, res) => {
    try {
        const { sheetId, sheetName, cell, newValue, userEmail } = req.body;

        if (!sheetId || !cell || !newValue || !userEmail) {
            return res.status(400).json({ error: "Missing required data" });
        }

        const msg = {
            to: userEmail,
            from: process.env.FROM_EMAIL,
            subject: "Google Sheet Update Alert",
            text: `Change detected in ${sheetName} (Sheet ID: ${sheetId})!
                   Cell: ${cell}
                   New Value: ${newValue}`
        };

        await sgMail.send(msg);
        res.status(200).json({ message: "Notification sent successfully" });

    } catch (error) {
        console.error("Notification error:", error);
        res.status(500).json({ error: "Failed to send notification" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));