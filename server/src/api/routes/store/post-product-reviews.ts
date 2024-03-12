import { Request, Response } from "express";
import { MedusaError } from "@medusajs/utils";
import { z } from "zod";

export default async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    id: z.string().min(1),
    customer_id: z.string().min(1),
    customer_name: z.string().min(1),
    display_name: z.string().min(1),
    content: z.string().min(1),
    rating: z.coerce.number().min(0).max(5),
  });
  /* @ts-ignore */
  const { success, error, data } = schema.safeParse(req.body);

  if (!success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
  } else {
    const productReviewService = req.scope.resolve("productReviewService");
    productReviewService
      .create(
        data.id,
        data.customer_id,
        data.customer_name,
        data.display_name,
        data.content,
        data.rating
      )
      .then((product_review) => {
        return res.json({ product_review });
      });
  }
};
