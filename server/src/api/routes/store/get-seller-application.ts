import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";

// saber si un customer ya tiene una aplicacion en el lado del front
export default async (req: Request, res: Response): Promise<void> => {
  const { customer_id } = req.query;

  try {
    const sellerApplicationRepository = req.scope.resolve(
      "sellerApplicationService"
    );
    sellerApplicationRepository.getApplication(customer_id).then((e) => {
      return res.status(202).json({ ...e });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
