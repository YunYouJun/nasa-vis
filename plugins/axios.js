const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'
export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    config.url += config.url.includes('?') ? '&' : '?'
    config.url += 'api_key=' + NASA_API_KEY
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
