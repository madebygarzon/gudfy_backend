import { Request, Response } from "express";

export async function GetSeller(req: Request, res: Response): Promise<void> {
  try {
    const sellerApplicationRepository = req.scope.resolve("storeService");
    const sotore = await sellerApplicationRepository.retrieve();
    res.status(200).json(sotore);
  } catch (error) {
    res.status(400).json({ error });
  }
}
