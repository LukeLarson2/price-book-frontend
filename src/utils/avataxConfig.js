import Avatax from "avatax";
import { Buffer } from "buffer";

// Resolve configuration, credentials, and logOptions
const config = {
  appName: "price-book",
  appVersion: "1.0",
  environment: "sandbox",
  machineName: "your-machine-name",
  timeout: 5000, // optional, default 20 min
  logOptions: {
    logEnabled: true, // toggle logging on or off, by default it's off.
    logLevel: 3, // logLevel that will be used, Options are LogLevel.Error (0), LogLevel.Warn (1), LogLevel.Info (2), LogLevel.Debug (3)
    logRequestAndResponseInfo: true, // Toggle logging of the request and response bodies on and off.
  },
  enableStrictTypeConversion: true, // Ensures that all responses returned by the API methods will be type-safe and match the Models explicitly. For example, enums will be returned as integer values instead of strings as they were previously.
};

const creds = {
  username: process.env.SANDBOX_USERNAME,
  password: process.env.SANDBOX_PASSWORD,
};

global.Buffer = Buffer;

const client = new Avatax(config).withSecurity(creds);

export { client };
