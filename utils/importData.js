/* eslint-disable */

const { readFileSync } = require('fs')
const AV = require('leancloud-storage')

// leancloud
const config = {
  appId: process.env.LEANCLOUD_APP_ID || '',
  appKey: process.env.LEANCLOUD_APP_KEY || '',
}

if (process.env.LEANCLOUD_SERVER_URL) {
  config.LEANCLOUD_SERVER_URL = process.env.LEANCLOUD_SERVER_URL
}

AV.init(config)

const NEO = AV.Object.extend('NEO')
// const data = JSON.parse(readFileSync('./dist/neos/test.json'))
const data = JSON.parse(readFileSync('./dist/neos/2020-01-01-2020-04-21.json'))

async function saveNeoData(data) {
  // too many request at the same time
  // data.forEach(async (el) => {
  //   const neo = new NEO()
  //   neo.set('date', el.date)
  //   neo.set('count', el.count)
  //   neo.set('PHAs', el.PHAs)
  //   await neo.save()
  // })
  for (let i = 0; i < data.length; i++) {
    const el = data[i]
    const neo = new NEO()
    neo.set('date', new Date(el.date))
    neo.set('count', el.count)
    neo.set('PHAs', el.PHAs)
    await neo.save()
  }
  console.log('Import successfully!')
}

saveNeoData(data)
