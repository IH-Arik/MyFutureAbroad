// Request deduplication for sensitive operations
// Prevents duplicate submissions when users double-click buttons

interface PendingRequest {
  timestamp: number;
  responsePromise: Promise<any>;
  response?: any;
  error?: any;
}

const pendingRequests = new Map<string, PendingRequest>();
const REQUEST_TIMEOUT = 5000; // 5 seconds
const CACHE_DURATION = 30000; // 30 seconds to return cached response

export function getDeduplicationKey(
  userId: string,
  method: string,
  path: string,
  body?: any
): string {
  // Create a hash of the request
  const bodyStr = body ? JSON.stringify(body) : "";
  return `${userId}:${method}:${path}:${bodyStr}`;
}

export async function deduplicateRequest<T>(
  key: string,
  handler: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = pendingRequests.get(key);

  // If request is still pending or recently completed, return cached
  if (existing) {
    if (now - existing.timestamp < REQUEST_TIMEOUT) {
      // Still pending
      return existing.responsePromise;
    } else if (now - existing.timestamp < CACHE_DURATION) {
      // Recently completed - return cached response
      if (existing.error) throw existing.error;
      return existing.response;
    }
  }

  // Execute new request
  const promise = handler().then(
    (response) => {
      const entry = pendingRequests.get(key);
      if (entry) {
        entry.response = response;
      }
      return response;
    },
    (error) => {
      const entry = pendingRequests.get(key);
      if (entry) {
        entry.error = error;
      }
      throw error;
    }
  );

  pendingRequests.set(key, {
    timestamp: now,
    responsePromise: promise,
  });

  // Cleanup old entries periodically
  if (pendingRequests.size > 100) {
    for (const [k, v] of pendingRequests.entries()) {
      if (now - v.timestamp > CACHE_DURATION) {
        pendingRequests.delete(k);
      }
    }
  }

  return promise;
}
