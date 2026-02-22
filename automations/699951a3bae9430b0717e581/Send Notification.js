const twilio = require("twilio")

console.log("Preparing to send notification via Twilio...")
let dispatch, event
try {
  dispatch = getContext("dispatch_response")
  event = getContext("validated_event")
} catch (err) {
  console.error("Error: Required context keys not available:", err.message)
  setContext("notification_result", null)
  return
}

if (!dispatch || !event) {
  console.log("Missing dispatch or event data, cannot send notification.")
  setContext("notification_result", null)
  return
}

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const from = process.env.TWILIO_FROM_NUMBER
const to = process.env.TWILIO_TO_NUMBER

const client = twilio(accountSid, authToken)
const alertMsg = AURA EMERGENCY ALERT 🚨

Ambulance ID: {{ambulance_id}}
Hospital: {{nearest_hospital}}
ETA: {{estimated_arrival_minutes}} minutes
Confidence: {{confidence}}
Lat/Lng: {{lat}},{{lng}}
