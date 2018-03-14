self.addEventListener('install', function(event) {
  // `skipWaiting()` forces the waiting ServiceWorker to become the
  // active ServiceWorker, triggering the `onactivate` event.
  // Together with `Clients.claim()` this allows a worker to take effect
  // immediately in the client(s).
  if (self.skipWaiting) self.skipWaiting();

});

self.addEventListener('activate', function(event) {
	// `claim()` sets this worker as the active worker for all clients that
	// match the workers scope and triggers an `oncontrollerchange` event for
	// the clients.
	return self.clients.claim();
});

self.addEventListener('push', (event) => {
  let data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
  self.clients.matchAll().then((clients) => Promise.all(clients.map((client) => {
    if (client.focused) {
      return client.postMessage({
        type: 'new-notification'
      });
    }
    return Promise.resolve();
  })));

});

self.addEventListener('notificationclick', (event) => {
  var messageId = event.notification.data;

  event.notification.close();
  self.clients.matchAll().then((clients) => Promise.all(clients.map((client) => {
    console.log('client event accept', client, event);
    if (client.focused) {
      return client.postMessage({
        type: 'close-notification'
      });
    }
    return Promise.resolve();
  })));

  if (event.action === 'accept') {

    clients.openWindow("/accept");

  }
  else {

    clients.openWindow("/dismiss");

  }
}, false);

self.addEventListener('message', function(event){
  console.log("SW Received Message: " + event.data);
});