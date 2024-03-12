import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

export default async (req: Request, res: Response): Promise<void> => {
  const customer = req.body;
  try {
    const customerService = req.scope.resolve("customerService");
    customerService.createStore(customer.id, customer).then((e) => {
      return res.status(202).json({ ...e });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
