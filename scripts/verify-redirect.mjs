import { readFile } from 'node:fs/promises'

const config = JSON.parse(
  await readFile(new URL('../cloudflare/redirect-rule.json', import.meta.url), 'utf8'),
)

const expectedLocation = config.rule.action_parameters.from_value.target_url.value
const requests = [
  'https://narrativedriven.org/',
  'https://narrativedriven.org/what-is-ndd',
  'https://narrativedriven.org/guides/lens-rental-marketplace?from=old-site',
  'https://www.narrativedriven.org/reference/glossary',
]

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function verifyOnce() {
  for (const url of requests) {
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' })
    const location = response.headers.get('location')

    if (response.status !== 301 || location !== expectedLocation) {
      throw new Error(
        `${url} returned ${response.status} with location ${location || '(none)'}`,
      )
    }
  }

  const finalResponse = await fetch(requests[1], { redirect: 'follow' })
  if (!finalResponse.ok || finalResponse.url !== expectedLocation) {
    throw new Error(
      `Following the redirect ended at ${finalResponse.url} with status ${finalResponse.status}`,
    )
  }
}

let lastError
for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    await verifyOnce()
    console.log(`Verified one-hop redirects to ${expectedLocation}`)
    process.exit(0)
  } catch (error) {
    lastError = error
    if (attempt < 6) await wait(10_000)
  }
}

console.error(lastError.message)
process.exit(1)
