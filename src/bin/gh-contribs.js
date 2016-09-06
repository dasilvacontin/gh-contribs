#!/usr/bin/env node
// @flow
import { argv } from 'yargs'
import gitconfig from 'git-config'
import { getCacheForUser, isContribDataStale } from '../lib/utils.js'
import { spawn } from 'mz/child_process'
const debug = require('debug')('gh-contribs')

function getMyGitHubUsername () {
  const config = gitconfig.sync()
  if (config.github != null) return config.github.user

  throw new Error(`Please, provide a GitHub username using \`-u\` or store
your username in your .gitconfig. Hint:\n
\`git config --global github.user your-username\``)
}

async function main () {
  const username = argv.u || getMyGitHubUsername()
  const days: number = argv.d || Infinity
  const contribData = await getCacheForUser(username)
  debug(`username: ${username}, days: ${days}, contribData: ${contribData}`)

  // fetch data if necessary
  if (contribData == null || isContribDataStale(contribData)) {
    spawn('node', ['fetch-gh-contribs.js', username], {
      cwd: __dirname,
      detached: true,
      stdio: 'inherit'
    })
  }

  if (contribData) console.log(contribData.contribs.slice(-days).join(' '))
  else process.stdout.write('FETCHING_CONTRIBS', () => { process.exit(0) })
}

main()
.catch((err) => {
  process.stderr.write(err.stack, () => { process.exit(2) })
})
