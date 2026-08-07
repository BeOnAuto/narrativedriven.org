import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { deployRedirect } from './deploy-redirect.mjs'

const config = JSON.parse(
  await readFile(new URL('../cloudflare/redirect-rule.json', import.meta.url), 'utf8'),
)

function response(status, result = null, errors = []) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return { success: this.ok, result, errors }
    },
  }
}

function mockFetch(responses) {
  const calls = []
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options })
    const next = responses.shift()
    assert.ok(next, `Unexpected request: ${options.method || 'GET'} ${url}`)
    return next
  }
  return { calls, fetchImpl }
}

test('the committed rule sends every request to the fixed transition page', () => {
  assert.equal(config.rule.expression, 'true')
  assert.equal(config.rule.action, 'redirect')
  assert.equal(config.rule.enabled, true)
  assert.equal(config.rule.action_parameters.from_value.status_code, 301)
  assert.equal(
    config.rule.action_parameters.from_value.target_url.value,
    'https://on.auto/narrative-driven-development',
  )
  assert.equal(config.rule.action_parameters.from_value.preserve_query_string, false)
})

test('updates only the existing rule with the matching ref', async () => {
  const { calls, fetchImpl } = mockFetch([
    response(200, {
      id: 'ruleset-1',
      rules: [
        { id: 'unrelated-rule', ref: 'keep_this_rule' },
        { id: 'redirect-rule', ref: config.rule.ref },
      ],
    }),
    response(200, { id: 'redirect-rule' }),
  ])

  const result = await deployRedirect({ config, token: 'token', zoneId: 'zone', fetchImpl })

  assert.equal(result.operation, 'updated-rule')
  assert.equal(calls.length, 2)
  assert.equal(calls[1].options.method, 'PATCH')
  assert.match(calls[1].url, /rulesets\/ruleset-1\/rules\/redirect-rule$/)
  assert.doesNotMatch(calls[1].options.body, /keep_this_rule/)
})

test('adds the redirect without replacing unrelated rules', async () => {
  const { calls, fetchImpl } = mockFetch([
    response(200, {
      id: 'ruleset-1',
      rules: [{ id: 'unrelated-rule', ref: 'keep_this_rule' }],
    }),
    response(200, { id: 'new-rule' }),
  ])

  const result = await deployRedirect({ config, token: 'token', zoneId: 'zone', fetchImpl })

  assert.equal(result.operation, 'added-rule')
  assert.equal(calls[1].options.method, 'POST')
  assert.match(calls[1].url, /rulesets\/ruleset-1\/rules$/)
  assert.doesNotMatch(calls[1].options.body, /keep_this_rule/)
})

test('creates the phase entry-point ruleset when none exists', async () => {
  const { calls, fetchImpl } = mockFetch([
    response(404, null, [{ code: 10007, message: 'not found' }]),
    response(200, { id: 'new-ruleset' }),
  ])

  const result = await deployRedirect({ config, token: 'token', zoneId: 'zone', fetchImpl })

  assert.equal(result.operation, 'created-ruleset')
  assert.equal(calls[1].options.method, 'POST')
  assert.match(calls[1].url, /\/zones\/zone\/rulesets$/)
  const body = JSON.parse(calls[1].options.body)
  assert.equal(body.kind, 'zone')
  assert.equal(body.phase, 'http_request_dynamic_redirect')
  assert.deepEqual(body.rules, [config.rule])
})

test('requires both Cloudflare credentials before making a request', async () => {
  await assert.rejects(
    deployRedirect({ config, token: '', zoneId: 'zone', fetchImpl: async () => {} }),
    /CLOUDFLARE_API_TOKEN is required/,
  )
  await assert.rejects(
    deployRedirect({ config, token: 'token', zoneId: '', fetchImpl: async () => {} }),
    /CLOUDFLARE_ZONE_ID is required/,
  )
})
