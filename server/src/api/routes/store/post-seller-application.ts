import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

export default async (req: Request, res: Response): Promise<void> => {
  const { customer_id, identification_number, address } = req.body;
  console.log(req.body);
  try {
    const sellerApplicationRepository = req.scope.resolve(
      "sellerApplicationService"
    );
    sellerApplicationRepository
      .create(customer_id, identification_number, address)
      .then((e) => {
        return res.status(202).json({ e });
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};
