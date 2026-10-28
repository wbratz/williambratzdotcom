// Only the Next.js server calls this endpoint. The browser never receives its key.
export default {
  /** @param {Request} request @param {SecretDatabaseEnv} env */
  async fetch(request, env) {
    const reply = (data, status = 200) =>
      Response.json(data, {
        status,
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    if (
      request.method !== "POST" ||
      new URL(request.url).pathname !== "/query" ||
      !env.DATABASE_KEY
    )
      return reply({ success: false }, 404);
    const supplied = (request.headers.get("Authorization") || "").replace(
      /^Bearer /,
      "",
    );
    if (supplied.length > 256) return reply({ success: false }, 404);
    const encoder = new TextEncoder();
    const actual = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(supplied),
    );
    const expected = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(env.DATABASE_KEY),
    );
    if (!crypto.subtle.timingSafeEqual(actual, expected))
      return reply({ success: false }, 404);
    try {
      if (Number(request.headers.get("Content-Length")) > 16384)
        return reply({ success: false }, 413);
      // Bound the stream even if the client omits Content-Length.
      const reader = request.body?.getReader();
      if (!reader) return reply({ success: false }, 400);
      let text = "";
      let bytes = 0;
      const decoder = new TextDecoder();
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        bytes += part.value.byteLength;
        if (bytes > 16384) {
          await reader.cancel();
          return reply({ success: false }, 413);
        }
        text += decoder.decode(part.value, { stream: true });
      }
      const body = JSON.parse(text + decoder.decode());
      if (
        typeof body.sql !== "string" ||
        !Array.isArray(body.params) ||
        body.params.some(
          (p) => p !== null && typeof p !== "string" && typeof p !== "number",
        )
      )
        return reply({ success: false }, 400);
      const result = await env.DB.prepare(body.sql)
        .bind(...body.params)
        .all();
      return reply({ success: true, result: [result] });
    } catch {
      console.error(JSON.stringify({ event: "secret_database_query_failed" }));
      return reply({ success: false }, 503);
    }
  },
};
