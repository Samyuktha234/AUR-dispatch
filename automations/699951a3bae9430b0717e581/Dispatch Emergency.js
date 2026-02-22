const axios = require("axios")

async function main() {
  try {
    const apiUrl = process.env.DISPATCH_API_URL
    const apiKey = process.env.DISPATCH_API_KEY

    // Payload sent to Flask backend
    const lat = getContext("lat")
    const lng = getContext("lng")
    const severity = getContext("severity")
    const payload = {
      patient_location: {
        lat: lat,
        lng: lng
      },
      severity: severity || 1
    }

    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      },
      timeout: 10000
    })

    console.log("Dispatch API responded:", response.data)

    // ✅ Save backend response to Turbotic context
    setContext("dispatch_response", response.data)
  } catch (error) {
    console.error("Dispatch API error:", error.message)
    throw error
  }
}

main()
