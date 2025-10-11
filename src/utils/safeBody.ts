/**
 * Redacts sensitive fields (like password and token) from request body
 */
export default function safeBody<T extends Record<string, any> | undefined>(
  body: T
): T {
  if (!body) return body;

  const copy = { ...body };

  if ("password" in copy) {
    copy.password = "***";
  }

  if ("token" in copy) {
    copy.token = "***";
  }

  return copy;
}
