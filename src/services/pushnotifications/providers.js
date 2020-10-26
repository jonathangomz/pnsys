export const initOneSignalClient = (keys) => {
  const OneSignal = require('@jonathangomz/onesignal-client');
  
  const client = new OneSignal({
    authKey: keys.authKey,
    restApiKey: keys.restApiKey,
    appId: keys.appId,
  });

  return client;
}