// Sanitize error messages to prevent leaking internal details
export function sanitizeError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;

    // Don't leak database-specific errors
    if (
      msg.includes("FOREIGN KEY") ||
      msg.includes("UNIQUE constraint") ||
      msg.includes("NOT NULL") ||
      msg.includes("CHECK constraint") ||
      msg.includes("column") ||
      msg.includes("table") ||
      msg.includes("syntax") ||
      msg.includes("database")
    ) {
      return "Invalid request";
    }

    // Safe to return these errors
    if (
      msg.includes("not found") ||
      msg.includes("not owned") ||
      msg.includes("unauthorized") ||
      msg.includes("forbidden")
    ) {
      return msg;
    }

    // Default safe message
    return "An error occurred";
  }

  return "An error occurred";
}
