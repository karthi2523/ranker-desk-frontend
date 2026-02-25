// This file helps clear out any old ad or service workers
// that were registered on localhost:3000 by previous projects.
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', async () => {
    const registrations = await self.registration.scope;
    self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.navigate(client.url));
});
