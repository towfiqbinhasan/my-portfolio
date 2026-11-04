/*
 * The site has two modes (see proxy.ts):
 *   classic  (default) the original design, served from app/(classic) at the normal URLs
 *   animated the motion design, served from app/(animated)/animated, but the proxy rewrites
 *            normal URLs to it, so visitors never see the /animated prefix
 * The choice lives in the `site-mode` cookie; switching reloads the page, because the two
 * modes use different root layouts.
 *
 * Plain constants only: proxy.ts imports this file too. Browser helpers live in useSiteMode.ts.
 */
export const MODE_COOKIE = "site-mode";
export const ANIMATED_PREFIX = "/animated";
export const MODE_MAX_AGE = 60 * 60 * 24 * 365; // remembered for a year
export type SiteMode = "classic" | "animated";
