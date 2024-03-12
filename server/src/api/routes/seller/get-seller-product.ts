import { Request, Response } from "express";

export async function getListSellerProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productService = req.scope.resolve("productService");
    const product = await productService.listAndCountSeller();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
}
