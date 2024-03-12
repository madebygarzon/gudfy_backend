import { Request, Response } from "express";

export default async (req: Request, res: Response): Promise<void> => {
  console.log(req.params);
  const productReviewService = req.scope.resolve("productReviewService");
  productReviewService.delete(req.params.id).then((e) => {
    return res.json({ success: true, data: e });
  });
};
