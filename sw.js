importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@3.6.3-5/workbox/workbox-sw.js')

// --------------------------------------------------
// Configure
// --------------------------------------------------

// Set workbox config
workbox.setConfig({
  "debug": false
})

// Start controlling any existing clients as soon as it activates
workbox.clientsClaim()

// Skip over the SW waiting lifecycle stage
workbox.skipWaiting()

// --------------------------------------------------
// Precaches
// --------------------------------------------------

// Precache build artifacts
workbox.precaching.precacheAndRoute([], {
  "cacheId": "nasa-vis",
  "directoryIndex": "/"
})

// --------------------------------------------------
// Runtime Caching
// --------------------------------------------------

// Register route handlers for runtimeCaching
workbox.routing.registerRoute(new RegExp('/_nuxt/(?!.*hot-update).+'), workbox.strategies.cacheFirst ({}), 'GET')
workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst ({}), 'GET')
