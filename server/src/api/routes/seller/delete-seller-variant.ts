import { Request, Response } from "express";

export async function deleteVariant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { idV } = req.query;
    const deleteVariant = req.scope.resolve("productVariantService");
    await deleteVariant.delete(idV);
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
}
