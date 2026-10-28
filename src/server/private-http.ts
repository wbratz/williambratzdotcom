import type { IncomingHttpHeaders } from "node:http";

export type PrivateHeaders = string | number | readonly string[] | undefined;
export interface PrivateResponse {
  statusCode: number;
  setHeader(name: string, value: string | number | readonly string[]): unknown;
  getHeader(name: string): PrivateHeaders;
}
export interface PrivateApiResponse extends PrivateResponse {
  status(code: number): PrivateApiResponse;
  json(value: unknown): PrivateApiResponse;
  send(value: Uint8Array | string): PrivateApiResponse;
  end(): PrivateApiResponse;
}
export type PrivateApiRequest = {
  method: string;
  headers: IncomingHttpHeaders;
  body?: unknown;
  query: Record<string, string | undefined>;
};

export function privateContext(request: Request) {
  const headers = new Map<string, string | number | readonly string[]>();
  let body: BodyInit | null = null;
  const res: PrivateApiResponse = {
    statusCode: 200,
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);
      return this;
    },
    getHeader(name) {
      return headers.get(name.toLowerCase());
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      body = JSON.stringify(value);
      this.setHeader("Content-Type", "application/json");
      return this;
    },
    send(value) {
      body = typeof value === "string" ? value : new Uint8Array(value);
      return this;
    },
    end() {
      return this;
    },
  };
  const req: PrivateApiRequest = {
    method: request.method,
    headers: Object.fromEntries(request.headers),
    query: Object.fromEntries(new URL(request.url).searchParams),
  };
  function responseHeaders() {
    const result = new Headers();
    for (const [key, value] of headers) {
      if (Array.isArray(value))
        for (const entry of value) result.append(key, entry);
      else result.set(key, String(value));
    }
    return result;
  }
  return {
    req,
    res,
    responseHeaders,
    response: () =>
      new Response(body, {
        status: res.statusCode,
        headers: responseHeaders(),
      }),
  };
}

export async function privateApi(
  request: Request,
  handler: (
    req: PrivateApiRequest,
    res: PrivateApiResponse,
  ) => Promise<unknown>,
  params: Record<string, string | undefined> = {},
) {
  const context = privateContext(request);
  Object.assign(context.req.query, params);
  if (request.method === "POST") {
    const reader = request.body?.getReader();
    if (!reader)
      return new Response("Invalid request", {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      });
    let length = 0;
    let text = "";
    const decoder = new TextDecoder();
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.byteLength;
      if (length > 8192) {
        await reader.cancel();
        return new Response("Request too large", {
          status: 413,
          headers: { "Cache-Control": "no-store" },
        });
      }
      text += decoder.decode(part.value, { stream: true });
    }
    try {
      context.req.body = JSON.parse(text + decoder.decode());
    } catch {
      return new Response("Invalid JSON", {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      });
    }
  }
  await handler(context.req, context.res);
  return context.response();
}
