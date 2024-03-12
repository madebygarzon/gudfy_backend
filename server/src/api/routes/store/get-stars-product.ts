import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;
  const productReviewService = req.scope.resolve("productReviewService");
  await productReviewService.getStarsProductReviews(id).then((stars) => {
    return res.json({ ...stars });
  });
};
