import { Router, json } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  authenticate,
  ConfigModule,
  authenticateCustomer,
} from "@medusajs/medusa";
import { getConfigFile } from "medusa-core-utils";
import { attachStoreRoutes } from "./routes/store";
import { attachAdminRoutes } from "./routes/admin";
import { attachSellerRoutes } from "./routes/seller";
import { registerLoggedInCustomer } from "./middlewares/customerLogged";

export default (rootDirectory: string): Router | Router[] => {
  // Read currently-loaded medusa config
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );
  const { projectConfig } = configModule;

  // Set up our CORS options objects, based on config
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };

  // Set up express router
  const router = Router();

  // Set up root routes for store and admin endpoints, with appropriate CORS settings
  router.use("/store", cors(storeCorsOptions), bodyParser.json());
  router.use("/admin", cors(adminCorsOptions), bodyParser.json());
  router.use("/seller", cors(storeCorsOptions), bodyParser.json());

  // Add authentication to all admin routes *except* auth and account invite ones
  router.use(/\/admin\/((?!auth)(?!invites).*)/, authenticate());
  router.use("/seller", registerLoggedInCustomer);

  // Set up routers for store and admin endpoints
  const storeRouter = Router();
  const adminRouter = Router();
  const customerRouter = Router();

  // Attach these routers to the root routes
  router.use("/store", storeRouter);
  router.use("/admin", adminRouter);
  router.use("/seller", customerRouter);

  // Attach custom routes to these routers
  attachStoreRoutes(storeRouter);
  attachAdminRoutes(adminRouter);
  attachSellerRoutes(customerRouter);

  return router;
};
