import type {
  MiddlewaresConfig,
  Customer,
  CustomerService,
} from "@medusajs/medusa";
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";

export const registerLoggedInCustomer = async (
  req,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  let loggedInCustomer: Customer | null = null;
  if (req.session.customer_id) {
    const customerService = req.scope.resolve(
      "customerService"
    ) as CustomerService;
    loggedInCustomer = await customerService.retrieve(req.session.customer_id);
  }

  req.scope.register({
    loggedInCustomer: {
      resolve: () => loggedInCustomer,
    },
  });

  next();
};
