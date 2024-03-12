import { Lifetime } from "awilix";
import {
  ProductService as MedusaProductService,
  Product,
  Customer,
} from "@medusajs/medusa";

import {
  CreateProductInput as MedusaCreateProductInput,
  FindProductConfig,
  ProductSelector as MedusaProductSelector,
} from "@medusajs/medusa/dist/types/product";
import ProductRepository from "../repositories/product";
import StoreRepository from "../repositories/store";
import CustomerRepository from "../repositories/customer";
type ProductSelector = {
  store_id?: string;
} & MedusaProductSelector;

type CreateProductInput = {
  store_id?: string;
} & MedusaCreateProductInput;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly productRepository_: typeof ProductRepository;
  protected readonly customerRepository_: typeof CustomerRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeRepository_ = container.storeRepository;
    this.productRepository_ = container.productRepository;
    this.customerRepository_ = container.customerRepository;
    try {
      this.loggedInCustomer_ = container.loggedInCustomer;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }
  async listAndCountSeller(): Promise<[Product[], number]> {
    try {
      const selector = { store_id: this.loggedInCustomer_.store_id };
      const listproduct = await super.listAndCount(selector, {
        select: [
          "collection_id",
          "created_at",
          "deleted_at",
          "description",
          "discountable",
          "external_id",
          "handle",
          "height",
          "hs_code",
          "id",
          "is_giftcard",
          "length",
          "material",
          "metadata",
          "mid_code",
          "origin_country",
          "status",
          "store_id",
          "subtitle",
          "thumbnail",
          "title",
          "type_id",
          "updated_at",
          "weight",
          "width",
        ],
        relations: [
          "categories",
          "collection",
          "images",
          "options",
          "profiles",
          "store",
          "tags",
          "type",
          "variants",
          "variants.options",
          "variants.prices",
        ],
        skip: 0,
        take: 50,
        order: { created_at: "DESC" },
      });
      return listproduct;
    } catch (error) {}
  }

  async listAndCount(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    config.select?.push("store_id");
    config.relations?.push("store");

    const productsWhitStore = await super.listAndCount(selector, config);
    const customerRepo = this.manager_.withRepository(this.customerRepository_);
    const productsWhitCustomer = await Promise.all(
      productsWhitStore[0].map(async (p) => {
        const customer = await customerRepo.findOne({
          where: {
            store_id: p.store_id,
          },
        });
        return { ...p, customer: customer || null } as unknown as Product;
      })
    );

    return [productsWhitCustomer, productsWhitStore[1]];
  }

  async retrieve(
    productId: string,
    config?: FindProductConfig
  ): Promise<Product> {
    config.relations = [...(config.relations || []), "store"];

    const product = await super.retrieve(productId, config);
    if (
      product.store?.id &&
      this.loggedInCustomer_?.store_id &&
      product.store.id !== this.loggedInCustomer_.store_id
    ) {
      // Throw error if you don't want a product to be accessible to other stores
      throw new Error("Product does not exist in store.");
    }

    return product;
  }

  async createProductStoreCustomer(
    productObject: CreateProductInput,
    fileImage: string
  ): Promise<Product> {
    if (!productObject.store_id && !this.loggedInCustomer_?.store_id) {
      throw "No hay tienda a la cual relacionar";
    }

    productObject.store_id = this.loggedInCustomer_.store_id;
    if (fileImage) {
      productObject.thumbnail = `${
        process.env.BACKEND_URL ?? "http://localhost:9000"
      }/${fileImage}`;
    }

    const newProduct = await super.create(productObject);

    return newProduct;
  }
}

export default ProductService;
