const axios = require("axios")

console.log("Dispatching Emergency...")
const event = getContext("validated_event")
if (!event) {
  console.log("No valid emergency event to dispatch.")
  setContext("dispatch_response", null)
  return
}

const apiUrl = "https://aur-dispatch.onrender.com/dispatch"
const apiKey = process.env.AURA_DISPATCH_API_KEY

const payload = {
  patient_location: {
    lat: event.lat,
    lng: event.lng
  },
  severity: event.severity,
  confidence_score: event.confidence_score
}

async function main() {
  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey
      },
      timeout: 10000
    })
    setContext("dispatch_response", response.data)
    console.log("Dispatch API responded:", response.data)
    // ✅ ADD FROM HERE
const {
  ambulance_id,
  nearest_hospital,
  estimated_arrival_minutes,
  confidence,
  lat,
  lng
} = response.data

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
  } catch (error) {
    if (error.response) {
      console.error(`Dispatch API error: HTTP ${error.response.status} -`, error.response.data)
      if (error.response.status === 404) {
        console.error("Dispatch API 404 Not Found: Please verify that the backend endpoint is live and URL is correct (currently: ", apiUrl, ")")
      }
    } else {
      console.error("Dispatch API error:", error.message)
    }
    setContext("dispatch_response", null)
  }
}

main()
