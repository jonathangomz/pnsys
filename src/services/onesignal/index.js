import OneSignal from '@jonathangomz/onesignal-client';
import { oneSignal } from "../../config";

const OSClient = new OneSignal({
  authKey: oneSignal.authKey,
  restApiKey: oneSignal.restApiKey,
  appId: oneSignal.appId,
});

export default OSClient;
