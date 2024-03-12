import { Lifetime } from "awilix";
import { CustomerService as MedusaCustomerService } from "@medusajs/medusa";
import { Customer } from "../models/customer";
import {
  UpdateCustomerInput as MedusaUpdateCustomerInput,
  CreateCustomerInput as MedusaCreateCustomerInput,
} from "@medusajs/medusa/dist/types/customers";
import StoreRepository from "../repositories/store";
import CustomerRoleRepository from "../repositories/customer-role";

type UpdateCustomerInput = {
  store_id?: string;
} & MedusaUpdateCustomerInput;

type CreateCustomerInput = {
  role_id?: number;
} & MedusaCreateCustomerInput;

class CustomerService extends MedusaCustomerService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly customerRoleRepository_: typeof CustomerRoleRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeRepository_ = container.storeRepository;
    this.customerRoleRepository_ = container.customerRoleRepository;
    try {
      this.loggedInCustomer_ = container.loggedInCustomer;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async createStore(customerId: string): Promise<Customer> {
    const customerRepository = this.manager_.withRepository(
      this.customerRepository_
    );

    const customer = await customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (customer.store_id) return;

    const storeRepo = this.manager_.withRepository(this.storeRepository_);
    let newStore = storeRepo.create();
    newStore = await storeRepo.save(newStore);

    const updateData: UpdateCustomerInput = {
      ...customer,
      store_id: newStore.id,
    };

    await super.update(customerId, updateData);
    return;
  }

  async create(customer: CreateCustomerInput): Promise<Customer> {
    const dataCustomer: CreateCustomerInput = {
      ...customer,
      role_id: 1,
    };

    return await super.create(dataCustomer);
  }
}

export default CustomerService;
