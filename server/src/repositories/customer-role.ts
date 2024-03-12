import { CustomerRole } from "../models/customer-role";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const CustomerRoleRepository = dataSource.getRepository(CustomerRole);
export default CustomerRoleRepository;
