// Simulates AI Detection: creates an emergency event with configurable/randomized fields for demonstration.
const minConfidence = process.env.AI_CONFIDENCE_MIN ? parseFloat(process.env.AI_CONFIDENCE_MIN) : 0.91
const maxConfidence = process.env.AI_CONFIDENCE_MAX ? parseFloat(process.env.AI_CONFIDENCE_MAX) : 0.99
const minSeverity = process.env.AI_SEVERITY_MIN ? parseInt(process.env.AI_SEVERITY_MIN, 10) : 2
const maxSeverity = process.env.AI_SEVERITY_MAX ? parseInt(process.env.AI_SEVERITY_MAX, 10) : 3
const lat = process.env.SIMULATION_LAT ? parseFloat(process.env.SIMULATION_LAT) : 12.972
const lng = process.env.SIMULATION_LNG ? parseFloat(process.env.SIMULATION_LNG) : 77.595

function getRandom(min, max) {
  return Math.random() * (max - min) + min
}

const simulatedEvent = {
  event_type: "cardiac_arrest",
  confidence_score: parseFloat(getRandom(minConfidence, maxConfidence).toFixed(2)),
  severity: Math.round(getRandom(minSeverity, maxSeverity)),
  lat: lat,
  lng: lng,
  timestamp: new Date().toISOString()
}

console.log("Simulating AI Detection: Created event:", simulatedEvent)
setContext("emergency_event", simulatedEvent)
console.log("Emergency event simulated and passed to context.")
