import { Request, Response } from "express";

export default async function UpdateSellerAplication(
  req: Request,
  res: Response
) {
  try {
    const { customer_id, comment_status } = req.body;
    const sellerApplicationRepository = req.scope.resolve(
      "sellerApplicationService"
    );
    const data = await sellerApplicationRepository.updateComment(
      customer_id,
      comment_status
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
  }
}
