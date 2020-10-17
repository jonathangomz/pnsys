export const initOneSignalClient = (keys) => {
  const OneSignal = require('@jonathangomz/onesignal-client');
  
  const client = new OneSignal({
    authKey: keys.get('authKey'),
    restApiKey: keys.get('restApiKey'),
    appId: keys.get('appId'),
  });

  return client;
}