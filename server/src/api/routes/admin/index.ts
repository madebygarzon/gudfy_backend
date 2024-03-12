import { Router, json } from "express";
import { wrapHandler } from "@medusajs/utils";
import onboardingRoutes from "./onboarding";
import { authenticate } from "@medusajs/medusa";
import getListApplication from "./seller/get-seller-application";
import getCommentSellerApplication from "./seller/get-comment-seller-application";
import UpdateSellerAplication from "./seller/update-seller-application";
import updateCommentSellerApplication from "./seller/update-comment-seller-application";

// Initialize a custom router
const router = Router();

export function attachAdminRoutes(adminRouter: Router) {
  // Attach our router to a custom path on the admin router
  adminRouter.use("/", router);

  // Define a GET endpoint on the root route of our custom path

  //router.get("/", wrapHandler(customRouteHandler));

  router.get("/sellerapplication", wrapHandler(getListApplication));
  router.get(
    "/commentsellerapplication",
    wrapHandler(getCommentSellerApplication)
  );
  router.post(
    "/sellerapplication",
    authenticate(),
    wrapHandler(UpdateSellerAplication)
  );
  router.post(
    "/commentsellerapplication",
    wrapHandler(updateCommentSellerApplication)
  );

  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter);
}
