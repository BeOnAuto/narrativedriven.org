# NarrativeDriven.org decommission

## Final state

`narrativedriven.org` and `www.narrativedriven.org` are permanent address aliases. Every request, regardless of path, redirects directly to:

```text
https://on.auto/narrative-driven-development
```

The destination is a founder-authored transition page that explains why the separate name and vocabulary were retired and gives visitors useful paths into the current Auto site.

There is deliberately no intermediate page on the old origin. Leaving one there would preserve a second brand surface and require the old VitePress deployment to remain operational.

## Cloudflare rule

Create one zone-level Single Redirect in the `http_request_dynamic_redirect` phase for the `narrativedriven.org` zone:

```json
{
  "ref": "retire_narrativedriven_to_auto_2026",
  "description": "Retire NarrativeDriven.org into the Auto transition page",
  "expression": "true",
  "action": "redirect",
  "action_parameters": {
    "from_value": {
      "status_code": 301,
      "target_url": {
        "value": "https://on.auto/narrative-driven-development"
      },
      "preserve_query_string": false
    }
  }
}
```

The expression is intentionally `true`: the user-facing migration decision is that every old URL lands on the explainer first. This also covers unknown, mistyped, `.html`, query-string, apex, and `www` URLs as long as those hostnames are proxied through the same Cloudflare zone.

## Cutover order

1. Deploy the new Auto pages.
2. Verify `https://on.auto/narrative-driven-development` returns `200` and its canonical points to itself.
3. Verify the apex and `www` DNS records for the old domain are proxied through Cloudflare.
4. Add the redirect rule without replacing any existing rules in the phase ruleset.
5. Verify representative old URLs return a single `301` hop to the transition page.
6. Verify query strings are intentionally discarded.
7. Submit the new Auto sitemap and monitor both domain properties in Google Search Console.
8. Keep the old domain registered and the redirect active indefinitely.

## Verification commands

```sh
curl -sS -I https://narrativedriven.org/
curl -sS -I https://narrativedriven.org/what-is-ndd
curl -sS -I https://narrativedriven.org/guides/lens-rental-marketplace?from=old-site
curl -sS -I https://www.narrativedriven.org/reference/glossary
```

For each request, expect:

```text
HTTP/2 301
location: https://on.auto/narrative-driven-development
```

Follow one representative request with `curl -sS -IL` and confirm that it reaches a `200` response in one redirect hop.

## Rollback

If the destination is unavailable or the redirect causes an unexpected conflict:

1. Disable only the rule with ref `retire_narrativedriven_to_auto_2026`.
2. Do not delete the Cloudflare zone or change nameservers.
3. Restore the previous GitHub Pages workflow from Git history only if the old origin must temporarily serve traffic.
4. Correct and redeploy the Auto destination, verify it, then re-enable the edge rule.

## Search and ownership

- Keep ownership of the old domain indefinitely.
- Keep the permanent redirect indefinitely rather than treating one year as a removal date.
- Do not publish new pages, feeds, newsletters, or community funnels on the old domain.
- Do not add the old URLs to a current sitemap.
- Update inbound links under Auto's control to point directly to `on.auto`; third-party links can continue to resolve through the redirect.
