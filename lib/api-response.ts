export async function readApiResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json().catch(() => null);
  const error = data && typeof data === "object" && "error" in data ? data.error : undefined;
  if (!response.ok) {
    throw new Error(
      typeof error === "string"
        ? error
        : "The service is temporarily unavailable. Please try again or contact us on WhatsApp.",
    );
  }
  if (!data || typeof data !== "object") {
    throw new Error("The server returned an incomplete response. Please try again.");
  }
  return data as T;
}
