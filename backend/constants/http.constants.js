exports.CODE = Object.freeze({
  OK: 200, // Success
  CREATED: 201, // Resource created successfully
  NO_CONTENT: 204, // No content to send in response
  BAD_REQUEST: 400, // Invalid request format or parameters
  UNAUTHORIZED: 401, // Authentication required or failed
  FORBIDDEN: 403, // Access denied to the requested resource
  NOT_FOUND: 404, // Resource not found
  CONFLICT: 409, // Conflict with the current state of the resource
  INTERNAL_SERVER_ERROR: 500, // Server encountered an error
});

exports.CUSTOM_CODE = Object.freeze({
  AUTH: {
    INVALID_CREDENTIALS: 1001, // Invalid username or password
    USER_NOT_FOUND: 1002, // User not found in the database
    PASSWORD_MISMATCH: 1003, // Passwords do not match
    USER_ALREADY_EXISTS: 1004, // User already exists in the database
    INVALID_TOKEN: 1005, // Invalid or expired token
    NO_TOKEN_FOUND: 1007, // No token found in the request
    PERMISSION_ADMIN: 1006, // Trying to create an admin user on registration
  },
  API: {
    ALREADY_EXISTS: 2001, // Resource already exists
    ERROR_GETTING_RESOURCE: 2002, // Error creating resource
  },
  GENERAL: {
    BAD_REQUEST: 3333, // General bad request error
    OTHER: 9999, // Other general errors
  },
});
