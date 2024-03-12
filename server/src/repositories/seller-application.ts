import { SellerApplication } from "../models/seller-application";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const SellerApplicationRepository =
  dataSource.getRepository(SellerApplication);
