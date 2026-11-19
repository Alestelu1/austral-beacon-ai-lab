/** Non-sensitive liveness probe for preview deployment. */
export function GET(): Response {
  return Response.json(
    { status: "ok", service: "austral-beacon-travel-assistant-preview", previewEnabled: process.env.TRAVEL_ASSISTANT_PREVIEW_ENABLED === "true" },
    { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  );
}
