import type { APIRoute } from "astro";
import handler from "../../server/secret-api";
import { privateApi } from "../../server/private-http";
export const prerender = false;
export const ALL: APIRoute = ({ request }) => privateApi(request, handler);
