import { TransactionBaseService } from "@medusajs/medusa";
import { ProductReviewRepository } from "../repositories/product-review";

export default class ProductReviewService extends TransactionBaseService {
  protected readonly productReviewRepository_: typeof ProductReviewRepository;

  constructor({ productReviewRepository }) {
    super(arguments[0]);
    this.productReviewRepository_ = productReviewRepository;
  }
  async getStarsProductReviews(product_id) {
    const productReviewRepository = this.activeManager_.withRepository(
      this.productReviewRepository_
    );
    const calculeStars = await productReviewRepository
      .createQueryBuilder()
      .select("rating, COUNT(*) as cantidad")
      .where({ product_id, approved: true })
      .groupBy("rating")
      .getRawMany();
    const total = calculeStars.reduce((acumulador, objeto) => {
      return acumulador + parseInt(objeto.cantidad);
    }, 0);
    const media =
      calculeStars.reduce((acumulador, objeto) => {
        return acumulador + parseInt(objeto.cantidad) * parseInt(objeto.rating);
      }, 0) / total;
    return { dataStars: calculeStars, total, media };
  }

  async getProductReviews(product_id, next) {
    /* @ts-ignore */
    const productReviewRepository = this.activeManager_.withRepository(
      this.productReviewRepository_
    );
    if (next) {
      return await productReviewRepository.find({
        where: {
          product_id,
          approved: true,
        },
        order: {
          created_at: "DESC",
        },
        take: 5 * next,
      });
    } else {
      return await productReviewRepository.find({
        where: {
          product_id,
          approved: true,
        },
        order: {
          created_at: "DESC",
        },
      });
    }
  }

  async getCustomerProductReviews(customer_id) {
    /* @ts-ignore */
    const productReviewRepository = this.activeManager_.withRepository(
      this.productReviewRepository_
    );
    return await productReviewRepository.find({
      where: {
        customer_id,
        approved: true,
      },
    });
  }

  async getReview(id) {
    /* @ts-ignore */
    const productReviewRepository = this.activeManager_.withRepository(
      this.productReviewRepository_
    );
    return await productReviewRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(
    product_id,
    customer_id,
    customer_name,
    display_name,
    content,
    rating
  ) {
    if (
      !product_id ||
      !customer_id ||
      !customer_name ||
      !display_name ||
      !content ||
      !rating
    ) {
      throw new Error(
        "Adding product review requires product_id, customer_id, display_name, content, and rating"
      );
    }
    /* @ts-ignore */
    const productReviewRepository = this.activeManager_.withRepository(
      this.productReviewRepository_
    );
    const createdReview = productReviewRepository.create({
      product_id,
      customer_id,
      customer_name,
      display_name,
      content,
      rating,
      approved: false,
    });
    const productReview = await productReviewRepository.save(createdReview);
    return productReview;
  }

  async update(id_review, display_name, content, rating) {
    if (!id_review || !display_name || !content || !rating) {
      throw new Error(
        "Updating a product review requires id, display_name, content, rating, and approved"
      );
    }
    /* @ts-ignore */
    const productReviewRepository = this.activeManager_.withRepository(
      this.productReviewRepository_
    );
    const productReview = productReviewRepository.update(id_review, {
      display_name,
      content,
      rating,
      approved: false,
    });
    return productReview;
  }

  async delete(id) {
    if (!id) {
      throw new Error("Deleting a product review requires id");
    }
    /* @ts-ignore */
    const productReviewRepository = this.activeManager_.withRepository(
      this.productReviewRepository_
    );
    const productReview = productReviewRepository.delete(id);
    return productReview;
  }
}
