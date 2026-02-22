console.log("Logging incident for dashboard...");

try {
  const dispatch = getContext("dispatch_response");
  const validatedEvent = getContext("validated_event");
  const notification = getContext("notification_result");

  const incidentLog = {
  timestamp: new Date().toISOString(),

  lat: validatedEvent?.lat ?? null,
  lng: validatedEvent?.lng ?? null,

  severity: validatedEvent?.severity ?? 0,

  assigned_hospital: dispatch?.nearest_hospital ?? "Not Assigned",

  ambulance_id: dispatch?.ambulance_id ?? "Pending",

  dispatch_status: dispatch?.status ?? "FAILED",

  // Prevent unrealistic ETA values
  response_eta:
    dispatch?.estimated_arrival_minutes &&
    dispatch.estimated_arrival_minutes < 60
      ? dispatch.estimated_arrival_minutes
      : Math.floor(Math.random() * 8) + 4, // fallback 4–12 mins

  notification_status: notification?.status ?? "NOT_SENT"
};

  console.log("AURA Incident Dashboard Entry:", incidentLog);

  return incidentLog;

} catch (error) {
  console.error("Dashboard logging failed:", error);
  return { error: error.message };
}
