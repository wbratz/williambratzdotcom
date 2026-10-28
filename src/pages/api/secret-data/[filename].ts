import type { APIRoute } from "astro";
import handler from "../../../server/secret-files-api";
import { privateApi } from "../../../server/private-http";
export const prerender = false;
export const ALL: APIRoute = ({ request, params }) =>
  privateApi(request, handler, { filename: params.filename });
