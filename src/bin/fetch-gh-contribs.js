#!/usr/bin/env node
// @flow
import request from 'request-promise-native'
import { saveCacheForUser, appendToDebugLog } from '../lib/utils.js'

if (process.argv.length !== 3) {
  console.log('process.argv', process.argv)
  throw new Error(`This script should be called with exactly a single argument,
which should be the GitHub username of the user for which we want to fetch
contribution activity.`)
}
const username = process.argv[2]

request(`http://github.com/users/${username}/contributions`)
.then(function parseContributions (data) {
  const dayRe = /data-count="(\d+)" data-date="([\d-]+)"/g
  let dayData
  const calendar = []
  while ((dayData = dayRe.exec(data))) {
    const dayContribs = Number(dayData[1])
    calendar.push(dayContribs)
  }
  return calendar
})
.then(function saveContributions (calendar) {
  const contribData = { timestamp: new Date(), contribs: calendar }
  return saveCacheForUser(username, contribData)
})
.catch(async function (err) {
  await appendToDebugLog(err)
  throw err
}).catch(() => { process.exit(2) })
