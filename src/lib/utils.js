/* @flow */
const fs = require('mz/fs')
const mkdirp = require('mkdirp')

const HOME: ?string = process.env.HOME
if (HOME == null) throw new Error('Invalid HOME env var')

const CACHE_FOLDER = HOME + '/.gh-contribs'

function cachePathForUsername (username: string): string {
  return `${CACHE_FOLDER}/${username}.cache`
}

const MIN = 60 * 1000
const REQUEST_FREQUENCY = 10 * MIN
type ContribData = { timestamp: Date, contribs: Array<number> }

export function isContribDataStale (data: ContribData) {
  return (Date.now() - data.timestamp) > REQUEST_FREQUENCY
}

export async function getCacheForUser (username: string): Promise<?ContribData> {
  return fs.readFile(cachePathForUsername(username))
  .then((buff) => JSON.parse(buff.toString()))
  .then((data) => {
    data.timestamp = new Date(data.timestamp)
    return data
  })
  .catch((err) => {
    if (err.code === 'ENOENT') return null
    else throw err
  })
}

export function saveCacheForUser (username: string, data: ContribData): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(CACHE_FOLDER, (err) => {
      if (err) return reject(err)
      fs.writeFile(cachePathForUsername(username), JSON.stringify(data))
      .then(resolve, reject)
    })
  })
}

export function appendToDebugLog (error: Error): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(CACHE_FOLDER, (err) => {
      if (err) return reject(err)
      const report = `> ${String(new Date())}\n${error.stack}`
      fs.appendFile(`${CACHE_FOLDER}/debug.log`, report)
      .then(resolve, reject)
    })
  })
}
