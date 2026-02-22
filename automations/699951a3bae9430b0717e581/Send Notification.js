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

const alertMsg = `🚨 AURA EMERGENCY ALERT\n` + `Ambulance ID: ${dispatch.ambulance_id}\n` + `Hospital: ${dispatch.nearest_hospital}\n` + `ETA: ${dispatch.estimated_arrival_minutes} minutes\n` + `Confidence: ${event.confidence_score}\n` + `Lat/Lng: ${event.lat},${event.lng}`

client.messages
  .create({
    body: alertMsg,
    from,
    to
  })
  .then(message => {
    setContext("notification_result", { sid: message.sid, status: message.status })
    console.log("Twilio SMS sent, SID:", message.sid)
  })
  .catch(e => {
    console.error("Twilio SMS failed:", e.message)
    setContext("notification_result", null)
  })
