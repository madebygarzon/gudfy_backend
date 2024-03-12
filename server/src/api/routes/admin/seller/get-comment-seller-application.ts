import { Request, Response } from "express";

export default async function getCommentSellerApplication(
  req: Request,
  res: Response
) {
  const { customer_id } = req.query;
  try {
    const SellerApplication = req.scope.resolve("sellerApplicationService");
    const data = await SellerApplication.getComment(customer_id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json();
  }
}
