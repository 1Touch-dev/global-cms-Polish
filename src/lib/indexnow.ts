/**
 * IndexNow — DEPRECATED submission helpers
 *
 * IndexNow pings are now handled by the global_cms backend on article save.
 * The frontend's only responsibility is hosting the key file at:
 *   /{key}.txt → public/684dda242b75445fad9347d2e7bb62dc.txt
 *
 * NOTE: bialoczerwoni.live is NOT yet in the CMS INDEXNOW_KEYS_JSON list
 * (current CMS hosts: pitchpulsemedia.com, quinasgoal.com, mannschaftgoal.com).
 * To enable automatic CMS pings, ask the CMS team to add this site.
 *
 * Do NOT add submission logic here — it lives in CMS to avoid double-pinging.
 */

export const INDEXNOW_KEY = '684dda242b75445fad9347d2e7bb62dc'
