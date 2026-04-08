/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const lockPath = path.join(process.cwd(), 'package-lock.json')

const blocked = [
  { name: 'axios', versions: new Set(['1.14.1', '0.30.4']) },
  { name: 'plain-crypto-js', versions: new Set(['4.2.1']) },
]

function fail(message) {
  console.error(`\n[security:check] ${message}\n`)
  process.exit(1)
}

if (!fs.existsSync(lockPath)) {
  fail('package-lock.json not found. Run npm install first.')
}

let lock
try {
  lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'))
} catch (e) {
  fail(`Cannot parse package-lock.json: ${e.message}`)
}

const found = []

// npm lockfile v2+ has "packages" entries with node_modules paths.
const packages = lock.packages || {}
for (const pkgPath of Object.keys(packages)) {
  const meta = packages[pkgPath]
  if (!meta || !meta.version) continue
  const parts = pkgPath.split('node_modules/')
  const name = parts[parts.length - 1]
  if (!name) continue

  for (const rule of blocked) {
    if (name === rule.name && rule.versions.has(meta.version)) {
      found.push(`${name}@${meta.version} (${pkgPath || 'root'})`)
    }
  }
}

if (found.length > 0) {
  fail(
    `Blocked compromised package versions detected:\n- ${found.join(
      '\n- ',
    )}\n\n` +
      'Action: remove lockfile entries by updating deps and run npm install again.',
  )
}

console.log('[security:check] OK: no blocked compromised package versions detected.')

