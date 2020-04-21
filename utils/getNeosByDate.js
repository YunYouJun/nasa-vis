/* eslint-disable */

const { mkdirSync, writeFileSync } = require('fs')
const axios = require('axios').default
const dayjs = require('dayjs')

axios.defaults.baseURL = 'https://api.nasa.gov/'
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'

const feed_start_date = '2020-01-01'
const today = dayjs().format('YYYY-MM-DD')

// add api_key
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.url += config.url.includes('?') ? '&' : '?'
    config.url += 'api_key=' + NASA_API_KEY
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

async function getNeoFeedByDate(start_date, end_date) {
  console.log('from ' + start_date + ' to ' + end_date)
  const res = await axios.get('/neo/rest/v1/feed', {
    params: {
      start_date,
      end_date,
    },
  })
  return res.data.near_earth_objects
}

function filterNeosData(data) {
  const dataArray = []
  for (const key in data) {
    let PHAs = 0
    data[key].forEach((neo) => {
      if (neo.is_potentially_hazardous_asteroid) {
        PHAs++
      }
    })
    dataArray.push({
      date: dayjs(key),
      count: data[key].length,
      PHAs,
    })
  }
  return dataArray
}

async function getNeoFeedByRange(feed_start_date, feed_end_date) {
  let neos = []
  const day_count = dayjs(feed_end_date).diff(dayjs(feed_start_date), 'day')
  let start_date = feed_start_date
  let end_date = dayjs(start_date).add(7, 'day').format('YYYY-MM-DD')
  let neos_data = {}
  while (neos.length < day_count) {
    neos_data = await getNeoFeedByDate(start_date, end_date)
    neos = neos.concat(filterNeosData(neos_data))
    start_date = dayjs(end_date).add(1, 'day').format('YYYY-MM-DD')
    end_date = dayjs(start_date).add(7, 'day').format('YYYY-MM-DD')
  }
  return neos
}

function writeNeosJSON(neos, start_date, end_date) {
  try {
    mkdirSync('./dist/neos')
  } catch ({ code }) {
    if (code !== 'EEXIST') return
  }
  writeFileSync(
    `./dist/neos/${start_date}-${end_date}.json`,
    JSON.stringify(neos)
  )
  console.log('Get neo info successfully!')
}

async function start() {
  const neos = await getNeoFeedByRange(feed_start_date, today)
  writeNeosJSON(neos, feed_start_date, today)
}

start()
