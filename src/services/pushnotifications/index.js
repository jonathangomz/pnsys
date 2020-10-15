import { initOneSignalClient } from "./providers";

const clientFactory = (provider, keys) => {
  switch (provider) {
    case 'os':
      return initOneSignalClient(keys);
    default:
      return initOneSignalClient(keys);
  }
}

export default clientFactory;