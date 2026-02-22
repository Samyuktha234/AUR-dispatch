import twilio from "twilio"

async function main() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_FROM_NUMBER
    const to = process.env.TWILIO_TO_NUMBER

    const client = twilio(accountSid, authToken)

    // ✅ Get data saved from DispatchEmergency.js
    const dispatchData = context.dispatch_response

    if (!dispatchData) {
      throw new Error("No dispatch response found in context")
    }

    const {
      ambulance_id,
      nearest_hospital,
      estimated_arrival_minutes,
      confidence,
      lat,
      lng
    } = dispatchData

    const alertMsg = `
AURA EMERGENCY ALERT 🚨

Ambulance ID: ${ambulance_id}
Hospital: ${nearest_hospital}
ETA: ${estimated_arrival_minutes} minutes
Confidence: ${confidence}
Lat/Lng: ${lat},${lng}
`

    await client.messages.create({
      body: alertMsg,
      from: from,
      to: to
    })

    console.log("SMS sent successfully")

  } catch (error) {
    console.error("SMS sending failed:", error.message)
    throw error
  }
}

main()
