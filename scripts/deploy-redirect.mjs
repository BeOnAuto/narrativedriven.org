import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const API_BASE = 'https://api.cloudflare.com/client/v4'
const CONFIG_URL = new URL('../cloudflare/redirect-rule.json', import.meta.url)

export async function loadConfig() {
  return JSON.parse(await readFile(CONFIG_URL, 'utf8'))
}

function requireValue(value, name) {
  if (!value) throw new Error(`${name} is required`)
  return value
}

async function cloudflareRequest({ fetchImpl, token, path, method = 'GET', body }) {
  const response = await fetchImpl(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok || payload?.success === false) {
    const details = payload?.errors
      ?.map((error) => error.message || `Cloudflare error ${error.code}`)
      .join('; ')
    const error = new Error(details || `Cloudflare API returned ${response.status}`)
    error.status = response.status
    throw error
  }

  return payload?.result
}

function rulePayload(rule) {
  return {
    ref: rule.ref,
    description: rule.description,
    expression: rule.expression,
    action: rule.action,
    enabled: rule.enabled,
    action_parameters: rule.action_parameters,
  }
}

export async function deployRedirect({
  config,
  token,
  zoneId,
  fetchImpl = globalThis.fetch,
}) {
  requireValue(token, 'CLOUDFLARE_API_TOKEN')
  requireValue(zoneId, 'CLOUDFLARE_ZONE_ID')
  requireValue(fetchImpl, 'fetch')

  const phasePath = `/zones/${zoneId}/rulesets/phases/${config.phase}/entrypoint`
  let ruleset

  try {
    ruleset = await cloudflareRequest({ fetchImpl, token, path: phasePath })
  } catch (error) {
    if (error.status !== 404) throw error
  }

  if (!ruleset) {
    await cloudflareRequest({
      fetchImpl,
      token,
      path: `/zones/${zoneId}/rulesets`,
      method: 'POST',
      body: {
        name: config.rulesetName,
        description: config.rulesetDescription,
        kind: 'zone',
        phase: config.phase,
        rules: [rulePayload(config.rule)],
      },
    })

    return { operation: 'created-ruleset', ref: config.rule.ref }
  }

  const existingRule = ruleset.rules?.find((rule) => rule.ref === config.rule.ref)

  if (existingRule) {
    await cloudflareRequest({
      fetchImpl,
      token,
      path: `/zones/${zoneId}/rulesets/${ruleset.id}/rules/${existingRule.id}`,
      method: 'PATCH',
      body: rulePayload(config.rule),
    })

    return { operation: 'updated-rule', ref: config.rule.ref }
  }

  await cloudflareRequest({
    fetchImpl,
    token,
    path: `/zones/${zoneId}/rulesets/${ruleset.id}/rules`,
    method: 'POST',
    body: rulePayload(config.rule),
  })

  return { operation: 'added-rule', ref: config.rule.ref }
}

async function main() {
  const config = await loadConfig()
  const result = await deployRedirect({
    config,
    token: process.env.CLOUDFLARE_API_TOKEN,
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
  })

  console.log(`${result.operation}: ${result.ref}`)
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
