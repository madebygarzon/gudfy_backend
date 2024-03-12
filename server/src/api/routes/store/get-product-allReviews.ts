import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { id, next } = req.query;
  const productReviewService = req.scope.resolve("productReviewService");
  await productReviewService
    .getProductReviews(id, next)
    .then((product_reviews) => {
      return res.json({ product_reviews });
    });
};
