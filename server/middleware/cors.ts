export default defineEventHandler((event) => {
  // Define allowed origins (Add your production URL and Tauri defaults)
  const allowedOrigins = [
    "https://rimelight.com",
    "tauri://localhost",
    "http://localhost:1420", // Default Tauri dev port
  ];

  const origin = getRequestHeader(event, "origin");

  if (origin && allowedOrigins.includes(origin)) {
    setResponseHeaders(event, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    });
  }

  // Handle SPA/Game Engine preflight (OPTIONS) requests
  if (getMethod(event) === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.statusMessage = "No Content";
    return "";
  }
});
