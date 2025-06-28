const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
const port = 3000;

// Load credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("PHONE:", process.env.TWILIO_PHONE);

if (!accountSid || !authToken || !twilioPhone) {
  console.error("❌ Missing Twilio credentials. Check your .env file.");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/send-sms', async (req, res) => {
  const { phone, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phone
    });

    console.log('✅ Message sent:', response.sid);
    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    res.status(500).json({ success: false, error: 'Failed to send message.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
