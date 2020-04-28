import AV from 'leancloud-storage'

// leancloud
const config = {
  appId: process.env.LEANCLOUD_APP_ID || '',
  appKey: process.env.LEANCLOUD_APP_KEY || '',
}

if (process.env.LEANCLOUD_SERVER_URL) {
  config.LEANCLOUD_SERVER_URL = process.env.LEANCLOUD_SERVER_URL
}

AV.init(config)

export default ({ app }, inject) => {
  inject('AV', AV)
}
