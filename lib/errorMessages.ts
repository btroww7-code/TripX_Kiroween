/**
 * Error Messages Utility
 * 
 * Maps technical errors to user-friendly messages.
 * Removes stack traces, file paths, and technical details.
 * 
 * Requirements: 21.1, 21.5
 */

// Common error patterns and their user-friendly messages
const ERROR_PATTERNS: { pattern: RegExp; message: string }[] = [
  // Network errors
  { pattern: /network|fetch|ECONNREFUSED|ETIMEDOUT|ERR_NETWORK/i, message: 'Unable to connect. Please check your internet connection and try again.' },
  { pattern: /timeout|timed out/i, message: 'The request took too long. Please try again.' },
  
  // API errors
  { pattern: /401|unauthorized|authentication/i, message: 'Please sign in to continue.' },
  { pattern: /403|forbidden|permission/i, message: 'You don\'t have permission to do this.' },
  { pattern: /404|not found/i, message: 'The requested resource was not found.' },
  { pattern: /429|rate limit|too many requests/i, message: 'Too many requests. Please wait a moment and try again.' },
  { pattern: /500|internal server|server error/i, message: 'Something went wrong on our end. Please try again later.' },
  { pattern: /502|bad gateway/i, message: 'Service temporarily unavailable. Please try again.' },
  { pattern: /503|service unavailable/i, message: 'Service is temporarily down for maintenance.' },
  
  // Wallet/Web3 errors
  { pattern: /user rejected|user denied|rejected by user/i, message: 'Transaction was cancelled.' },
  { pattern: /insufficient funds|not enough/i, message: 'Insufficient funds for this transaction.' },
  { pattern: /wallet.*connect|connect.*wallet/i, message: 'Please connect your wallet to continue.' },
  { pattern: /chain.*mismatch|wrong.*network|switch.*network/i, message: 'Please switch to the correct network.' },
  { pattern: /nonce|replacement.*underpriced/i, message: 'Transaction conflict. Please try again.' },
  { pattern: /gas.*estimate|out of gas/i, message: 'Transaction failed. Please try again with more gas.' },
  
  // AI/Gemini errors
  { pattern: /gemini|ai.*generation|model.*error/i, message: 'AI service is temporarily unavailable. Please try again.' },
  { pattern: /quota|limit.*exceeded/i, message: 'Service limit reached. Please try again later.' },
  
  // Supabase errors
  { pattern: /supabase|database|postgres/i, message: 'Database error. Please try again.' },
  { pattern: /duplicate|already exists|unique.*constraint/i, message: 'This item already exists.' },
  { pattern: /foreign key|reference/i, message: 'Related data not found.' },
  
  // Validation errors
  { pattern: /invalid|validation|required field/i, message: 'Please check your input and try again.' },
  { pattern: /email.*invalid|invalid.*email/i, message: 'Please enter a valid email address.' },
  
  // File/Upload errors
  { pattern: /file.*too.*large|size.*exceeded/i, message: 'File is too large. Please choose a smaller file.' },
  { pattern: /unsupported.*format|invalid.*type/i, message: 'File format not supported.' },
  { pattern: /upload.*failed/i, message: 'Upload failed. Please try again.' },
];

/**
 * Converts a technical error to a user-friendly message
 */
export function getUserFriendlyMessage(error: Error | string | unknown): string {
  const errorString = getErrorString(error);
  
  // Check against known patterns
  for (const { pattern, message } of ERROR_PATTERNS) {
    if (pattern.test(errorString)) {
      return message;
    }
  }
  
  // Default fallback message
  return 'Something went wrong. Please try again.';
}

/**
 * Extracts error string from various error types
 */
function getErrorString(error: Error | string | unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object') {
    // Handle API error responses
    const obj = error as Record<string, unknown>;
    if (obj.message && typeof obj.message === 'string') {
      return obj.message;
    }
    if (obj.error && typeof obj.error === 'string') {
      return obj.error;
    }
    if (obj.statusText && typeof obj.statusText === 'string') {
      return obj.statusText;
    }
  }
  
  return String(error);
}

/**
 * Checks if an error message is user-friendly (no technical details)
 */
export function isUserFriendlyMessage(message: string): boolean {
  const technicalPatterns = [
    /at\s+\w+\s*\(/,           // Stack trace: "at functionName ("
    /\.(ts|tsx|js|jsx):\d+/,   // File paths: ".ts:123"
    /node_modules/,             // Node modules path
    /Error:\s*\w+Error/,        // Technical error names
    /\[object\s+\w+\]/,         // Object representations
    /undefined|null/i,          // Undefined/null references
    /TypeError|ReferenceError|SyntaxError/i, // JS error types
    /ENOENT|EACCES|EPERM/,      // System error codes
    /0x[0-9a-f]+/i,             // Hex addresses
  ];
  
  return !technicalPatterns.some(pattern => pattern.test(message));
}

/**
 * Sanitizes an error for logging (removes sensitive data)
 */
export function sanitizeErrorForLogging(error: Error | string | unknown): string {
  const errorString = getErrorString(error);
  
  // Remove potential sensitive data
  return errorString
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, 'Bearer [REDACTED]')
    .replace(/api[_-]?key[=:]\s*["']?[^"'\s]+["']?/gi, 'api_key=[REDACTED]')
    .replace(/password[=:]\s*["']?[^"'\s]+["']?/gi, 'password=[REDACTED]')
    .replace(/token[=:]\s*["']?[^"'\s]+["']?/gi, 'token=[REDACTED]')
    .replace(/0x[a-fA-F0-9]{40}/g, '0x[ADDRESS]')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
}

export default { getUserFriendlyMessage, isUserFriendlyMessage, sanitizeErrorForLogging };
