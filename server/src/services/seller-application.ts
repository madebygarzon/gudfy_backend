import { TransactionBaseService } from "@medusajs/medusa";
import { SellerApplicationRepository } from "../repositories/seller-application";
import CustomerRepository from "../repositories/customer";
import CustomerService from "./customer";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

type updateSellerAplication = {
  payload: string;
  customer_id: string;
};

export default class SellerApplicationService extends TransactionBaseService {
  protected readonly sellerApplicationRepository_: typeof SellerApplicationRepository;
  protected readonly customerRepository_: typeof CustomerRepository;
  protected readonly customerService_: CustomerService;

  constructor({
    sellerApplicationRepository,
    customerRepository,
    customerService,
  }) {
    super(arguments[0]);
    this.sellerApplicationRepository_ = sellerApplicationRepository;
    this.customerRepository_ = customerRepository;
    this.customerService_ = customerService;
  }

  async create(customer_id, identification_number, address) {
    if (!customer_id || !identification_number || !address)
      throw new Error("Adding the data required for create seller application");

    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    const createSellerapplication = sellerApplicationRepository.create({
      customer_id,
      identification_number,
      address,
      approved: false,
      rejected: false,
    });
    const sellerapplication = await sellerApplicationRepository.save(
      createSellerapplication
    );
    return sellerapplication;
  }

  async getApplication(customer_id) {
    if (!customer_id)
      throw new Error("Adding the data required for the seller application");
    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    const getApplication = await sellerApplicationRepository.findOne({
      where: {
        customer_id,
      },
    });

    if (getApplication)
      return {
        application: true,
        approved: getApplication.approved,
        rejected: getApplication.rejected,
      };

    return { application: false, approved: false };
  }

  async getListApplication(order) {
    try {
      const sellerApplicationRepository = this.activeManager_.withRepository(
        this.sellerApplicationRepository_
      );

      const getList = await sellerApplicationRepository.find({
        order: { created_at: order },
      });

      const dataList = await Promise.all(
        getList.map(async (data) => {
          const dataCustomer = await this.retrieveCustomer(data.customer_id);
          return {
            ...data,
            customer: dataCustomer,
          };
        })
      );

      return dataList;
    } catch (error) {
      console.log("LISTA DE APLICACIONES ERROR", error);
    }
  }

  async updateSellerAplication(payload, customer_id, comment_status?) {
    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    if (!payload || !customer_id) {
      throw new Error(
        "Updating a product review requires payload, customer_id"
      );
    }
    if (payload === "REJECTED" && !comment_status) {
      throw new Error("A comment is expected, comment_status");
    }
    if (payload === "APPROVED") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          approved: true,
          rejected: false,
        }
      );

      // se crea una tienda solamente si la solicitud esta aprovada.
      //createStore() tiene una validacion la cual retorna si ya tiene una tienda asociada
      await this.customerService_.createStore(customer_id);

      return sellerApplication;
    } else if (payload === "REJECTED") {
      const sellerApplication = await sellerApplicationRepository.update(
        { customer_id: customer_id },
        {
          approved: false,
          rejected: true,
          comment_status: comment_status,
        }
      );
      return sellerApplication;
    }
    return;
  }

  async getComment(customer_id) {
    const commentSellerApplication = this.manager_.withRepository(
      this.sellerApplicationRepository_
    );
    const comment = await commentSellerApplication.findOne({
      where: {
        customer_id: customer_id,
      },
    });
    return comment;
  }

  async updateComment(customer_id, comment_status) {
    const sellerApplicationRepository = this.activeManager_.withRepository(
      this.sellerApplicationRepository_
    );
    if (!customer_id) {
      throw new Error("Updating a product review requires  customer_id");
    }

    const sellerApplication = await sellerApplicationRepository.update(
      { customer_id: customer_id },
      { comment_status: comment_status }
    );

    return sellerApplication;
  }

  private async retrieveCustomer(customerId: string) {
    const customerRepository = this.manager_.withRepository(
      this.customerRepository_
    );
    const dataCustomer = await customerRepository.findOne({
      where: {
        id: customerId,
      },
    });
    return {
      name: `${dataCustomer.first_name} ${dataCustomer.last_name}`,
      email: dataCustomer.email,
    };
  }
}
