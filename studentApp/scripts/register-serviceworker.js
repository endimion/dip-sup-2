
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
  // register service worker
  navigator.serviceWorker.register('service-worker-cache-images.js', { scope: './' })
    .then(navigator.serviceWorker.ready)
    .then(function () {
      console.log('service worker registered')
    })
    .catch(function (error) {
      console.log('error when registering service worker', error, arguments)
    });
  });
}
