import { defineMiddleware } from "astro:middleware";
export const onRequest = defineMiddleware(async ({ url }, next) => {
  if (url.hostname === "williambratz.com") {
    return Response.redirect(
      `https://www.williambratz.com${url.pathname}${url.search}`,
      301,
    );
  }
  return next();
});
