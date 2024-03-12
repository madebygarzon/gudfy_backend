import { Router, json } from "express";
import customRouteHandler from "./custom-route-handler";
import postProductReviews from "./post-product-reviews";
import postAccountSeller from "./post-account-seller";
import updateReview from "./update-review";
import getProductAllReviews from "./get-product-allReviews";
import getStarsProduct from "./get-stars-product";
import { authenticate, authenticateCustomer } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import deleteReview from "./delete-review";
import postSellerApplication from "./post-seller-application";
import getSellerApplication from "./get-seller-application";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
  // Attach our router to a custom path on the store router
  storeRouter.use("/", router, json());
  // Define a GET endpoint on the root route of our custom path

  // ----------------------EndPoinst for product reviws and stars------------------------
  router.get("/products/:id/reviews", wrapHandler(getProductAllReviews));
  router.get("/products/:id/stars", wrapHandler(getStarsProduct));
  //create new review
  router.post(
    "/products/:id/reviews",
    authenticateCustomer(),
    wrapHandler(postProductReviews)
  );

  //update new review
  router.post(
    "/reviews/:id",
    authenticateCustomer(),
    wrapHandler(updateReview)
  );

  router.delete(
    "/reviews/:id",
    authenticateCustomer(),
    wrapHandler(deleteReview)
  );

  // -----------------------------------------------------------------------------

  // ---------------------------------Test Endpoins-------------------------------
  //create a store for customer -- admin
  router.post("/account/seller", wrapHandler(postAccountSeller));

  //Seller Application
  router.post(
    "/account/seller-application",
    wrapHandler(postSellerApplication)
  );

  router.get("/account/seller-application", wrapHandler(getSellerApplication));
}
