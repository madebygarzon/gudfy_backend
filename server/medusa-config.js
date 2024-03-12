const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const GoogleClientId = process.env.GOOGLE_CLIENT_ID || "";
const GoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const FacebookClientId = process.env.FACEBOOK_CLIENT_ID || "";
const FacebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET || "";
const Auth0ClientId = process.env.AUTH0_CLIENT_ID || "";
const Auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET || "";
const Auth0Domain = process.env.AUTH0_DOMAIN || "";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  // {
  //   resolve: "@medusajs/admin",
  //   /** @type {import('@medusajs/admin').PluginOptions} */
  //   options: {
  //     // ...
  //   },
  // },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
      localization: {
        "de-DE": {
          // locale key
          order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID_LOCALIZED,
        },
      },
    },
  },
  {
    resolve: "medusa-plugin-auth",
    /** @type {import('medusa-plugin-auth').AuthOptions} */
    options: {
      strict: "none", // or "none" or "store" or "admin"
      google: {
        clientID: GoogleClientId,
        clientSecret: GoogleClientSecret,

        admin: {
          callbackUrl: `${BACKEND_URL}/admin/auth/google/cb`,
          failureRedirect: `${ADMIN_CORS}/login`,

          successRedirect: `${ADMIN_CORS}/`,
        },

        store: {
          callbackUrl: `${BACKEND_URL}/store/auth/google/cb`,
          failureRedirect: `${STORE_CORS}/`,

          successRedirect: `${STORE_CORS}/`,
        },
      },
      facebook: {
        clientID: FacebookClientId,
        clientSecret: FacebookClientSecret,

        admin: {
          callbackUrl: `${BACKEND_URL}/admin/auth/facebook/cb`,
          failureRedirect: `${ADMIN_CORS}/`,

          successRedirect: `${ADMIN_CORS}/`,
        },

        store: {
          callbackUrl: `${BACKEND_URL}/store/auth/facebook/cb`,
          failureRedirect: `${STORE_CORS}/`,

          successRedirect: `${STORE_CORS}/`,
        },
      },
      auth0: {
        clientID: Auth0ClientId,
        clientSecret: Auth0ClientSecret,
        auth0Domain: Auth0Domain,

        admin: {
          callbackUrl: `${BACKEND_URL}/admin/auth/auth0/cb`,
          failureRedirect: `${ADMIN_CORS}/`,

          successRedirect: `${ADMIN_CORS}/`,
        },

        store: {
          callbackUrl: `${BACKEND_URL}/store/auth/auth0/cb`,
          failureRedirect: `${STORE_CORS}/`,

          successRedirect: `${STORE_CORS}/`,
        },
      },
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-local",
  },
  /* eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
};
const featureFlags = {
  sales_channels: false,
};
/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
  featureFlags,
};
