export const STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;


// 200 OK – The request succeeded and you're returning a response body.

// 201 Created – A new resource was successfully created.

// 204 No Content – The request succeeded but there's no response body to return.

// 301 Moved Permanently – The resource has permanently moved to a new URL.

// 302 Found – The resource temporarily resides at a different URL.

// 304 Not Modified – Cached version is still valid; no need to send data again.

// 400 Bad Request – The client sent invalid or malformed request data.

// 401 Unauthorized – Authentication is required or invalid.

// 403 Forbidden – Client is authenticated but lacks permission.

// 404 Not Found – The requested resource or endpoint doesn’t exist.

// 409 Conflict – Request conflicts with server state (duplicate or version issue).

// 422 Unprocessable Entity – Request is well-formed but validation failed.

// 500 Internal Server Error – Unexpected server-side error occurred.

// 502 Bad Gateway – Upstream server sent an invalid response.

// 503 Service Unavailable – Server temporarily cannot handle the request.

// 504 Gateway Timeout – Upstream server took too long to respond.